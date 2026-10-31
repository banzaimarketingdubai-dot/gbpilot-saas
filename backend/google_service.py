import time
import math
import os
import requests
import urllib.parse
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/v1/auth/google/callback")
GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY") or os.environ.get("GOOGLE_MAPS_API_KEY")

# Scopes needed for managing Google Business Profiles
SCOPES = [
    "https://www.googleapis.com/auth/business.manage",
    "openid",
    "email",
    "profile"
]

def get_google_auth_url(state: Optional[str] = None) -> str:
    """
    Generates the Google OAuth 2.0 Consent URL for the user to grant access.
    """
    params = {
        "response_type": "code",
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "scope": " ".join(SCOPES),
        "access_type": "offline",  # Request refresh_token for background automation
        "prompt": "consent",      # Force consent screen to ensure refresh_token is returned
    }
    if state:
        params["state"] = state

    query_string = urllib.parse.urlencode(params)
    return f"https://accounts.google.com/o/oauth2/v2/auth?{query_string}"

def exchange_code_for_tokens(code: str) -> Dict[str, Any]:
    """
    Exchanges authorization code for access_token and refresh_token.
    """
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    
    response = requests.post(token_url, data=payload)
    if not response.ok:
        raise Exception(f"Failed to exchange Google OAuth code: {response.text}")
        
    return response.json()

def get_google_user_info(access_token: str) -> Dict[str, Any]:
    """
    Fetches basic profile info (email, name) for the authenticated Google user.
    """
    userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}
    
    response = requests.get(userinfo_url, headers=headers)
    if response.ok:
        return response.json()
    return {}

def parse_google_location(loc: Dict[str, Any], role: str = "OWNER") -> Dict[str, Any]:
    """Parses raw Google Business Profile API location into GBPilot BusinessProfile dict."""
    store_addr = loc.get("storefrontAddress", {}) or loc.get("address", {})
    address_lines = store_addr.get("addressLines", []) if isinstance(store_addr, dict) else []
    locality = store_addr.get("locality") or store_addr.get("administrativeArea") or "Dubai" if isinstance(store_addr, dict) else "Dubai"
    address = ", ".join(address_lines) if address_lines else locality
    
    title = loc.get("title") or loc.get("locationName") or loc.get("name") or "My Business"
    categories = loc.get("categories", {})
    primary_cat = "Local Business"
    if isinstance(categories, dict):
        primary_cat = categories.get("primaryCategory", {}).get("displayName", "Local Business")
    
    phone_info = loc.get("phoneNumbers", {})
    phone = phone_info.get("primaryPhone", "") if isinstance(phone_info, dict) else str(loc.get("primaryPhone", ""))
    website = loc.get("websiteUri", "") or loc.get("websiteUrl", "")
    loc_name = loc.get("name", "")
    loc_id = loc_name.split("/")[-1] if "/" in loc_name else (loc_name or f"loc_{os.urandom(4).hex()}")
    
    latlng = loc.get("latlng", {})
    lat = latlng.get("latitude", 25.2048) if isinstance(latlng, dict) else 25.2048
    lng = latlng.get("longitude", 55.2708) if isinstance(latlng, dict) else 55.2708

    role_str = str(role).upper()
    role_display = "Owner" if "OWNER" in role_str else "Manager"

    return {
        "id": f"profile_{loc_id}",
        "google_location_id": loc_name or loc_id,
        "name": title,
        "business_name": title,
        "address": address,
        "city": locality,
        "primary_category": primary_cat,
        "category": primary_cat,
        "phone": phone,
        "phone_number": phone,
        "website_url": website,
        "latitude": lat,
        "longitude": lng,
        "health_score": 88,
        "role": role_display,
        "is_admin": True,
        "verified": True,
        "source": "google_my_business",
        "autopilotMode": "MANUAL_APPROVAL"
    }

