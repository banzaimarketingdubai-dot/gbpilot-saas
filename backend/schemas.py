import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# --------------------------
# Proactive Recommendation Schemas
# --------------------------
class PreviewContent(BaseModel):
    text: Optional[str] = None
    keywords: Optional[List[str]] = None
    details: Optional[List[str]] = None

class ProactiveRecommendationSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    profile_id: str
    impactBadge: str
    category: str
    targetProjection: str
    title: str
    description: str
    actionButtonText: str
    status: str = "PENDING"
    previewContent: PreviewContent
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TriggerGenerationRequest(BaseModel):
    profile_id: str
    trigger_source: str = "MANUAL_DASHBOARD"

class TriggerGenerationResponse(BaseModel):
    status: str
    message: str
    task_id: Optional[str] = None

class ExecuteActionRequest(BaseModel):
    recommendation_id: str
    action_type: str
    profile_id: str

class ExecuteActionResponse(BaseModel):
    status: str
    message: str
    audit_log_id: Optional[str] = None

# --------------------------
# Copilot AI Schemas
# --------------------------
class ChatMessageRequest(BaseModel):
    profile_id: str
    message: str
    history: Optional[List[Dict[str, str]]] = []

class ChatMessageResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender: str = "assistant"
    timestamp: str
    text: str
    widget: Optional[str] = None
    widgetData: Optional[Dict[str, Any]] = None

# --------------------------
# Onboarding Schemas
# --------------------------
class ScrapeRequest(BaseModel):
    business_name: str
    location: Optional[str] = None

class ScrapeResponse(BaseModel):
    status: str
    message: str
    profile: Optional[Dict[str, Any]] = None
