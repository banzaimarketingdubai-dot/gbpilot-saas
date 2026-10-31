import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import declarative_base, relationship
from geoalchemy2 import Geography

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    role = Column(String(50), default='USER')
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    organizations = relationship("Organization", back_populates="owner")


class Organization(Base):
    __tablename__ = 'organizations'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(255), nullable=False)
    tier = Column(String(50), default='STARTER')
    white_label_logo_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    owner = relationship("User", back_populates="organizations")
    profiles = relationship("GBPProfile", back_populates="organization")


class GBPProfile(Base):
    __tablename__ = 'gbp_profiles'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey('organizations.id', ondelete='CASCADE'), nullable=False)
    google_location_id = Column(String(255), unique=True, nullable=False)
    business_name = Column(String(255), nullable=False)
    primary_category = Column(String(100))
    address_line = Column(String(255))
    city = Column(String(100))
    postal_code = Column(String(50))
    country = Column(String(50))
    location = Column(Geography(geometry_type='POINT', srid=4326))
    phone_number = Column(String(50))
    website_url = Column(String(500))
    booking_url = Column(String(500))
    health_score = Column(Integer, default=75)
    autopilot_mode = Column(String(50), default='MANUAL_APPROVAL')
    refresh_token_encrypted = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    organization = relationship("Organization", back_populates="profiles")
    recommendations = relationship("ProactiveRecommendation", back_populates="profile")
    scans = relationship("GeoGridScan", back_populates="profile")
    reviews = relationship("Review", back_populates="profile")


class ProactiveRecommendation(Base):
    __tablename__ = 'proactive_recommendations'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey('gbp_profiles.id', ondelete='CASCADE'), nullable=False)
    impact_badge = Column(String(50), nullable=False)
    category = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    target_projection = Column(String(100))
    status = Column(String(50), default='PENDING')
    action_payload = Column(JSONB, nullable=False)
    executed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    profile = relationship("GBPProfile", back_populates="recommendations")


class GeoGridScan(Base):
    __tablename__ = 'geo_grid_scans'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey('gbp_profiles.id', ondelete='CASCADE'), nullable=False)
    keyword = Column(String(100), nullable=False)
    grid_size = Column(String(20), default='5x5')
    radius_km = Column(Numeric(4,2), default=1.0)
    average_rank = Column(Numeric(4,2))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    profile = relationship("GBPProfile", back_populates="scans")
    snapshots = relationship("RankSnapshot", back_populates="scan")


class GeoScanHistory(Base):
    """
    Persistent Geo-Grid scan history (cache + monthly quota accounting + trend base).
    Keyed by a plain string profile key (Google location id) so it does not depend on gbp_profiles rows.
    """
    __tablename__ = 'geo_scan_history'

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_key = Column(String(255), nullable=False, index=True)
    cache_key = Column(String(300), nullable=False, index=True)
    keyword = Column(String(200), nullable=False)
    grid_size = Column(Integer, nullable=False)
    step_m = Column(Integer, nullable=False)
    mode = Column(String(20), nullable=False, default='bias')
    billed = Column(Boolean, nullable=False, default=True)
    arp = Column(Float)
    atrp = Column(Float)
    solv = Column(Float)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)


class GeoActionLog(Base):
    """
    Action plan journal for Geo-Grid gaps: one row per (profile, query, gap).
    Status is PENDING / APPLIED / DISMISSED. Baseline ARP/SoLV is stored at creation so a later re-scan
    can show before/after. Nothing here is written to Google: applying is confirmed by the owner.
    """
    __tablename__ = 'geo_action_log'

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_key = Column(String(255), nullable=False, index=True)
    keyword = Column(String(200), nullable=False)
    gap_id = Column(String(200), nullable=False)
    kind = Column(String(40), nullable=False)
    title = Column(String(300), nullable=False)
    detail = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default='PENDING')
    baseline_arp = Column(Float)
    baseline_solv = Column(Float)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    applied_at = Column(DateTime(timezone=True))


class RankSnapshot(Base):
    __tablename__ = 'rank_snapshots'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), ForeignKey('geo_grid_scans.id', ondelete='CASCADE'), nullable=False)
    node_location = Column(Geography(geometry_type='POINT', srid=4326), nullable=False)
    rank_position = Column(Integer, nullable=False)
    top_competitor_name = Column(String(255))

    scan = relationship("GeoGridScan", back_populates="snapshots")


class Review(Base):
    __tablename__ = 'reviews'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey('gbp_profiles.id', ondelete='CASCADE'), nullable=False)
    google_review_id = Column(String(255), unique=True, nullable=False)
    reviewer_name = Column(String(255))
    reviewer_photo_url = Column(String(500))
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    review_date = Column(DateTime(timezone=True))
    reply_text = Column(Text)
    replied_at = Column(DateTime(timezone=True))
    status = Column(String(50), default='UNREPLIED')

    profile = relationship("GBPProfile", back_populates="reviews")
