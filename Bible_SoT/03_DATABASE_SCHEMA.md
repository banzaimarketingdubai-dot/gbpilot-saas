# Database Schema Specification (`DATABASE_SCHEMA.md`)

## 1. Relational Entity Relationship Diagram (ERD)

```
┌───────────────┐        ┌───────────────────┐        ┌─────────────────────────┐
│     users     │───────<│   organizations   │───────<│      gbp_profiles       │
└───────────────┘        └───────────────────┘        └────────────┬────────────┘
                                                                   │
                                  ┌────────────────────────────────┼────────────────────────────────┐
                                  │                                │                                │
                                  ▼                                ▼                                ▼
                   ┌────────────────────────────┐    ┌───────────────────────────┐    ┌───────────────────────────┐
                   │ proactive_recommendations  │    ┌    geo_grid_scans         │    │          reviews          │
                   └────────────────────────────┘    └─────────────┬─────────────┘    └───────────────────────────┘
                                                                   │
                                                                   ▼
                                                     ┌───────────────────────────┐
                                                     │      rank_snapshots       │
                                                     └───────────────────────────┘
```

---

## 2. PostgreSQL + PostGIS Schema Definition

```sql
-- Enable PostGIS extension for geospatial coordinate calculations
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'USER', -- 'USER', 'AGENCY_ADMIN', 'SUPER_ADMIN'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Organizations Table (For Agency & Multi-Location Support)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(50) DEFAULT 'STARTER', -- 'FREE_TEASER', 'STARTER', 'PRO_AUTOPILOT', 'AGENCY'
    white_label_logo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. GBP Profiles Table
CREATE TABLE gbp_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    google_location_id VARCHAR(255) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    primary_category VARCHAR(100),
    address_line VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(50),
    country VARCHAR(50),
    location GEOGRAPHY(Point, 4326), -- PostGIS Point geometry (Longitude, Latitude)
    phone_number VARCHAR(50),
    website_url VARCHAR(500),
    booking_url VARCHAR(500),
    health_score INT DEFAULT 75, -- Calculated GBP Health Score (0-100)
    autopilot_mode VARCHAR(50) DEFAULT 'MANUAL_APPROVAL', -- 'OFF', 'MANUAL_APPROVAL', 'FULL_AUTOPILOT'
    refresh_token_encrypted TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for location spatial queries
CREATE INDEX idx_gbp_profiles_location ON gbp_profiles USING GIST (location);

-- 4. Proactive Recommendations Table (The Next Best Action Queue)
CREATE TABLE proactive_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES gbp_profiles(id) ON DELETE CASCADE,
    impact_badge VARCHAR(50) NOT NULL, -- '⚡ High Impact', '🚨 Rank Alert', '💬 Review Opportunity', etc.
    category VARCHAR(50) NOT NULL, -- 'CONTENT_POST', 'REVIEW_REPLY', 'GEO_GRID_RECOVERY', 'PROFILE_FIX', 'HOURS_UPDATE'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_projection VARCHAR(100), -- e.g. '+18% Maps Impressions', 'Recover #2 Rank'
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'EXECUTED', 'DISMISSED'
    action_payload JSONB NOT NULL, -- Full JSON schema for 1-click execution handler
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recommendations_profile_status ON proactive_recommendations(profile_id, status);

-- 5. Geo-Grid Scans Table
CREATE TABLE geo_grid_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES gbp_profiles(id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL,
    grid_size VARCHAR(20) DEFAULT '5x5', -- '3x3', '5x5', '7x7'
    radius_km NUMERIC(4,2) DEFAULT 1.0,
    average_rank NUMERIC(4,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Rank Snapshots (Individual Grid Node Coordinates)
CREATE TABLE rank_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES geo_grid_scans(id) ON DELETE CASCADE,
    node_location GEOGRAPHY(Point, 4326) NOT NULL,
    rank_position INT NOT NULL, -- 1 to 20+
    top_competitor_name VARCHAR(255)
);

CREATE INDEX idx_rank_snapshots_scan ON rank_snapshots(scan_id);

-- 7. Competitors Intelligence Matrix Table
CREATE TABLE competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES gbp_profiles(id) ON DELETE CASCADE,
    competitor_business_name VARCHAR(255) NOT NULL,
    rating NUMERIC(3,2),
    reviews_count INT,
    price_level VARCHAR(10), -- '$', '$$', '$$$'
    differentiation_matrix JSONB, -- Price, Quality, Convenience, Specialty, Review Velocity
    last_scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES gbp_profiles(id) ON DELETE CASCADE,
    google_review_id VARCHAR(255) UNIQUE NOT NULL,
    reviewer_name VARCHAR(255),
    reviewer_photo_url VARCHAR(500),
    rating INT NOT NULL,
    comment TEXT,
    review_date TIMESTAMP WITH TIME ZONE,
    reply_text TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'UNREPLIED' -- 'UNREPLIED', 'REPLIED', 'AUTO_REPLIED'
);

-- 9. Posts Table (Google Posts Content Studio)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES gbp_profiles(id) ON DELETE CASCADE,
    post_type VARCHAR(50) DEFAULT 'STANDARD', -- 'STANDARD', 'OFFER', 'EVENT'
    summary TEXT NOT NULL,
    cta_type VARCHAR(50), -- 'BOOK', 'CALL', 'LEARN_MORE', 'ORDER'
    cta_url VARCHAR(500),
    media_url VARCHAR(500),
    lsi_keywords TEXT[],
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'DRAFT' -- 'DRAFT', 'SCHEDULED', 'PUBLISHED'
);

-- 10. Outreach Leads & Teaser Audits
CREATE TABLE outreach_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    google_rating NUMERIC(3,2),
    unverified_status BOOLEAN DEFAULT FALSE,
    health_score INT,
    teaser_audit_id UUID UNIQUE DEFAULT gen_random_uuid(),
    status VARCHAR(50) DEFAULT 'SCRAPED', -- 'SCRAPED', 'AUDIT_SENT', 'CONVERTED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