def fetch_user_managed_locations(access_token: str) -> Dict[str, Any]:
    """
    Fetches all live Google Business Profile locations owned or managed by the authenticated user.
    Uses wildcard accounts/-/locations endpoint and accounts enumeration fallback.
    Returns {"locations": [...], "error": None or str, "api_disabled": bool}
    """
    result = {"locations": [], "error": None, "api_disabled": False}
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Method 1: Wildcard endpoint to fetch all locations across all accounts directly
    try:
        wildcard_url = "https://mybusinessbusinessinformation.googleapis.com/v1/accounts/-/locations?readMask=name,title,storefrontAddress,websiteUri,phoneNumbers,categories,latlng,regularHours,profile,openInfo,metadata"
        res_w = requests.get(wildcard_url, headers=headers, timeout=8)
        if res_w.ok:
            w_data = res_w.json()
            locs = w_data.get("locations", [])
            if locs:
                result["locations"] = [parse_google_location(l, "OWNER") for l in locs]
                print(f"[GoogleService] Wildcard locations fetched: {len(result['locations'])}")
                return result
        elif res_w.status_code == 403:
            print(f"[GoogleService] Wildcard returned 403: {res_w.text}")
            if "has not been used in project" in res_w.text or "is disabled" in res_w.text:
                result["api_disabled"] = True
                result["error"] = "API_DISABLED"
                result["missing_api"] = "mybusinessbusinessinformation.googleapis.com"
    except Exception as e:
        print(f"[GoogleService] Wildcard query error: {e}")

    # Method 2: Step 1 List Accounts, then Step 2 List Locations
    try:
        accounts_url = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts"
        res = requests.get(accounts_url, headers=headers, timeout=8)
        if res.ok:
            data = res.json()
            accounts = data.get("accounts", [])
            for account in accounts:
                account_name = account.get("name") # e.g. "accounts/12345"
                role = account.get("role", "OWNER")
                loc_url = f"https://mybusinessbusinessinformation.googleapis.com/v1/{account_name}/locations?readMask=name,title,categories,storefrontAddress,phoneNumbers,websiteUri,latlng,regularHours,profile,openInfo,metadata"
                loc_res = requests.get(loc_url, headers=headers, timeout=8)
                if loc_res.ok:
                    loc_data = loc_res.json()
                    for l in loc_data.get("locations", []):
                        result["locations"].append(parse_google_location(l, role))
                else:
                    print(f"[GoogleService] Locations for {account_name} failed: {loc_res.status_code} {loc_res.text}")
                    if loc_res.status_code == 403 and ("disabled" in loc_res.text or "not been used" in loc_res.text):
                        result["api_disabled"] = True
                        result["error"] = "API_DISABLED"
                        result["missing_api"] = "mybusinessbusinessinformation.googleapis.com"
            if result["locations"]:
                return result
        else:
            print(f"[GoogleService] Accounts endpoint returned {res.status_code}: {res.text}")
            if res.status_code == 403 and ("disabled" in res.text or "not been used" in res.text):
                result["api_disabled"] = True
                result["error"] = "API_DISABLED"
                result["missing_api"] = "mybusinessaccountmanagement.googleapis.com"
    except Exception as e:
        print(f"[GoogleService] Accounts query error: {e}")
        result["error"] = str(e)

    # Method 3: Legacy v4 fallback
    try:
        v4_url = "https://mybusiness.googleapis.com/v4/accounts"
        res_v4 = requests.get(v4_url, headers=headers, timeout=8)
        if res_v4.ok:
            v4_data = res_v4.json()
            for acc in v4_data.get("accounts", []):
                acc_name = acc.get("name")
                acc_role = acc.get("role", "OWNER")
                v4_loc_url = f"https://mybusiness.googleapis.com/v4/{acc_name}/locations"
                res_v4_loc = requests.get(v4_loc_url, headers=headers, timeout=8)
                if res_v4_loc.ok:
                    for l in res_v4_loc.json().get("locations", []):
                        result["locations"].append(parse_google_location(l, acc_role))
    except Exception as e:
        print(f"[GoogleService] v4 query error: {e}")
        
    return result

def resolve_google_maps_url(url: str) -> Optional[str]:
    """
    Expands short Google Maps URLs (maps.app.goo.gl) or extracts place query from full Google Maps URLs.
    """
    if not url:
        return None
    url = url.strip()
    try:
        if "maps.app.goo.gl" in url or "goo.gl/maps" in url:
            res = requests.head(url, allow_redirects=True, timeout=5)
            url = res.url

        if "/place/" in url:
            parts = url.split("/place/")[1].split("/")
            raw_name = parts[0].split("?")[0].replace("+", " ")
            clean_name = requests.utils.unquote(raw_name)
            return clean_name
        elif "q=" in url:
            import urllib.parse
            parsed = urllib.parse.urlparse(url)
            params = urllib.parse.parse_qs(parsed.query)
            if "q" in params:
                return params["q"][0]
    except Exception as e:
        print(f"[GoogleService] Google Maps URL resolve error: {e}")
    return None

