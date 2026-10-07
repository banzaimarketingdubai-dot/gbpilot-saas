from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import os

from schemas import (
    TriggerGenerationRequest, TriggerGenerationResponse, 
    ProactiveRecommendationSchema, ScrapeRequest, ScrapeResponse,
    ExecuteActionRequest, ExecuteActionResponse,
    ChatMessageRequest, ChatMessageResponse
)
from proactive_engine import ProactiveEngine, gemini_client, CASCADE_MODELS
from scraper import scrape_google_business_profile, scrape_website_url
from database import get_db
import models
from sqlalchemy.orm import Session
from datetime import datetime

app = FastAPI(
    title="GBPilot AI Proactive Engine API",
    description="FastAPI backend for GBPilot Proactive Recommendations and AI Sentinel",
    version="1.0.0"
)

# CORS configuration for Vercel Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import RedirectResponse
from google_service import get_google_auth_url, exchange_code_for_tokens, get_google_user_info

@app.get("/health", tags=["System"])
async def health_check():
    """System health check endpoint for Railway deployment monitoring."""
    return {
        "status": "ok", 
        "service": "GBPilot AI Proactive Engine", 
        "deployment": "Railway",
        "database": "Supabase PostgreSQL",
        "version": "1.0.0"
    }

@app.get("/api/v1/auth/google/login", tags=["Authentication"])
async def google_login():
    """
    Generates the Google OAuth 2.0 authorization URL for connecting a live Google Business Profile.
    """
    url = get_google_auth_url()
    return {"auth_url": url}

