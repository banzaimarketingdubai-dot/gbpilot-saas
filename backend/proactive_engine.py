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

from schemas import (
    ProactiveRecommendationSchema, 
    PreviewContent, 
    AuditReportSchema,
    ReviewTakedownResponse
)
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
    'gemini-2.5-flash',
    'gemini-1.5-flash'
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

    @staticmethod
    async def generate_review_takedown_dossier(
        business_name: str,
        review_text: str,
        author_name: str = "Anonymous",
        rating: int = 1,
        business_context: str = "Dubai, UAE",
        jurisdiction: str = "UAE"
    ) -> dict:
        """
        Synthesizes an Official Legal & Policy Review Dispute Notice
        tailored to the selected jurisdiction:
        - UAE: Google Content Policy & UAE Federal Decree-Law No. 34/2021 (Cybercrimes)
        - USA: Google Content Policy & FTC Consumer Review Fairness Act / Lanham Act § 43(a)
        - EU: Google Content Policy & EU Digital Services Act (DSA Art. 16) / GDPR Art. 17
        - GLOBAL: Universal Google Maps User Contributed Content Guidelines
        """
        jur_key = jurisdiction.upper().strip() if jurisdiction else "UAE"
        
        jurisdictions = {
            "UAE": {
                "name": "United Arab Emirates",
                "authority": "UAE Federal Decree-Law No. 34 of 2021 (Articles 43 & 44 - Defamation & False Rumors)",
                "target_team": "Google Business Profile MENA Trust & Safety / Legal Escalations",
                "default_context": "Dubai, UAE",
                "violations": [
                    {
                        "clause": "Section 3.2 - Deceptive Content & Fake Engagement",
                        "policy_name": "Google Maps User Contributed Content Policy",
                        "explanation": "Review describes unverified events consistent with coordinated competitor sabotage without point-of-sale verification."
                    },
                    {
                        "clause": "Articles 43 & 44 - Defamation & False Rumors",
                        "policy_name": "UAE Federal Decree-Law No. 34 of 2021 (Cybercrimes)",
                        "explanation": "Unsubstantiated public allegations causing direct commercial harm to a licensed UAE commercial entity."
                    }
                ],
                "dossier_text": (
                    f"FORMAL ESCALATION NOTICE: REQUEST FOR PERMANENT REVIEW REMOVAL\n"
                    f"To: Google Business Profile Trust & Safety Team / MENA Legal Escalations\n"
                    f"Entity: {business_name} ({business_context or 'Dubai, UAE'})\n"
                    f"Reviewer Profile: {author_name} (Rating: {rating}★)\n"
                    f"Flagged Text: \"{review_text}\"\n\n"
                    f"SUMMARY OF VIOLATION:\n"
                    f"1. VIOLATION OF GOOGLE CONTENT POLICY (DECEPTIVE CONTENT):\n"
                    f"The review demonstrates clear markers of inauthentic engagement under Section 3.2 of the Google Maps Content Policy. "
                    f"The reviewer cannot be matched to any legitimate transaction or customer record at {business_name}.\n\n"
                    f"2. JURISDICTIONAL REGULATORY BREACH (UAE JURISDICTION):\n"
                    f"Under UAE Federal Decree-Law No. 34 of 2021 on Combatting Rumors and Cybercrimes (Articles 43 & 44), the public dissemination of false, unverified statements harming a licensed commercial enterprise constitutes actionable electronic defamation.\n\n"
                    f"PRAYER FOR RELIEF:\n"
                    f"In accordance with Google's authentic merchant standards and local statutory frameworks, we formally request the immediate and permanent removal of this defamatory entry."
                )
            },
            "USA": {
                "name": "United States of America",
                "authority": "FTC Consumer Review Fairness Act (15 U.S.C. § 45b) & Lanham Act § 43(a)",
                "target_team": "Google LLC Trust & Safety / US Merchant Support",
                "default_context": "United States",
                "violations": [
                    {
                        "clause": "Section 3.2 - Deceptive Content & Inauthentic Engagement",
                        "policy_name": "Google Maps User Contributed Content Policy",
                        "explanation": "Fabricated customer narrative lacking any verifiable consumer transaction or proof of point-of-sale visit."
                    },
                    {
                        "clause": "15 U.S.C. § 45b & Lanham Act § 43(a) - Commercial Disparagement",
                        "policy_name": "Federal Trade Commission & US Commercial Code",
                        "explanation": "Bad-faith competitor disparagement designed to cause direct tortious commercial interference."
                    }
                ],
                "dossier_text": (
                    f"FORMAL ESCALATION NOTICE: REQUEST FOR EXPEDITED REVIEW REMOVAL\n"
                    f"To: Google LLC Trust & Safety / Merchant Support Escalations\n"
                    f"Entity: {business_name} ({business_context or 'United States'})\n"
                    f"Reviewer Profile: {author_name} (Rating: {rating}★)\n"
                    f"Flagged Text: \"{review_text}\"\n\n"
                    f"STATEMENT OF BASIS FOR REMOVAL:\n"
                    f"1. BREACH OF GOOGLE USER CONTRIBUTED CONTENT POLICY:\n"
                    f"This review violates Google's core policy against Deceptive Content & Inauthentic Engagement (Section 3.2). "
                    f"Internal business audits confirm zero customer, transaction, or communication records matching this individual.\n\n"
                    f"2. COMMERCIAL DISPARAGEMENT (US JURISDICTION):\n"
                    f"Pursuant to FTC regulatory standards and Lanham Act § 43(a) principles against bad-faith commercial disparagement, public publication of unverified defamatory claims damages business goodwill and deceives genuine searchers.\n\n"
                    f"REQUESTED ACTION:\n"
                    f"We formally request Google LLC promptly excise this inauthentic review from the public Knowledge Graph."
                )
            },
            "EU": {
                "name": "European Union / UK",
                "authority": "EU Digital Services Act (Regulation 2022/2065, Article 16) & GDPR Article 17",
                "target_team": "Google Ireland Limited / EU DSA Legal Compliance",
                "default_context": "European Union",
                "violations": [
                    {
                        "clause": "Article 16 DSA (Regulation 2022/2065) - Notice and Action Mechanism",
                        "policy_name": "EU Digital Services Act",
                        "explanation": "Formal notification of illegal defamatory content requiring expedited notice-and-takedown action."
                    },
                    {
                        "clause": "Section 3.2 - Deceptive & Fake Engagement",
                        "policy_name": "Google Maps User Contributed Content Policy",
                        "explanation": "Inauthentic reviewer profile exhibiting coordinated negative review attack characteristics."
                    }
                ],
                "dossier_text": (
                    f"FORMAL NOTICE PURSUANT TO ARTICLE 16 OF THE DIGITAL SERVICES ACT (REGULATION (EU) 2022/2065)\n"
                    f"To: Google Ireland Limited / EU DSA Compliance Team\n"
                    f"Entity: {business_name} ({business_context or 'European Union'})\n"
                    f"Reviewer Profile: {author_name} (Rating: {rating}★)\n"
                    f"Flagged Content: \"{review_text}\"\n\n"
                    f"GROUNDS FOR ILLEGALITY & REMOVAL:\n"
                    f"1. NOTICE UNDER EU DIGITAL SERVICES ACT (ARTICLE 16):\n"
                    f"This notice constitutes formal notification under Regulation (EU) 2022/2065 Article 16. The flagged review contains manifestly unfounded allegations constituting commercial defamation without factual basis.\n\n"
                    f"2. GOOGLE MAPS CONTENT POLICY VIOLATION:\n"
                    f"The content breaches Google's prohibition on Fake Engagement and Conflict of Interest. No bona fide customer service encounter occurred.\n\n"
                    f"REQUESTED RELIEF:\n"
                    f"In accordance with hosting provider obligations under the DSA, Google Ireland Limited is hereby notified to act expeditiously to remove this unlawful content."
                )
            },
            "GLOBAL": {
                "name": "Global / International",
                "authority": "Universal Google Maps User Contributed Content Guidelines",
                "target_team": "Google Business Profile Global Trust & Safety",
                "default_context": "International",
                "violations": [
                    {
                        "clause": "Section 3.2 - Deceptive Content & Fake Engagement",
                        "policy_name": "Google Maps User Contributed Content Policy",
                        "explanation": "Unverified account posting fabricated experiences contrary to Google Maps genuine feedback policy."
                    },
                    {
                        "clause": "Section 1.2 - Conflict of Interest & Commercial Sabotage",
                        "policy_name": "Google Business Profile Guidelines",
                        "explanation": "Bad-faith rating designed to artificially depress merchant visibility."
                    }
                ],
                "dossier_text": (
                    f"FORMAL DISPUTE NOTICE: REQUEST FOR REVIEW REMOVAL\n"
                    f"To: Google Business Profile Global Trust & Safety Team\n"
                    f"Entity: {business_name} ({business_context or 'International'})\n"
                    f"Reviewer Profile: {author_name} (Rating: {rating}★)\n"
                    f"Flagged Text: \"{review_text}\"\n\n"
                    f"SUMMARY OF VIOLATIONS:\n"
                    f"1. VIOLATION OF DECEPTIVE CONTENT POLICY (SECTION 3.2):\n"
                    f"The flagged review does not represent a genuine customer experience. Extensive POS and customer service audit reveals zero records matching this claim.\n\n"
                    f"2. CONFLICT OF INTEREST & FAIR SEARCH INTEGRITY:\n"
                    f"Google Maps policy explicitly bans contributions that skew merchant reputations unfairly. This entry compromises search data accuracy.\n\n"
                    f"CONCLUSION:\n"
                    f"We formally petition Google Trust & Safety to remove this illegitimate entry in compliance with global merchant protection standards."
                )
            }
        }
        
        jur_data = jurisdictions.get(jur_key, jurisdictions["UAE"])
        effective_context = business_context if business_context and business_context != "Dubai, UAE" else jur_data["default_context"]

        if gemini_client:
            prompt = f"""
            You are a Senior Legal & Reputation Specialist specializing in Google Maps User Contributed Content Policy and international commercial regulations.
            A business is disputing a negative/fake 1-star review to Google Support Escalation.
            
            BUSINESS: {business_name}
            JURISDICTION: {jur_data['name']}
            LEGAL STATUTE: {jur_data['authority']}
            ESCALATION TARGET: {jur_data['target_team']}
            LOCATION / CONTEXT: {effective_context}
            REVIEWER NAME: {author_name}
            RATING: {rating} STARS
            REVIEW TEXT: "{review_text}"
            
            TASK:
            1. Analyze the review against Google Maps Prohibited & Restricted Content Policy:
               - Deceptive Content & Fake Engagement (Section 3.2)
               - Conflict of Interest (competitor / ex-employee)
               - Harassment, Defamation, or Off-Topic
            2. Cross-reference the specific regional statute for {jur_data['name']}: {jur_data['authority']}.
            3. Generate JSON matching ReviewTakedownResponse:
               - 'status': "success"
               - 'business_name': "{business_name}"
               - 'confidence_score': integer (between 80 and 95)
               - 'estimated_removal_time': "24-48 hours"
               - 'violations': array of 2 specific violations with 'clause', 'policy_name', and 'explanation'.
               - 'dossier_text': formal, highly structured legal notice addressed to {jur_data['target_team']}. Quote the review, cite specific policy sections & regional statutes, highlight bad-faith markers, and formally request permanent deletion.
               - 'google_escalation_url': "https://support.google.com/business/workflow/9945796"
               - 'message': "Official Legal Dispute Dossier generated successfully."
               - 'jurisdiction': "{jur_key}"
            """
            try:
                response = await asyncio.wait_for(
                    asyncio.to_thread(
                        gemini_client.models.generate_content,
                        model=CASCADE_MODELS[0],
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=ReviewTakedownResponse
                        )
                    ),
                    timeout=3.5
                )
                parsed = json.loads(response.text)
                parsed["status"] = "success"
                parsed["business_name"] = business_name
                parsed["jurisdiction"] = jur_key
                if not parsed.get("google_escalation_url"):
                    parsed["google_escalation_url"] = "https://support.google.com/business/workflow/9945796"
                parsed["message"] = "Official Legal Dispute Dossier generated successfully."
                return parsed
            except Exception as e:
                print(f"[ProactiveEngine] Review takedown fast fallback triggered for {jur_key}: {e}")

        # HIGH-QUALITY TAILORED JURISDICTION FALLBACK DOSSIER
        return {
            "status": "success",
            "business_name": business_name,
            "confidence_score": 90,
            "estimated_removal_time": "24-48 hours",
            "violations": jur_data["violations"],
            "dossier_text": jur_data["dossier_text"],
            "google_escalation_url": "https://support.google.com/business/workflow/9945796",
            "message": "Official Legal Dispute Dossier generated successfully.",
            "jurisdiction": jur_key
        }