def get_public_place_details(query: str) -> Optional[Dict[str, Any]]:
    """
    Fetches official Google Places API (New) data for ANY public business (by name or Maps URL).
    """
    if not GOOGLE_PLACES_API_KEY:
        return None

    # If query is a URL, resolve to place name
    if query.startswith("http://") or query.startswith("https://"):
        resolved = resolve_google_maps_url(query)
        if resolved:
            query = resolved
        
    try:
        url = 'https://places.googleapis.com/v1/places:searchText'
        headers = {
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.internationalPhoneNumber,places.websiteUri,places.primaryTypeDisplayName,places.photos,places.reviews,places.googleMapsUri,places.regularOpeningHours,places.currentOpeningHours',
            'Content-Type': 'application/json'
        }
        data = {'textQuery': query}
        res = requests.post(url, headers=headers, json=data, timeout=6)
        if res.ok:
            results = res.json().get("places", [])
            if results:
                place = results[0]
                place_maps_uri = place.get("googleMapsUri") or f"https://www.google.com/maps/place/?q=place_id:{place.get('id')}"
                photo_url = None
                photos = place.get("photos", [])
                if photos:
                    photo_name = photos[0].get("name") # e.g. places/ChIJ.../photos/...
                    if photo_name:
                        photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?maxHeightPx=600&maxWidthPx=800&key={GOOGLE_PLACES_API_KEY}"
                
                cat_name = place.get("primaryTypeDisplayName", {}).get("text") or "Local Business"

                # Extract opening hours
                open_now = (place.get("currentOpeningHours") or {}).get("openNow")
                opening_hours = (place.get("regularOpeningHours") or {}).get("weekdayDescriptions", [])

                parsed_reviews = []
                for r in place.get("reviews", []):
                    r_rating = r.get("rating", 5)
                    r_text = (r.get("text", {}) or {}).get("text", "") or (r.get("originalText", {}) or {}).get("text", "")
                    author_obj = r.get("authorAttribution", {}) or {}
                    author_name = author_obj.get("displayName", "Anonymous")
                    publish_time = r.get("relativePublishTimeDescription", "")
                    rev_url = r.get("googleMapsUri") or place_maps_uri
                    parsed_reviews.append({
                        "id": r.get("name", "").split("/")[-1] if "/" in r.get("name", "") else f"rev_{len(parsed_reviews)}",
                        "author_name": author_name,
                        "rating": r_rating,
                        "review_date": publish_time,
                        "review_text": r_text,
                        "google_review_url": rev_url
                    })

                return {
                    "place_id": place.get("id"),
                    "business_name": place.get("displayName", {}).get("text"),
                    "address": place.get("formattedAddress"),
                    "google_maps_url": place_maps_uri,
                    "rating": place.get("rating") or 0,
                    "reviews_count": place.get("userRatingCount", 0),
                    "lat": place.get("location", {}).get("latitude"),
                    "lng": place.get("location", {}).get("longitude"),
                    "phone": place.get("internationalPhoneNumber", ""),
                    "website_url": place.get("websiteUri", ""),
                    "category": cat_name,
                    "primary_category": cat_name,
                    "cover_url": photo_url,
                    "open_now": open_now,
                    "opening_hours": opening_hours,
                    "reviews": parsed_reviews
                }
    except Exception as e:
        print(f"[GoogleService] Public Place API lookup failed: {e}")
    return None

_GENERIC_PLACE_TYPES = {
    "point_of_interest", "establishment", "local_business", "store",
    "service", "food", "premise", "subpremise", "route", "political",
    "locality", "general_contractor",
}


def _humanize_place_type(raw_type: str) -> str:
    if not raw_type:
        return ""
    return raw_type.replace("_", " ").strip().title()


_GRID_FIELD_MASK = (
    'places.id,places.displayName,places.formattedAddress,places.location,'
    'places.rating,places.userRatingCount,places.primaryType,'
    'places.primaryTypeDisplayName,places.types,places.googleMapsUri,'
    'places.websiteUri,places.internationalPhoneNumber,'
    'places.currentOpeningHours,places.photos,places.priceLevel'
)


def _parse_grid_place(p: Dict[str, Any]) -> Dict[str, Any]:
    place_id = p.get("id") or ""
    name = (p.get("displayName") or {}).get("text") or ""
    primary_display = (p.get("primaryTypeDisplayName") or {}).get("text")
    primary_raw = p.get("primaryType") or ""
    primary_cat = primary_display or _humanize_place_type(primary_raw) or ""
    secondary_cats: List[str] = []
    for t in (p.get("types") or []):
        if t in _GENERIC_PLACE_TYPES or t == primary_raw:
            continue
        label = _humanize_place_type(t)
        if label and label.lower() != primary_cat.lower() and label not in secondary_cats:
            secondary_cats.append(label)
    if not primary_cat and secondary_cats:
        primary_cat = secondary_cats.pop(0)

    maps_uri = p.get("googleMapsUri") or (
        f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(name)}"
        + (f"&query_place_id={place_id}" if place_id else "")
    )
    return {
        "place_id": place_id,
        "name": name,
        "address": p.get("formattedAddress") or "",
        "lat": (p.get("location") or {}).get("latitude"),
        "lng": (p.get("location") or {}).get("longitude"),
        "rating": p.get("rating") or 0,
        "reviews_count": p.get("userRatingCount") or 0,
        "primary_category": primary_cat,
        "secondary_categories": secondary_cats[:5],
        "google_maps_url": maps_uri,
        "website_url": p.get("websiteUri") or "",
        "phone": p.get("internationalPhoneNumber") or "",
        "open_now": (p.get("currentOpeningHours") or {}).get("openNow"),
        "has_hours": bool(p.get("currentOpeningHours")),
        "photos_count": len(p.get("photos") or []),
        "price_level": p.get("priceLevel") or "",
    }


