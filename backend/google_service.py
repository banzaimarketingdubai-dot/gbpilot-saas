import os
import requests
from typing import Dict, Any, Optional, List

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
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",  # Request refresh_token for background automation
        "prompt": "consent",      # Force consent screen to ensure refresh_token is returned
    }
    if state:
        params["state"] = state

    query_string = "&".join(f"{k}={requests.utils.quote(v)}" for k, v in params.items())
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
        wildcard_url = "https://mybusinessbusinessinformation.googleapis.com/v1/accounts/-/locations?readMask=name,title,storefrontAddress,websiteUri,phoneNumbers,categories,latlng"
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
                loc_url = f"https://mybusinessbusinessinformation.googleapis.com/v1/{account_name}/locations?readMask=name,title,categories,storefrontAddress,phoneNumbers,websiteUri,latlng"
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
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.internationalPhoneNumber,places.websiteUri,places.primaryTypeDisplayName,places.photos,places.reviews,places.googleMapsUri',
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
                    "rating": place.get("rating", 4.5),
                    "reviews_count": place.get("userRatingCount", 0),
                    "lat": place.get("location", {}).get("latitude"),
                    "lng": place.get("location", {}).get("longitude"),
                    "phone": place.get("internationalPhoneNumber", ""),
                    "website_url": place.get("websiteUri", ""),
                    "category": cat_name,
                    "primary_category": cat_name,
                    "cover_url": photo_url,
                    "reviews": parsed_reviews
                }
    except Exception as e:
        print(f"[GoogleService] Public Place API lookup failed: {e}")
    return None

def search_places_for_geo_grid(keyword: str, lat: float, lng: float, radius_meters: float = 500.0) -> List[Dict[str, Any]]:
    """
    Searches for businesses matching the keyword around a specific lat/lng point 
    using Google Places API (New) LocationBias.
    """
    if not GOOGLE_PLACES_API_KEY:
        return []
        
    try:
        url = 'https://places.googleapis.com/v1/places:searchText'
        headers = {
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating',
            'Content-Type': 'application/json'
        }
        data = {
            'textQuery': keyword,
            'locationBias': {
                'circle': {
                    'center': {'latitude': lat, 'longitude': lng},
                    'radius': radius_meters
                }
            }
        }
        res = requests.post(url, headers=headers, json=data, timeout=8)
        if res.ok:
            places = res.json().get("places", [])
            results = []
            for p in places:
                results.append({
                    "name": p.get("displayName", {}).get("text"),
                    "address": p.get("formattedAddress"),
                    "lat": p.get("location", {}).get("latitude"),
                    "lng": p.get("location", {}).get("longitude"),
                    "rating": p.get("rating", 0)
                })
            return results
    except Exception as e:
        print(f"[GoogleService] GeoGrid API lookup failed: {e}")
    return []

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

def publish_google_post(access_token: str, location_name: str, post_text: str) -> bool:
    """
    Publishes a new 'Local Post' (Offer, Update, or Event) to the Google Business Profile.
    """
    if not access_token:
        raise ValueError("No OAuth access token provided")
        
    try:
        url = f"https://mybusiness.googleapis.com/v4/{location_name}/localPosts"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "languageCode": "en-US",
            "summary": post_text,
            "callToAction": {
                "actionType": "LEARN_MORE",
                "url": "https://gbpilot.com"
            }
        }
        res = requests.post(url, headers=headers, json=payload, timeout=5)
        return res.ok
    except Exception as e:
        print(f"[GoogleService] Exception publishing post: {e}")
        return False
