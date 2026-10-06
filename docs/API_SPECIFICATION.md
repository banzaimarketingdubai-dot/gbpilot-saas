# OpenAPI REST & Streaming API Specification (`API_SPECIFICATION.md`)

## 1. Overview & Authentication
Base URL: `/api/v1`  
Authentication: Bearer JWT Token (`Authorization: Bearer <token>`)

---

## 2. Endpoints Summary

### Proactive Recommendation Engine

#### `GET /api/v1/recommendations/daily`
Fetches today's top prioritized action recommendations for an active business profile.

- **Query Parameters:**
  - `profile_id` (UUID, required): Target GBP Profile ID.
  - `status` (string, optional, default: `"PENDING"`): Filter by `"PENDING" | "EXECUTED" | "DISMISSED"`.
- **Response `200 OK` JSON:**
```json
{
  "profile_id": "9f8b2c10-5e3a-4a2b-8a1d-7c2e1f4b5d6a",
  "health_score": 84,
  "autopilot_mode": "MANUAL_APPROVAL",
  "recommendations": [
    {
      "id": "rec_01h8x1a2b3c4d5e6f7g8h9j0k1",
      "impact_badge": "⚡ High Impact",
      "category": "CONTENT_POST",
      "title": "Competitor 'Artisan Roastery' added 10 photos",
      "description": "Counter competitor photo push by publishing 3 geotagged photos and an LSI-optimized Google Post targeting 'fresh roasted coffee'.",
      "target_projection": "+18% Maps Impressions",
      "status": "PENDING",
      "created_at": "2026-10-06T08:00:00Z",
      "action_payload": {
        "action_type": "CREATE_GOOGLE_POST",
        "post_data": {
          "summary": "Enjoy fresh artisanal roasts at downtown's premier coffee sanctuary. Dog-friendly outdoor patio and high-speed Wi-Fi available!",
          "cta_type": "LEARN_MORE",
          "cta_url": "https://example.com/menu",
          "lsi_keywords": ["fresh roasted coffee", "downtown roaster", "dog-friendly patio"]
        }
      }
    },
    {
      "id": "rec_02h8x1a2b3c4d5e6f7g8h9j0k2",
      "impact_badge": "🚨 Rank Alert",
      "category": "GEO_GRID_RECOVERY",
      "title": "Rank dropped from #2 to #5 for keyword 'breakfast cafe' in Sector B",
      "description": "Rank drop detected across 3 grid nodes. Publish targeted post with 'breakfast cafe' LSI keywords.",
      "target_projection": "Recover #2 Rank",
      "status": "PENDING",
      "action_payload": {
        "action_type": "CREATE_GOOGLE_POST",
        "post_data": {
          "summary": "Looking for the top breakfast cafe in Sector B? Stop by for organic breakfast sandwiches and hand-crafted lattes.",
          "cta_type": "BOOK",
          "cta_url": "https://example.com/reserve"
        }
      }
    }
  ]
}
```

#### `POST /api/v1/recommendations/execute`
Triggers immediate execution of a specific recommendation ID.

- **Request Body:**
```json
{
  "recommendation_id": "rec_01h8x1a2b3c4d5e6f7g8h9j0k1",
  "custom_overrides": {
    "summary": "Customized post text if user edited before clicking 1-Click execute."
  }
}
```
- **Response `200 OK` JSON:**
```json
{
  "success": true,
  "recommendation_id": "rec_01h8x1a2b3c4d5e6f7g8h9j0k1",
  "execution_status": "COMPLETED",
  "result_message": "Google Post successfully published to GBP Profile.",
  "timestamp": "2026-10-06T08:32:15Z"
}
```

---

### AI Growth Copilot Manager

#### `POST /api/v1/copilot/chat` (Server-Sent Events / SSE)
Streams responses from the AI Copilot Growth Manager with tool calling capabilities.

- **Request Body:**
```json
{
  "profile_id": "9f8b2c10-5e3a-4a2b-8a1d-7c2e1f4b5d6a",
  "message": "Analyze my top competitor this week and compare our review ratings.",
  "conversation_history": [
    { "role": "user", "content": "Hi Copilot" },
    { "role": "assistant", "content": "Hello! I am your AI Google Maps Growth Manager. How can I boost your rankings today?" }
  ]
}
```
- **Response Stream Headers:** `Content-Type: text/event-stream`
- **Stream Event Format:**
```
event: text_delta
data: {"text": "I checked your top local competitor **Artisan Roasters**."}

event: widget
data: {"widget_type": "COMPETITOR_CARD", "payload": {"name": "Artisan Roasters", "rating": 4.8, "reviews_count": 310, "diff_score": "+0.3"}}

event: text_delta
data: {"text": "\n\nThey gained 8 new reviews this week focusing on 'outdoor seating'. I recommend publishing a post highlighting your patio."}

event: done
data: {"status": "complete"}
```

---

### Geo-Grid & Competitor Radar

#### `POST /api/v1/geo-grid/scan`
Triggers SERP rank scan across grid coordinates.

- **Request Body:**
```json
{
  "profile_id": "9f8b2c10-5e3a-4a2b-8a1d-7c2e1f4b5d6a",
  "keyword": "breakfast cafe",
  "grid_size": "5x5",
  "radius_km": 1.0
}
```
- **Response `200 OK` JSON:**
```json
{
  "scan_id": "grid_102938484",
  "keyword": "breakfast cafe",
  "grid_size": "5x5",
  "average_rank": 3.4,
  "nodes": [
    { "lat": 40.7128, "lng": -74.0060, "rank": 2, "top_competitor": "Cafe Luna" },
    { "lat": 40.7138, "lng": -74.0070, "rank": 5, "top_competitor": "Artisan Roasters" }
  ],
  "competitor_matrix": [
    {
      "name": "Artisan Roasters",
      "price_level": "$$",
      "rating": 4.8,
      "reviews": 310,
      "convenience": ["Outdoor Seating", "Free Wi-Fi"],
      "specialty_keywords": ["espresso", "pastries", "vegan breakfast"]
    }
  ]
}
```

---

### Reviews & Posts Management

#### `POST /api/v1/gbp/reviews/reply`
Sends automated or customized AI reply to a customer review.

- **Request Body:**
```json
{
  "review_id": "rev_77382",
  "reply_text": "Thank you so much for visiting our espresso bar near Sector B! We are delighted you loved our dog-friendly patio.",
  "tone": "Warm & Friendly"
}
```
- **Response `200 OK` JSON:**
```json
{
  "success": true,
  "review_id": "rev_77382",
  "status": "REPLIED"
}
```

---

### Lead Gen & Outreach

#### `GET /api/v1/outreach/leads`
Retrieves scraped local leads with GBP health indicators.

#### `GET /api/v1/audit/{audit_id}`
Returns public teaser audit data for dynamic prospect landing page.