def search_places_grid_point(
    keyword: str,
    lat: float,
    lng: float,
    radius_meters: float = 500.0,
    mode: str = "bias",
    step_meters: float = 500.0,
    page_size: int = 20,
) -> Optional[List[Dict[str, Any]]]:
    """
    One Geo-Grid point lookup via Places API (New) Text Search.

    Returns:
      - list (possibly empty) -> Google answered; empty list = nothing found
      - None                  -> API key missing / request failed (NO DATA, must never be shown as a rank)

    mode="bias":   circular locationBias around the point (soft preference, closest to a real user search)
    mode="strict": rectangular locationRestriction (+/- step_meters) - only businesses inside the box
    """
    if not GOOGLE_PLACES_API_KEY:
        return None

    url = 'https://places.googleapis.com/v1/places:searchText'
    headers = {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': _GRID_FIELD_MASK,
        'Content-Type': 'application/json'
    }
    data: Dict[str, Any] = {
        'textQuery': keyword,
        'pageSize': max(1, min(20, int(page_size))),
    }
    if mode == "strict":
        d_lat = step_meters / 111111.0
        d_lng = step_meters / (111111.0 * max(0.1, math.cos(math.radians(lat))))
        data['locationRestriction'] = {
            'rectangle': {
                'low': {'latitude': lat - d_lat, 'longitude': lng - d_lng},
                'high': {'latitude': lat + d_lat, 'longitude': lng + d_lng},
            }
        }
    else:
        data['locationBias'] = {
            'circle': {
                'center': {'latitude': lat, 'longitude': lng},
                'radius': min(50000.0, float(radius_meters)),
            }
        }

    for attempt in range(2):
        try:
            res = requests.post(url, headers=headers, json=data, timeout=10)
            if res.ok:
                return [_parse_grid_place(p) for p in res.json().get("places", [])]
            if res.status_code in (429, 500, 502, 503) and attempt == 0:
                time.sleep(0.7)
                continue
            print(f"[GoogleService] GeoGrid point HTTP {res.status_code}: {res.text[:200]}")
            return None
        except Exception as e:
            if attempt == 0:
                time.sleep(0.5)
                continue
            print(f"[GoogleService] GeoGrid point lookup failed: {e}")
            return None
    return None


def get_place_location_by_id(place_id: str) -> Optional[Dict[str, Any]]:
    """Resolve coordinates/name of a known Google place_id (Place Details, minimal field mask)."""
    if not GOOGLE_PLACES_API_KEY or not place_id:
        return None
    try:
        res = requests.get(
            f'https://places.googleapis.com/v1/places/{place_id}',
            headers={
                'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
                'X-Goog-FieldMask': 'id,displayName,location,formattedAddress',
            },
            timeout=8,
        )
        if res.ok:
            p = res.json()
            return {
                "place_id": p.get("id") or place_id,
                "name": (p.get("displayName") or {}).get("text") or "",
                "address": p.get("formattedAddress") or "",
                "lat": (p.get("location") or {}).get("latitude"),
                "lng": (p.get("location") or {}).get("longitude"),
            }
    except Exception as e:
        print(f"[GoogleService] Place location lookup failed: {e}")
    return None


