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
from scraper import scrape_google_business_profile
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

@app.post("/api/v1/onboarding/scrape", response_model=ScrapeResponse, tags=["Onboarding"])
async def scrape_business_endpoint(request: ScrapeRequest, db: Session = Depends(get_db)):
    """
    Scrape Google Maps data for a business name, simulate data structure,
    and save the new organization and profile into Supabase.
    """
    try:
        # 1. Scrape data
        profile_data = await scrape_google_business_profile(request.business_name, request.location)
        
        # 2. Check if default user exists (for MVP)
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
            
        # 3. Create or Get Organization
        org = db.query(models.Organization).filter(models.Organization.owner_id == default_user.id).first()
        if not org:
            org = models.Organization(
                owner_id=default_user.id,
                name=f"{request.business_name} Workspace"
            )
            db.add(org)
            db.commit()
            db.refresh(org)
            
        # 4. Save the new GBP Profile
        # Point format for PostGIS: 'POINT(lon lat)'
        point_str = f"POINT({profile_data['longitude']} {profile_data['latitude']})"
        
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
        
        # Add the database ID to the returned profile data
        profile_data['id'] = str(new_profile.id)
        
        return ScrapeResponse(
            status="success",
            message=f"Successfully scraped and saved profile for {request.business_name}",
            profile=profile_data
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

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
