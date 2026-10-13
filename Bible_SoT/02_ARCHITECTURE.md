# Technical Architecture Specification (`ARCHITECTURE.md`)

## 1. System Overview & Technology Stack

GBPilot is architected as a high-performance, decoupled SaaS application leveraging modern Next.js 14+ on the frontend and FastAPI (Python) on the backend, backed by PostgreSQL + PostGIS, Redis, Celery background workers, and AI services.

```
                  ┌─────────────────────────────────────────┐
                  │          Client Browser (Next.js 14)    │
                  │   App Router, Shadcn UI, Framer Motion  │
                  └────────────────────┬────────────────────┘
                                       │
                      REST / SSE / WebSocket API Connections
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │         FastAPI Backend Gateway         │
                  │     JWT Auth, Route Handlers, Pydantic  │
                  └────────┬──────────────────────┬─────────┘
                           │                      │
            Async Task Dispatch                   │ Database Query
                           │                      │
                           ▼                      ▼
           ┌───────────────────────────┐  ┌───────────────────────────┐
           │ Celery Workers + Redis    │  │ PostgreSQL + PostGIS      │
           │  - Geo-Grid SERP Scraper  │  │  - GBP Entities & Grids   │
           │  - Daily Recs Generator   │  │  - Recommendations Queue │
           │  - Auto Review Responder  │  │  - Rank Snapshot Vectors  │
           └─────────────┬─────────────┘  └───────────────────────────┘
                         │
           External APIs │ Integrations
                         ▼
           ┌────────────────────────────────────────────────────────┐
           │ OpenAI GPT-4o / Claude 3.5 Sonnet (Structured JSON)   │
           │ Google Business Profile API v1 (OAuth2 Refresh Tokens) │
           │ SerpAPI / Outscraper / Mapbox GL                      │
           └────────────────────────────────────────────────────────┘
```

### Stack Components:

#### Frontend Architecture:
- **Framework:** Next.js 14 (App Router, Server & Client Components).
- **Language:** TypeScript (Strict type checking).
- **Styling:** TailwindCSS v3 + Shadcn UI component primitives.
- **Animations:** Framer Motion (card gesture transitions, radial progress animations, state transitions).
- **Mapping & Spatial Visualizations:** Mapbox GL JS / `@react-google-maps/api` for rendering Geo-Grid heatmaps.
- **State & Data Fetching:** React Query (`@tanstack/react-query`) + Zustand for lightweight local state.

#### Backend Architecture:
- **Framework:** FastAPI (Python 3.11+).
- **Schema Validation:** Pydantic v2.
- **ORM & Database:** SQLAlchemy 2.0 (AsyncIO engine) with GeoAlchemy2 for PostGIS integration.
- **Background Worker & Task Queue:** Celery with Redis broker for async scraping, periodic daily recommendation generation, and automated review execution.
- **Authentication:** OAuth2 with JWT tokens + Google OAuth2 authorization flow for GBP API offline access refresh tokens.

#### Database Architecture:
- **Database Engine:** PostgreSQL 16+ with **PostGIS** spatial extension.
- **Geospatial Processing:** Spatial indexes (`GIST`) for grid node coordinate calculation and distance-based competitor searching.

#### AI Infrastructure:
- **Model Framework:** OpenAI API (`gpt-4o` / `gpt-4o-mini`) & Anthropic API (`claude-3-5-sonnet`) with JSON Schema Structured Outputs.
- **Function Calling Engine:** Dynamic AI tool binding allowing Copilot chat to trigger backend functions directly (`get_current_rankings`, `generate_google_post`, `analyze_competitor`, `apply_profile_fix`).

#### Deployment & Hosting Infrastructure (Cost-Optimized PLG Setup):
- **Frontend (UI & Routing):** Hosted on **Vercel** (Hobby/Pro tier) for Edge CDN distribution, instant Next.js SSR/SSG compilation, and zero-config CI/CD.
- **Database (PostgreSQL + PostGIS):** Hosted on **Supabase**. Takes advantage of the generous free tier for early traction. Native support for PostGIS and easy migrations.
- **Backend (FastAPI, Celery, Redis):** Hosted on **Railway** (Compute/Hobby Tier). Handles long-running Python execution, Celery background workers, and AI prompt generation at minimal cost (~$5/mo) since the heavy DB load is offloaded to Supabase.

---

## 2. Recommendation Engine Processing Pipeline

The core intelligence engine operates on a background worker loop (`generate_daily_recommendations.py`):

```
[Cron Schedule / Trigger]
          │
          ▼
1. Fetch GBP Profile Data & Recent Reviews from DB
          │
          ▼
2. Fetch Latest Geo-Grid Rank Snapshots (Coordinates & Positions)
          │
          ▼
3. Query Local SERP / Competitor Profiles (Top 3 competitors in category)
          │
          ▼
4. Formulate Prompt Context Matrix (Profile Status + Competitor Moves + Rank Drops)
          │
          ▼
5. Invoke LLM with Pydantic / JSON Schema Structured Output Rule
          │
          ▼
6. Validate JSON Payload (Up to 5 Prioritized Next Best Actions)
          │
          ▼
7. Store Actions into `proactive_recommendations` table with status 'PENDING'
          │
          ▼
8. Push Notification / SSE Broadcast to User Dashboard UI
```

---

## 3. Streaming AI Copilot Workflow (SSE / WebSocket)

```
User enters message in `/copilot` chat UI
          │
          ▼
POST `/api/v1/copilot/chat` request sent with conversation history
          │
          ▼
FastAPI checks prompt & binds tool declarations:
  - `get_current_rankings(keyword)`
  - `generate_google_post(topic, lsi_keywords)`
  - `analyze_competitor(competitor_id)`
  - `apply_profile_fix(field_name, field_value)`
          │
          ▼
If LLM requests tool call -> FastAPI executes tool internally -> feeds result back to LLM
          │
          ▼
FastAPI streams Server-Sent Events (SSE) back to client:
  event: text_delta  --> Streamed Markdown tokens
  event: widget     --> Inline JSON payload for rendering interactive draft cards/maps
  event: done       --> Finalizes response stream
```

---

## 4. Third-Party Integrations & Security

1. **Google Business Profile (GBP) API v1:**
   - Scope: `https://www.googleapis.com/auth/business.manage`
   - Refresh token securely encrypted using AES-256 in PostgreSQL.
2. **SerpAPI / Geo-Grid Scraper:**
   - Simulates localized Google Maps SERP queries at exact latitude/longitude coordinate nodes.
3. **Mapbox GL API:**
   - Renders custom dark-themed maps (`mapbox://styles/mapbox/dark-v11`) with custom HTML rank markers.
