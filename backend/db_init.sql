-- Database Initialization Script for Supabase SQL Editor
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
    health_score INT DEFAULT 75,
    autopilot_mode VARCHAR(50) DEFAULT 'MANUAL_APPROVAL',
    refresh_token_encrypted TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for location spatial queries
CREATE INDEX idx_gbp_profiles_location ON gbp_profiles USING GIST (location);

-- 4. Proactive Recommendations Table (The Next Best Action Queue)
CREATE TABLE proactive_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES gbp_profiles(id) ON DELETE CASCADE,
    impact_badge VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_projection VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    action_payload JSONB NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recommendations_profile_status ON proactive_recommendations(profile_id, status);

-- 5. Geo-Grid Scans Table
CREATE TABLE geo_grid_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES gbp_profiles(id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL,
    grid_size VARCHAR(20) DEFAULT '5x5',
    radius_km NUMERIC(4,2) DEFAULT 1.0,
    average_rank NUMERIC(4,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Rank Snapshots
CREATE TABLE rank_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES geo_grid_scans(id) ON DELETE CASCADE,
    node_location GEOGRAPHY(Point, 4326) NOT NULL,
    rank_position INT NOT NULL,
    top_competitor_name VARCHAR(255)
);

CREATE INDEX idx_rank_snapshots_scan ON rank_snapshots(scan_id);

-- 7. Reviews Table
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
    status VARCHAR(50) DEFAULT 'UNREPLIED'
);
