import os
import requests
from typing import Dict, Any, Optional

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/v1/auth/google/callback")

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