def get_place_profile_by_id(place_id: str) -> Optional[Dict[str, Any]]:
    """Full comparable profile of one known place (same fields as grid results). None on failure."""
    if not GOOGLE_PLACES_API_KEY or not place_id:
        return None
    try:
        mask = _GRID_FIELD_MASK.replace("places.", "")
        res = requests.get(
            f'https://places.googleapis.com/v1/places/{place_id}',
            headers={'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY, 'X-Goog-FieldMask': mask},
            timeout=8,
        )
        if res.ok:
            return _parse_grid_place(res.json())
        print(f"[GoogleService] Place profile HTTP {res.status_code}: {res.text[:160]}")
    except Exception as e:
        print(f"[GoogleService] Place profile lookup failed: {e}")
    return None


def search_places_for_geo_grid(keyword: str, lat: float, lng: float, radius_meters: float = 500.0) -> List[Dict[str, Any]]:
    """Backward-compatible wrapper (B2B outreach): empty list on failure."""
    return search_places_grid_point(keyword, lat, lng, radius_meters) or []

def autocomplete_places(query: str, lat: Optional[float] = None, lng: Optional[float] = None) -> List[Dict[str, str]]:
    """
    Fetches autocomplete suggestions for a business name using Google Places API (New).
    Optionally biased to a lat/lng.
    """
    if not GOOGLE_PLACES_API_KEY or not query:
        return []
        
    try:
        url = 'https://places.googleapis.com/v1/places:autocomplete'
        headers = {
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            'Content-Type': 'application/json'
        }
        data = {'input': query}
        if lat is not None and lng is not None:
            data['locationBias'] = {
                'circle': {
                    'center': {'latitude': lat, 'longitude': lng},
                    'radius': 50000.0 # 50km radius bias
                }
            }
            
        res = requests.post(url, headers=headers, json=data, timeout=3)
        if res.ok:
            suggestions = res.json().get("suggestions", [])
            results = []
            for s in suggestions:
                pred = s.get("placePrediction", {})
                if pred:
                    main_text = pred.get("structuredFormat", {}).get("mainText", {}).get("text", "")
                    sec_text = pred.get("structuredFormat", {}).get("secondaryText", {}).get("text", "")
                    full_text = f"{main_text}, {sec_text}" if sec_text else main_text
                    
                    results.append({
                        "place_id": pred.get("placeId"),
                        "description": full_text,
                        "main_text": main_text
                    })
            return results
    except Exception as e:
        print(f"[GoogleService] Autocomplete API failed: {e}")
    return []

def fetch_google_reviews(access_token: str, location_name: str) -> List[Dict[str, Any]]:
    """
    Fetches real Google reviews for a specific location using GMB API.
    location_name should be formatted like 'accounts/123/locations/456' or 'locations/456'
    """
    if not access_token:
        raise ValueError("No OAuth access token provided")
        
    try:
        url = f"https://mybusiness.googleapis.com/v4/{location_name}/reviews"
        headers = {"Authorization": f"Bearer {access_token}"}
        res = requests.get(url, headers=headers, timeout=5)
        
        if res.ok:
            data = res.json()
            return data.get("reviews", [])
        else:
            print(f"[GoogleService] Failed to fetch reviews: {res.text}")
            return []
    except Exception as e:
        print(f"[GoogleService] Exception fetching reviews: {e}")
        return []

def publish_google_post(access_token: str, location_name: str, post_text: str, cta_url: Optional[str] = None, cta_type: str = "LEARN_MORE") -> bool:
    """
    Publishes a new 'Local Post' to the Google Business Profile via v4 API.
    Automatically resolves account_name if location_name is 'locations/123'.
    """
    if not access_token:
        raise ValueError("No OAuth access token provided")
        
    try:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        loc_ref = location_name if "locations/" in location_name else f"locations/{location_name}"
        if not loc_ref.startswith("accounts/"):
            acc_res = requests.get("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", headers=headers, timeout=6)
            if acc_res.ok and acc_res.json().get("accounts"):
                acc_name = acc_res.json()["accounts"][0].get("name")
                loc_ref = f"{acc_name}/{loc_ref}"

        url = f"https://mybusiness.googleapis.com/v4/{loc_ref}/localPosts"
        payload: Dict[str, Any] = {
            "languageCode": "en-US",
            "summary": post_text,
            "topicType": "STANDARD",
        }
        if cta_url:
            payload["callToAction"] = {
                "actionType": cta_type or "LEARN_MORE",
                "url": cta_url
            }
        res = requests.post(url, headers=headers, json=payload, timeout=8)
        if not res.ok:
            print(f"[GoogleService] publish_google_post failed: {res.status_code} {res.text}")
        return res.ok
    except Exception as e:
        print(f"[GoogleService] Exception publishing post: {e}")
        return False


# ============================================================================
# DEEP SYNC: full Google Business Profile snapshot (Business Information,
# Performance, v4 Reviews/Posts/Media APIs). Every section is fetched
# independently so one failing API never blanks the whole snapshot.
# ============================================================================

FULL_READ_MASK = (
    "name,title,storeCode,languageCode,categories,storefrontAddress,phoneNumbers,"
    "websiteUri,regularHours,specialHours,moreHours,serviceItems,profile,openInfo,"
    "metadata,latlng,serviceArea,labels,adWordsLocationExtensions,relationshipData"
)


def refresh_access_token(refresh_token: str) -> Optional[str]:
    """Exchanges a stored refresh token for a fresh access token."""
    if not refresh_token:
        return None
    try:
        res = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "refresh_token": refresh_token,
                "grant_type": "refresh_token",
            },
            timeout=8,
        )
        if res.ok:
            return res.json().get("access_token")
        print(f"[GoogleService] Token refresh failed: {res.status_code} {res.text}")
    except Exception as e:
        print(f"[GoogleService] Token refresh error: {e}")
    return None


