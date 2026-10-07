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

def fetch_user_managed_locations(access_token: str) -> List[Dict[str, Any]]:
    """
    Fetches all live Google Business Profile locations owned or managed by the authenticated user.
    """
    try:
        # Step 1: List Accounts
        accounts_url = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts"
        headers = {"Authorization": f"Bearer {access_token}"}
        res = requests.get(accounts_url, headers=headers, timeout=5)
        
        locations = []
        if res.ok:
            data = res.json()
            accounts = data.get("accounts", [])
            for account in accounts:
                account_name = account.get("name")
                # Step 2: List Locations for each account
                loc_url = f"https://mybusinessbusinessinformation.googleapis.com/v1/{account_name}/locations?readMask=name,title,categories,storefrontAddress,phoneNumbers,websiteUri,latlng"
                loc_res = requests.get(loc_url, headers=headers, timeout=5)
                if loc_res.ok:
                    loc_data = loc_res.json()
                    locations.extend(loc_data.get("locations", []))
        return locations
    except Exception as e:
        print(f"[GoogleService] Error fetching user managed locations: {e}")
        return []

def get_public_place_details(query: str) -> Optional[Dict[str, Any]]:
    """
    Fetches official Google Places API (New) data for ANY public business.
    """
    if not GOOGLE_PLACES_API_KEY:
        return None
        
    try:
        url = 'https://places.googleapis.com/v1/places:searchText'
        headers = {
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount',
            'Content-Type': 'application/json'
        }
        data = {'textQuery': query}
        res = requests.post(url, headers=headers, json=data, timeout=5)
        if res.ok:
            results = res.json().get("places", [])
            if results:
                place = results[0]
                return {
                    "place_id": place.get("id"),
                    "business_name": place.get("displayName", {}).get("text"),
                    "address": place.get("formattedAddress"),
                    "rating": place.get("rating"),
                    "reviews_count": place.get("userRatingCount"),
                    "lat": place.get("location", {}).get("latitude"),
                    "lng": place.get("location", {}).get("longitude")
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
