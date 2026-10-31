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
    business_name: Optional[str] = None
    location: Optional[str] = None
    website_url: Optional[str] = None

class ScrapeResponse(BaseModel):
    status: str
    message: str
    profile: Optional[Dict[str, Any]] = None

class GeoGridScanRequest(BaseModel):
    profile_id: Optional[str] = "default"
    keyword: str
    grid_size: int = 3
    distance_meters: float = 500.0          # grid step in meters (250 / 500 / 1000)
    mode: str = "bias"                      # "bias" (soft, like a real search) | "strict" (only inside the cell box)
    business_name: Optional[str] = None
    address: Optional[str] = None
    place_id: Optional[str] = None          # Google place_id of the user's own business (preferred over name matching)
    lat: Optional[float] = None
    lng: Optional[float] = None
    plan_id: Optional[str] = None           # subscription plan asserted by the client (soft limit, no server-side billing yet)
    user_email: Optional[str] = None
    cache_only: bool = False                # return the last stored scan without calling Google / spending quota
    force_refresh: bool = False             # bypass the 24h cache (spends quota; superadmin only)

class GeoGridTop3Item(BaseModel):
    rank: int
    place_id: str = ""
    name: str
    address: str = ""
    rating: float = 0.0
    reviews_count: int = 0
    primary_category: str = ""
    secondary_categories: List[str] = []
    google_maps_url: str = ""
    website_url: str = ""
    phone: str = ""
    photos_count: int = 0                   # Places API returns at most 10 photo references
    open_now: Optional[bool] = None
    has_hours: bool = False
    price_level: str = ""
    is_you: bool = False

class GeoGridGap(BaseModel):
    id: str
    kind: str                               # category | website | phone | hours | rating | reviews | photos
    title: str
    detail: str                             # built from real numbers, e.g. "У 2 из 3 лидеров есть категория X"
    leaders_with: int = 0
    leaders_total: int = 0

class GeoGridOwnProfile(BaseModel):
    place_id: str = ""
    name: str = ""
    address: str = ""
    rating: float = 0.0
    reviews_count: int = 0
    primary_category: str = ""
    secondary_categories: List[str] = []
    website_url: str = ""
    phone: str = ""
    photos_count: int = 0
    open_now: Optional[bool] = None
    has_hours: bool = False
    price_level: str = ""
    google_maps_url: str = ""

class GeoGridVelocity(BaseModel):
    per_week: Optional[float] = None        # None until >= 2 snapshots at least a day apart
    days: float = 0.0
    snapshots: int = 0
    from_reviews: int = 0
    to_reviews: int = 0

class GeoGridNode(BaseModel):
    pos: int
    rank: Optional[int] = None              # 1..20 when found; None when not found / no data
    state: str = "NO_DATA"                  # FOUND | NOT_IN_TOP20 | NO_DATA
    lat: float
    lng: float
    competitor: Optional[str] = None        # leader at this point ("You" if the user is #1)
    competitor_url: Optional[str] = None
    competitor_rating: Optional[float] = None
    competitor_reviews: Optional[int] = None
    top3: List[GeoGridTop3Item] = []
    gaps: List[GeoGridGap] = []             # you vs. the leaders at THIS point

class GeoGridCompetitor(BaseModel):
    place_id: str = ""
    name: str
    address: str = ""
    google_maps_url: str = ""
    website_url: str = ""
    phone: str = ""
    rating: float = 0.0
    reviews_count: int = 0
    primary_category: str = ""
    secondary_categories: List[str] = []
    open_now: Optional[bool] = None
    photos_count: int = 0
    price_level: str = ""
    grid_wins: int = 0
    avg_rank: float = 0.0
    appearances: int = 0

class GeoGridMetrics(BaseModel):
    arp: Optional[float] = None             # average rank, "not in top 20" counted as 21
    atrp: Optional[float] = None            # average rank over points where the business was found
    solv: Optional[float] = None            # share of local voice: % of points in Top-3
    nodes_total: int = 0
    nodes_with_data: int = 0
    nodes_found: int = 0
    nodes_top3: int = 0

class GeoGridMeta(BaseModel):
    keyword: str = ""
    grid_size: int = 3
    step_m: int = 500
    mode: str = "bias"
    cached: bool = False
    stale: bool = False
    cached_at: Optional[str] = None
    plan_id: str = "FREE_SCOUT"
    scans_used: int = 0
    scans_limit: Optional[int] = None       # None = unlimited
    scans_remaining: Optional[int] = None
    own_place_id: Optional[str] = None
    own_name: Optional[str] = None
    own_resolved_by: str = "none"           # request | search | none
    center_lat: Optional[float] = None
    center_lng: Optional[float] = None
    accuracy_note: str = ""

class GeoGridScanResponse(BaseModel):
    status: str                             # success | error | limit_reached | no_cache
    grid: List[GeoGridNode] = []
    competitors: List[GeoGridCompetitor] = []
    metrics: GeoGridMetrics = GeoGridMetrics()
    meta: GeoGridMeta = GeoGridMeta()
    message: str = ""
    own_profile: Optional[GeoGridOwnProfile] = None    # your card as Google returns it (same fields as leaders)
    overall_gaps: List[GeoGridGap] = []                # you vs. the top competitors across the whole grid
    velocity: Dict[str, GeoGridVelocity] = {}          # reviews/week by place_id, from stored scan snapshots

class B2BLead(BaseModel):
    name: str
    address: str
    rating: float
    website: str = ""
    email: str = ""

class B2BOutreachResponse(BaseModel):
    status: str
    leads: List[B2BLead]

# --------------------------
# Webhook Schemas (REVO Master Data Integration)
# --------------------------
class WebhookContact(BaseModel):
    type: str
    value: str
    is_verified: Optional[bool] = False

class WebhookLead(BaseModel):
    lead_id: str
    company_name: str
    business_type: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    revo_score: Optional[int] = None
    audit_notes: Optional[str] = None
    contacts: List[WebhookContact] = []

class RevoWebhookPayload(BaseModel):
    event: str
    timestamp: str
    leads: List[WebhookLead]

# --------------------------
# Audit Report Schemas (For Frontend)
# --------------------------
class AuditRedBlock(BaseModel):
    title: str
    description: str

class AuditGreenBlock(BaseModel):
    title: str
    description: str

class AuditReportSchema(BaseModel):
    audit_id: str
    company_name: str
    address: str
    health_score: int
    estimated_revenue_gain: str
    estimated_client_gain: str
    red_blocks: List[AuditRedBlock]
    green_blocks: List[AuditGreenBlock]
    created_at: str

# --------------------------
# Review Takedown Schemas (Guard Module)
# --------------------------
class ReviewTakedownRequest(BaseModel):
    business_name: str
    review_text: str
    author_name: Optional[str] = "Anonymous"
    rating: int = 1
    business_context: Optional[str] = "Dubai, UAE"
    location_details: Optional[str] = None
    jurisdiction: Optional[str] = "UAE"  # 'UAE' | 'USA' | 'EU' | 'GLOBAL'

class ReviewTakedownViolation(BaseModel):
    clause: str
    policy_name: str
    explanation: str

class ReviewTakedownResponse(BaseModel):
    status: str
    business_name: str
    confidence_score: int
    estimated_removal_time: str
    violations: List[ReviewTakedownViolation]
    dossier_text: str
    google_escalation_url: str
    message: str
    jurisdiction: Optional[str] = "UAE"