def _get(url: str, headers: Dict[str, str], params: Optional[Dict[str, Any]] = None):
    """GET helper returning (json | None, error | None)."""
    try:
        res = requests.get(url, headers=headers, params=params, timeout=10)
        if res.ok:
            return res.json(), None
        return None, f"{res.status_code}: {res.text[:200]}"
    except Exception as e:
        return None, str(e)


def _day_hours_summary(regular_hours: Dict[str, Any]) -> List[str]:
    periods = (regular_hours or {}).get("periods", [])
    out = []
    for p in periods:
        o, c = p.get("openTime", {}), p.get("closeTime", {})
        out.append(
            f"{p.get('openDay', '')[:3]} "
            f"{o.get('hours', 0):02d}:{o.get('minutes', 0):02d}-"
            f"{c.get('hours', 0):02d}:{c.get('minutes', 0):02d}"
        )
    return out


def deep_sync_location(access_token: str, location_id: str) -> Dict[str, Any]:
    """
    Builds a full live snapshot of one location.
    location_id: 'locations/123' or just '123'.
    Returns {"fields": {...}, "sources": {section: "ok" | error}}.
    """
    loc_ref = location_id if location_id.startswith("locations/") else f"locations/{location_id.split('/')[-1]}"
    loc_num = loc_ref.split("/")[-1]
    headers = {"Authorization": f"Bearer {access_token}"}
    sources: Dict[str, str] = {}
    f: Dict[str, Any] = {}

    # 1. Business Information: core listing
    info, err = _get(
        f"https://mybusinessbusinessinformation.googleapis.com/v1/{loc_ref}",
        headers, {"readMask": FULL_READ_MASK},
    )
    sources["business_information"] = err or "ok"
    if info:
        cats = info.get("categories", {}) or {}
        f["title"] = info.get("title")
        f["primary_category"] = (cats.get("primaryCategory") or {}).get("displayName")
        f["additional_categories"] = [c.get("displayName") for c in cats.get("additionalCategories", [])]
        f["phone_primary"] = (info.get("phoneNumbers") or {}).get("primaryPhone")
        f["phone_additional"] = (info.get("phoneNumbers") or {}).get("additionalPhones", [])
        f["website"] = info.get("websiteUri")
        f["description"] = (info.get("profile") or {}).get("description")
        f["address"] = info.get("storefrontAddress")
        f["open_status"] = (info.get("openInfo") or {}).get("status")
        f["regular_hours"] = _day_hours_summary(info.get("regularHours"))
        f["special_hours_count"] = len((info.get("specialHours") or {}).get("specialHourPeriods", []))
        f["more_hours_types"] = [m.get("hoursTypeId") for m in info.get("moreHours", [])]
        f["service_items_count"] = len(info.get("serviceItems", []))
        f["service_area"] = bool(info.get("serviceArea"))
        f["labels"] = info.get("labels", [])
        meta = info.get("metadata") or {}
        f["has_voice_of_merchant"] = meta.get("hasVoiceOfMerchant")
        f["maps_uri"] = meta.get("mapsUri")
        f["new_review_uri"] = meta.get("newReviewUri")
        f["place_id"] = meta.get("placeId")
        f["can_delete"] = meta.get("canDelete")
        f["duplicate"] = bool(meta.get("duplicateLocation"))

    # 2. Attributes
    attrs, err = _get(
        f"https://mybusinessbusinessinformation.googleapis.com/v1/{loc_ref}/attributes", headers
    )
    sources["attributes"] = err or "ok"
    if attrs:
        f["attributes_set"] = [
            a.get("name", "").split("/")[-1] for a in attrs.get("attributes", [])
        ]
        f["attributes_count"] = len(f["attributes_set"])

    # 3. Performance: last 30 days of search/maps/calls/clicks
    from datetime import date, timedelta
    end, start = date.today() - timedelta(days=2), date.today() - timedelta(days=32)
    metrics = [
        "BUSINESS_IMPRESSIONS_DESKTOP_MAPS", "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
        "BUSINESS_IMPRESSIONS_MOBILE_MAPS", "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
        "CALL_CLICKS", "WEBSITE_CLICKS", "BUSINESS_DIRECTION_REQUESTS",
        "BUSINESS_BOOKINGS", "BUSINESS_FOOD_ORDERS", "BUSINESS_CONVERSATIONS",
    ]
    params = [("dailyMetrics", m) for m in metrics] + [
        ("dailyRange.startDate.year", start.year), ("dailyRange.startDate.month", start.month),
        ("dailyRange.startDate.day", start.day), ("dailyRange.endDate.year", end.year),
        ("dailyRange.endDate.month", end.month), ("dailyRange.endDate.day", end.day),
    ]
    perf, err = _get(
        f"https://businessprofileperformance.googleapis.com/v1/{loc_ref}:fetchMultiDailyMetricsTimeSeries",
        headers, params,
    )
    sources["performance"] = err or "ok"
    if perf:
        totals: Dict[str, int] = {}
        for grp in perf.get("multiDailyMetricTimeSeries", []):
            for ts in grp.get("dailyMetricTimeSeries", []):
                m = ts.get("dailyMetric")
                vals = (ts.get("timeSeries") or {}).get("datedValues", [])
                totals[m] = totals.get(m, 0) + sum(int(v.get("value", 0) or 0) for v in vals)
        f["performance_30d"] = totals
        f["impressions_30d"] = sum(v for k, v in totals.items() if k.startswith("BUSINESS_IMPRESSIONS"))

    # 4. Reviews (v4 needs an account id; wildcard-less path via accounts list)
    account_name = None
    accs, aerr = _get("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", headers)
    if accs and accs.get("accounts"):
        account_name = accs["accounts"][0].get("name")
    v4_ref = f"{account_name}/{loc_ref}" if account_name else None
    sources["accounts"] = aerr or "ok"

    if v4_ref:
        revs, err = _get(f"https://mybusiness.googleapis.com/v4/{v4_ref}/reviews", headers, {"pageSize": 50})
        sources["reviews"] = err or "ok"
        if revs:
            items = revs.get("reviews", [])
            star = {"ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5}
            f["rating"] = revs.get("averageRating")
            f["reviews_total"] = revs.get("totalReviewCount", len(items))
            f["reviews_unreplied"] = sum(1 for r in items if not r.get("reviewReply"))
            f["reviews_low_unreplied"] = sum(
                1 for r in items if not r.get("reviewReply") and star.get(r.get("starRating"), 5) <= 3
            )
            f["recent_reviews"] = [
                {
                    "author": (r.get("reviewer") or {}).get("displayName"),
                    "rating": star.get(r.get("starRating"), 0),
                    "text": r.get("comment", ""),
                    "date": r.get("createTime"),
                    "replied": bool(r.get("reviewReply")),
                }
                for r in items[:10]
            ]

        posts, err = _get(f"https://mybusiness.googleapis.com/v4/{v4_ref}/localPosts", headers, {"pageSize": 20})
        sources["local_posts"] = err or "ok"
        if posts is not None:
            plist = posts.get("localPosts", [])
            f["posts_count"] = len(plist)
            f["last_post_at"] = max((p.get("createTime", "") for p in plist), default=None)

        media, err = _get(f"https://mybusiness.googleapis.com/v4/{v4_ref}/media", headers, {"pageSize": 100})
        sources["media"] = err or "ok"
        if media is not None:
            f["photos_count"] = media.get("totalMediaItemCount", len(media.get("mediaItems", [])))

        qa, err = _get(f"https://mybusinessqanda.googleapis.com/v1/{loc_ref}/questions", headers, {"pageSize": 20})
        sources["questions"] = err or "ok"
        if qa is not None:
            f["questions_count"] = len(qa.get("questions", []))
    else:
        for s in ("reviews", "local_posts", "media"):
            sources[s] = "skipped: no account"

    return {"location": loc_ref, "fields": f, "sources": sources}


def compute_live_health(fields: Dict[str, Any]) -> Dict[str, Any]:
    """Scores the profile from real fields only; lists concrete gaps."""
    checks = [
        ("Description filled", bool(fields.get("description")), 10),
        ("Website set", bool(fields.get("website")), 8),
        ("Phone set", bool(fields.get("phone_primary")), 8),
        ("Regular hours set", bool(fields.get("regular_hours")), 10),
        ("Secondary categories (3+)", len(fields.get("additional_categories") or []) >= 3, 12),
        ("Attributes (10+)", (fields.get("attributes_count") or 0) >= 10, 8),
        ("Photos (10+)", (fields.get("photos_count") or 0) >= 10, 12),
        ("Services/menu items", (fields.get("service_items_count") or 0) > 0, 6),
        ("Post in last 30 days", bool(fields.get("last_post_at")) and _within_days(fields.get("last_post_at"), 30), 10),
        ("All reviews answered", (fields.get("reviews_unreplied") or 0) == 0, 10),
        ("Rating 4.5+", (fields.get("rating") or 0) >= 4.5, 6),
    ]
    total = sum(w for _, _, w in checks)
    score = sum(w for _, ok, w in checks if ok)
    return {
        "score": round(score * 100 / total),
        "passed": [n for n, ok, _ in checks if ok],
        "gaps": [n for n, ok, _ in checks if not ok],
    }


def _within_days(iso: Optional[str], days: int) -> bool:
    from datetime import datetime, timezone, timedelta
    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        return datetime.now(timezone.utc) - dt <= timedelta(days=days)
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Stage-1: Real keyword impressions from GBP Performance API
# ---------------------------------------------------------------------------

def get_search_keywords_impressions(access_token: str, location_name: str) -> list:
    """
    Fetches top search keywords with monthly impressions from the
    GBP Business Profile Performance API (searchkeywords.impressions.monthly).

    Args:
        access_token:   OAuth2 Bearer token for the GMB account owner.
        location_name:  Full GBP resource name, e.g. "locations/1234567890".

    Returns:
        List of dicts sorted by impressions desc:
          [{"keyword": str, "impressions": int, "source": "GBP_REAL"}, ...]
        Returns [] on any error (token expired, no data, quota hit, etc.)
    """
    from datetime import date, timedelta
    import urllib.parse

    # Use last full calendar month for stable data
    today = date.today()
    first_of_this_month = today.replace(day=1)
    last_month_end = first_of_this_month - timedelta(days=1)
    last_month_start = last_month_end.replace(day=1)

    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}

    # Clean location_name: strip leading slash if present
    loc = location_name.lstrip("/")

    params = urllib.parse.urlencode([
        ("monthlyRange.startMonth.year",  last_month_start.year),
        ("monthlyRange.startMonth.month", last_month_start.month),
        ("monthlyRange.endMonth.year",    last_month_end.year),
        ("monthlyRange.endMonth.month",   last_month_end.month),
    ])

    url = (
        f"https://businessprofileperformance.googleapis.com/v1/"
        f"{loc}/searchkeywords/impressions/monthly?{params}"
    )

    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code != 200:
            return []
        data = resp.json()
        keywords = data.get("searchKeywordsCounts", [])
        result = []
        for item in keywords:
            kw = (item.get("searchKeyword") or "").strip()
            if not kw or kw.lower() in ("local business", "establishment"):
                continue
            # insightsValue can be a dict {"value": "123"} or int
            iv = item.get("insightsValue", {})
            if isinstance(iv, dict):
                impressions = int(iv.get("value", 0) or 0)
            else:
                impressions = int(iv or 0)
            result.append({"keyword": kw, "impressions": impressions, "source": "GBP_REAL"})
        # Sort by impressions descending
        result.sort(key=lambda x: x["impressions"], reverse=True)
        return result
    except Exception:
        return []