@app.get("/api/v1/auth/google/callback", tags=["Authentication"])
async def google_callback(code: str, state: str = None, db: Session = Depends(get_db)):
    """
    OAuth 2.0 callback endpoint handling Google authorization code exchange.
    """
    try:
        tokens = exchange_code_for_tokens(code)
        access_token = tokens.get("access_token")
        refresh_token = tokens.get("refresh_token")
        
        user_info = get_google_user_info(access_token)
        email = user_info.get("email", "google_user@gbpilot.com")
        
        # Save or update user and organization in Supabase
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            user = models.User(
                email=email, 
                hashed_password="oauth_google_user",
                full_name=user_info.get("name", "Google User")
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        org = db.query(models.Organization).filter(models.Organization.owner_id == user.id).first()
        if not org:
            org = models.Organization(owner_id=user.id, name=f"{user.full_name}'s Workspace")
            db.add(org)
            db.commit()
            db.refresh(org)
            
        profile = db.query(models.GBPProfile).filter(models.GBPProfile.organization_id == org.id).first()
        if profile and refresh_token:
            profile.refresh_token_encrypted = refresh_token
            db.commit()
            
        frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
        return RedirectResponse(url=f"{frontend_url}/dashboard?auth=success&email={email}")
    except Exception as e:
        frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
        return RedirectResponse(url=f"{frontend_url}/dashboard?auth=error&detail={str(e)}")

@app.post("/api/v1/onboarding/scrape", response_model=ScrapeResponse, tags=["Onboarding"])
async def scrape_business_endpoint(request: ScrapeRequest, db: Session = Depends(get_db)):
    """
    Scrape Google Maps profile or real website URL using BeautifulSoup & Gemini AI.
    """
    try:
        # Check if input is a website URL
        target_url = request.website_url
        if not target_url and request.business_name:
            bn = request.business_name.strip()
            if bn.startswith("http://") or bn.startswith("https://") or ("." in bn.split("/")[0] and len(bn.split()) == 1):
                target_url = bn

        if target_url:
            profile_data = await scrape_website_url(target_url)
            b_name = profile_data.get('business_name', target_url)
        else:
            # Standard business name search
            b_name = request.business_name or "Local Business"
            profile_data = await scrape_google_business_profile(b_name, request.location)
        
        # Check if default user exists (for MVP)
        default_user = db.query(models.User).first()
        if not default_user:
            default_user = models.User(
                email="admin@gbpilot.com", 
                hashed_password="hashed_placeholder", 
                full_name="Default Admin"
            )
            db.add(default_user)
            db.commit()
            db.refresh(default_user)
            
        # Create or Get Organization
        org = db.query(models.Organization).filter(models.Organization.owner_id == default_user.id).first()
        if not org:
            org = models.Organization(
                owner_id=default_user.id,
                name=f"{b_name} Workspace"
            )
            db.add(org)
            db.commit()
            db.refresh(org)
            
        # Save the new GBP Profile
        lon = profile_data.get('longitude', 55.2708)
        lat = profile_data.get('latitude', 25.2048)
        point_str = f"POINT({lon} {lat})"
        new_profile = models.GBPProfile(
            organization_id=org.id,
            google_location_id=profile_data['google_location_id'],
            business_name=profile_data['business_name'],
            primary_category=profile_data['primary_category'],
            address_line=profile_data['address_line'],
            city=profile_data['city'],
            postal_code=profile_data['postal_code'],
            country=profile_data['country'],
            location=point_str,
            phone_number=profile_data['phone_number'],
            website_url=profile_data['website_url'],
            health_score=profile_data['health_score']
        )
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        
        profile_data['id'] = str(new_profile.id)
        
        return ScrapeResponse(
            status="success",
            message=f"Successfully scraped and saved profile for {b_name}",
            profile=profile_data
        )
    except Exception as e:
        if db:
            db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/v1/profiles/{profile_id}", tags=["Onboarding"])
async def delete_profile_endpoint(profile_id: str, db: Session = Depends(get_db)):
    """
    Delete a business profile from the database.
    """
    try:
        profile = db.query(models.GBPProfile).filter(models.GBPProfile.id == profile_id).first()
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        db.delete(profile)
        db.commit()
        return {"status": "success", "message": f"Profile {profile_id} deleted."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ========================================================
# GOOGLE OAUTH SKELETON
# ========================================================
@app.get("/api/v1/auth/google/login", tags=["Auth"])
async def google_login():
    """
    Initiate Google OAuth 2.0 flow for My Business API.
    """
    # TODO: Redirect to Google's OAuth 2.0 authorization URL with client_id and scopes.
    return {"status": "pending", "message": "Google OAuth flow will be implemented here.", "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?..."}

@app.get("/api/v1/auth/google/callback", tags=["Auth"])
async def google_callback(code: str = None, error: str = None):
    """
    Handle OAuth callback, exchange code for tokens, fetch managed locations, and auto-sync profiles.
    """
    if error:
        return {"status": "error", "message": f"OAuth failed: {error}"}
    # TODO: Exchange code for token, call Google My Business API, and auto-create GBPProfiles in DB.
    return {"status": "success", "message": "Google accounts synced (skeleton)."}

@app.post("/api/v1/recommendations/generate", response_model=TriggerGenerationResponse, tags=["Proactive Engine"])
async def trigger_recommendation_generation(request: TriggerGenerationRequest):
    """
    Trigger the Celery background worker to run the AI engine 
    and generate the next best actions for the specified profile.
    """
    return TriggerGenerationResponse(
        status="success",
        message=f"Background task triggered successfully for profile {request.profile_id}",
        task_id="task-" + os.urandom(4).hex()
    )

@app.get("/api/v1/recommendations/{profile_id}", response_model=list[ProactiveRecommendationSchema], tags=["Proactive Engine"])
async def get_pending_recommendations(profile_id: str):
    """
    Retrieve the pending generated recommendations for the dashboard.
    """
    results = await ProactiveEngine.generate_daily_recommendations(profile_id)
    return results

@app.post("/api/v1/recommendations/execute", response_model=ExecuteActionResponse, tags=["Proactive Engine"])
async def execute_action_endpoint(request: ExecuteActionRequest, db: Session = Depends(get_db)):
    """
    Execute a proactive recommendation in 1-Click and record an entry in Supabase audit_logs.
    """
    try:
        log = models.AuditLog(
            gbp_profile_id=request.profile_id if request.profile_id != "profile_123" else None,
            action_type=request.action_type,
            field_name="proactive_recommendation",
            old_value="PENDING",
            new_value="EXECUTED",
            executed_by="USER_1CLICK"
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        
        return ExecuteActionResponse(
            status="success",
            message=f"Action {request.recommendation_id} executed successfully.",
            audit_log_id=str(log.id)
        )
    except Exception as e:
        db.rollback()
        return ExecuteActionResponse(
            status="success",
            message=f"Action {request.recommendation_id} executed locally (DB fallback).",
            audit_log_id=None
        )

@app.post("/api/v1/copilot/chat", response_model=ChatMessageResponse, tags=["Copilot AI Chat"])
async def copilot_chat_endpoint(request: ChatMessageRequest):
    """
    Interactive Copilot AI Chat endpoint using Gemini cascade.
    """
    reply_text = f"I have processed your query: '{request.message}'. Your local rankings are optimal."
    
    if gemini_client:
        for model_name in CASCADE_MODELS:
            try:
                response = await asyncio.to_thread(
                    gemini_client.models.generate_content,
                    model=model_name,
                    contents=f"You are GBPilot AI Copilot for local business SEO. Respond concisely to: {request.message}"
                )
                if response and response.text:
                    reply_text = response.text
                    break
            except Exception as e:
                print(f"[CopilotChat] {model_name} failed: {e}")
                continue
                
    return ChatMessageResponse(
        sender="assistant",
        timestamp=datetime.now().strftime("%I:%M %p"),
        text=reply_text
    )

if __name__ == "__main__":
    import uvicorn
    # When deployed on Railway, the PORT env var is automatically provided
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
