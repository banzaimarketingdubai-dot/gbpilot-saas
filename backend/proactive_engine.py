import asyncio
import os
import json
import typing
from typing import List
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

from schemas import ProactiveRecommendationSchema, PreviewContent
from pydantic import TypeAdapter

# Initialize Gemini Client (Requires GEMINI_API_KEY env var)
# Get your free key at: aistudio.google.com
gemini_client = None
if GENAI_AVAILABLE and os.environ.get("GEMINI_API_KEY"):
    try:
        gemini_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    except Exception as e:
        print(f"[ProactiveEngine] Failed to initialize GenAI client: {e}")

# Define the cascade models to use
CASCADE_MODELS = [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash'
]

class ProactiveEngine:
    """
    Core AI Engine for generating proactive next-best actions.
    Connects to Google Gemini API using Structured Outputs (JSON Mode).
    Implements a fallback cascade across model versions.
    """
    
    @staticmethod
    async def generate_daily_recommendations(profile_id: str) -> List[ProactiveRecommendationSchema]:
        """
        Executes the AI processing pipeline for the GBPilot Copilot using Gemini cascade.
        """
        print(f"[ProactiveEngine] Analyzing SERP data and Geo-Grid drops for profile {profile_id}...")
        
        if gemini_client:
            # ---------------------------------------------------------
            # REAL IMPLEMENTATION LOGIC (USING GEMINI CASCADE)
            # ---------------------------------------------------------
            print("[ProactiveEngine] Calling Gemini API...")
            
            profile_data = {"business_name": "Sample Cafe", "city": "Dubai", "rating": 4.2}
            grid_data = {"dropped_keywords": ["best cafe near me", "espresso bar"], "current_rank": 7}
            competitors = {"top_competitor": "Starbucks", "competitor_actions": ["Added 'Artisan Coffee' category"]}
            
            prompt = f"""
            You are a Senior Local SEO Expert & Autonomous Google Maps Manager.
            Analyze the following business profile context, recent Geo-Grid rank drops, and competitor movements.
            Generate exactly 2 high-impact "Next Best Actions" (Recommendations) that the user can execute in 1-Click.
            
            Business Context: {json.dumps(profile_data)}
            Geo-Grid Status: {json.dumps(grid_data)}
            Competitor Actions: {json.dumps(competitors)}
            
            Rules:
            - Categories must be one of: CATEGORY_OPTIMIZATION, BUSINESS_HOURS, COMPETITOR_DEFENSE, REVIEW_VELOCITY, PROFILE_FIX.
            - Include GEO LSI keywords in the preview content.
            """
            
            # Cascade logic
            for model_name in CASCADE_MODELS:
                try:
                    print(f"[ProactiveEngine] Attempting generation with {model_name}...")
                    
                    response = await asyncio.to_thread(
                        gemini_client.models.generate_content,
                        model=model_name,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=list[ProactiveRecommendationSchema]
                        )
                    )
                    
                    raw_json = response.text
                    recommendations = TypeAdapter(List[ProactiveRecommendationSchema]).validate_json(raw_json)
                    
                    for rec in recommendations:
                        rec.profile_id = profile_id
                        
                    print(f"[ProactiveEngine] {model_name} successfully generated {len(recommendations)} actions.")
                    return recommendations
                    
                except Exception as e:
                    print(f"[ProactiveEngine] {model_name} failed: {e}. Falling back to next model...")
                    continue
            
            print("[ProactiveEngine] All Gemini cascade models failed. Falling back to MOCK data.")
        
        # ---------------------------------------------------------
        # MOCK IMPLEMENTATION (Fallback if no API key or Error)
        # ---------------------------------------------------------
        await asyncio.sleep(1) # Simulate LLM latency
        
        mock_results = [
            ProactiveRecommendationSchema(
                profile_id=profile_id,
                impactBadge="⚡ High Impact",
                category="CATEGORY_OPTIMIZATION",
                targetProjection="+14% Maps Views",
                title='Inject High-Volume Secondary Category: "Artisan Espresso Bar"',
                description='Local search volume for "espresso bar near me" spiked 34% this week in Sector 4. Your top competitor added this category 3 days ago.',
                actionButtonText="Add Category in 1-Click",
                previewContent=PreviewContent(
                    text='Add secondary category: "Espresso Bar & Breakfast Restaurant" to Google Business Profile.',
                    keywords=['espresso bar', 'artisanal coffee', 'specialty cappuccino'],
                    details=['Boosts search visibility for morning traffic', 'Matches competitor category coverage']
                )
            ),
            ProactiveRecommendationSchema(
                profile_id=profile_id,
                impactBadge="🌙 Dynamic Hours",
                category="BUSINESS_HOURS",
                targetProjection="+22% Weekend Calls",
                title="Enable Dynamic Hours Extension for Upcoming Holiday Weekend",
                description="Local foot traffic searches peak by 40% after 8:00 PM on Friday and Saturday. Extend listed hours by 1.5 hrs.",
                actionButtonText="Update Hours in 1-Click",
                previewContent=PreviewContent(
                    text="Update Friday & Saturday closing hours from 8:00 PM to 9:30 PM for peak holiday demand.",
                    keywords=['open late cafe', 'late night bakery', 'weekend breakfast'],
                    details=['Prevents profile from showing "Closed" during high-intent search windows']
                )
            )
        ]
        
        print(f"[ProactiveEngine] Returned {len(mock_results)} mock actions (Gemini inactive).")
        return mock_results

    @staticmethod
    async def generate_audit_report(lead_data: dict) -> dict:
        """
        Takes raw lead data from REVO Master Data webhook and generates a personalized,
        highly persuasive B2B Audit Report JSON using Gemini Structured Outputs.
        """
        print(f"[ProactiveEngine] Generating Audit Report for lead: {lead_data.get('company_name')}")
        from schemas import AuditReportSchema
        import uuid
        from datetime import datetime
        
        audit_id = f"audit-{str(uuid.uuid4())[:8]}"
        
        if gemini_client:
            prompt = f"""
            You are a ruthless but professional Local SEO Expert analyzing a B2B Lead.
            Based on the following data scraped from Google Maps, generate a personalized audit report.
            
            LEAD DATA:
            {json.dumps(lead_data, indent=2)}
            
            RULES:
            1. 'health_score': Calculate realistically based on rating, reviews_count, and website presence (0-100).
            2. 'estimated_revenue_gain' and 'estimated_client_gain': Estimate growth if they fix their profile. Use realistic numbers.
            3. 'red_blocks': Generate exactly 3 highly specific critical leaks (Disasters) based on their data.
            4. 'green_blocks': Generate exactly 3 specific action steps (Quick Wins) to fix the red blocks.
            """
            
            for model_name in CASCADE_MODELS:
                try:
                    response = await asyncio.to_thread(
                        gemini_client.models.generate_content,
                        model=model_name,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=AuditReportSchema
                        )
                    )
                    # We parse and inject the ID and metadata
                    report = TypeAdapter(AuditReportSchema).validate_json(response.text)
                    report.audit_id = audit_id
                    report.company_name = lead_data.get("company_name", "Unknown Business")
                    report.address = lead_data.get("address", "Unknown Address")
                    report.created_at = datetime.now().isoformat()
                    return report.model_dump()
                except Exception as e:
                    print(f"[ProactiveEngine] Audit generation failed on {model_name}: {e}")
                    continue
                    
        # MOCK FALLBACK
        return {
            "audit_id": audit_id,
            "company_name": lead_data.get("company_name", "Sample Business"),
            "address": lead_data.get("address", "123 Main St"),
            "health_score": 42,
            "estimated_revenue_gain": "$1,450",
            "estimated_client_gain": "+38",
            "red_blocks": [
                {"title": "Weak Rating Vulnerability", "description": f"Your current rating of {lead_data.get('rating', '3.5')} is losing traffic to competitors with 4.5+ ratings."},
                {"title": "Missing Website", "description": "High-intent users cannot view your menu or book appointments."},
                {"title": "Profile Guard Disabled", "description": "Competitors can suggest changes to your business hours at any time."}
            ],
            "green_blocks": [
                {"title": "Launch AI Auto-Responder", "description": "Instantly reply to backlogged reviews to boost engagement signals."},
                {"title": "Inject LSI Categories", "description": "Add secondary categories to capture missing search impressions."},
                {"title": "Activate Sentinel Guard", "description": "Lock your core profile data from unauthorized edits."}
            ],
            "created_at": datetime.now().isoformat()
        }