def get_google_autocomplete_suggestions(keyword_seed: str, location_hint: str = "") -> list:
    """
    Returns Google Autocomplete suggestions for a seed term.
    Uses the unofficial but publicly accessible Maps suggest endpoint.
    No API key required; rate-limited by IP.

    Returns:
        [{"keyword": str, "source": "GOOGLE_SUGGEST"}, ...]
    """
    import urllib.parse

    query = f"{keyword_seed} {location_hint}".strip()
    url = (
        "https://maps.googleapis.com/maps/api/place/autocomplete/json"
        f"?input={urllib.parse.quote(query)}&types=establishment&language=en"
    )

    # Fallback: use suggestqueries (no key needed, returns JSON)
    fallback_url = (
        "https://suggestqueries.google.com/complete/search"
        f"?client=firefox&q={urllib.parse.quote(query)}&hl=en"
    )

    try:
        resp = requests.get(fallback_url, timeout=6, headers={"User-Agent": "Mozilla/5.0"})
        if resp.status_code == 200:
            data = resp.json()
            # suggestqueries returns [query, [suggestions]]
            suggestions = data[1] if isinstance(data, list) and len(data) > 1 else []
            return [
                {"keyword": s.strip(), "source": "GOOGLE_SUGGEST"}
                for s in suggestions
                if s.strip() and s.strip().lower() != keyword_seed.lower()
            ][:8]
    except Exception:
        pass
    return []
