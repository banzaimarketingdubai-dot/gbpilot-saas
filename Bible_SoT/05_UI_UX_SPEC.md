# UI/UX Design System & Information Architecture Specification (`UI_UX_SPEC.md`)

## 1. Design Aesthetics & Visual Tokens (Google Maps Material Design 3)

GBPilot employs a **clean, native Google Material Design 3 visual hierarchy**. The goal is to make the platform feel like a seamless, official extension of the Google Maps and Google Business Profile ecosystem. It utilizes high-contrast white surfaces, subtle drop shadows, and signature Google brand colors.

### Visual Tokens:
- **Color Palette (Google Maps Official):**
  - **Background Base:** Light Gray `#F8F9FA` (Google standard app background).
  - **Surface Elevation (Cards, Modals):** Pure White `#FFFFFF` with Material Shadow (`0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)`).
  - **Primary Action (Buttons, Links):** Google Blue `#1A73E8` (Hover: `#174EA6`).
  - **Success / Map Pins:** Maps Green `#1E8E3E` / `#34A853`.
  - **Warning / Rank Alert:** Google Yellow `#F9AB00` & Google Red `#D93025`.
  - **Text Colors:** Primary Dark `#202124`, Secondary Muted `#5F6368`, Borders `#DADCE0`.
- **Typography:**
  - Font Family: `Google Sans` (primary headings) and `Roboto` (body text) via Google Fonts.
  - Headings: Clean, flat, dark gray (`#202124`) without gradients.
- **Animations & Micro-interactions:**
  - **Material Ripples:** Standard Google ripple effect on button clicks.
  - **Elevation Transitions:** Hovering over a card smoothly increases the shadow elevation (from resting `dp1` to hover `dp4`).
  - **Rounded Corners:** Consistent `8px` or `16px` border-radius following Material 3 guidelines.

---

## 2. Information Architecture & Navigation

```
GBPilot Root Layout
├── Sidebar / Top Navigation Bar
│   ├── Business Profile Selector dropdown (Multi-location)
│   ├── Autopilot Mode Toggle [ Off | Manual Approval | 100% Autopilot ]
│   ├── Navigation Links:
│   │   ├── ⚡ Dashboard (Action Hub) `/dashboard`
│   │   ├── 🤖 AI Growth Copilot `/copilot`
│   │   ├── 🗺️ Geo-Grid Radar `/geo-grid`
│   │   ├── 💬 Reviews & Content `/reviews-posts`
│   │   └── 🎯 Lead Outreach `/outreach`
│   └── User / Agency Settings & White-Label Profile
└── Main Active Screen Workspace
```

---

## 3. Screen Specs & Detailed Component Breakdown

### Screen 0: Onboarding & Profile Setup Wizard (`/onboarding`)
*Dual-path onboarding flow enabling seamless setup for businesses with or without a Google Business Profile.*

#### Layout & Mode Selection:
- **Global Selector Step:** `[ Mode A: I do NOT have a Google Business Profile ]` vs `[ Mode B: I ALREADY HAVE a Google Business Profile ]`

#### Path A UI (No Existing Profile):
1. **URL & Website Analysis Step:**
   - Input box: `"Enter your website URL (e.g. https://mybakery.com)"`
   - Action: `[Scrape & Extract Business Core]` -> Shows real-time extraction progress chips (Address, Phone, Services, Target Keywords).
2. **AI Interactive Interview Workspace:**
   - Embedded mini Copilot chat: Asking 3 quick clarifying questions to enrich primary/secondary categories, landmarks, and unique selling points.
3. **Draft Profile Confirmation Card:**
   - Editable overview card of newly created business entity + `[Generate Launch Package & Geo-Grid Baseline]`.

#### Path B UI (Zero-Friction Flow for Existing Profile):
1. **Magic Search Scan (No Auth Gateway):**
   - Single clean input box: `"Enter your business name or address on Google Maps"`.
   - Results view: Instantly displays a 3x3 Geo-Grid heatmap showing "Red Zones" (lost traffic) and a Profile Completeness Score to trigger FOMO.
2. **1-Click Google OAuth & Smart Instant Fix:**
   - Primary sticky CTA: `[Fix these issues in 1-Click (Connect Google)]`.
   - Post-auth loading screen: "AI is analyzing your competitors and preparing Quick Wins...".
   - **Smart Instant Fix Modal:** Displays pre-generated missing categories, a draft welcome Google Post, and AI-replies for the last 3 negative reviews. CTA: `[Apply AI Optimization]`.
3. **1-Click Local Website Builder (Optional Step):**
   - If the system detects a missing or slow website, it offers to generate an SEO-optimized landing page using GBP data.
   - Button: `[Publish Local SEO Website (Powered by AI)]`.

---

### Screen 1: Main Proactive Analytics & Action Hub (`/dashboard`)
*The central command deck where daily proactive decisions are presented and executed.*

#### Layout Structure:
1. **Header Toolbar:**
   - Business Health Score Radial Meter (e.g. `84/100`, animated circle badge with score category breakdown).
   - "Autopilot Active" status indicator with pulsating emerald pulse dot.
   - Quick Action: `[⚡ Approve All 5 Recommendations]` primary button.
2. **Profile Guard System Widget (Top Banner):**
   - Active status: `🛡️ Profile Guard Active: Last baseline check 2 mins ago.`
   - Alert state (if triggered): Red banner showing `"Unauthorized change to Phone Number detected & reverted. [View Diff]"`
3. **Hero Section: "Today's Proactive Next Best Actions" (Central Focal Point)**
   - Stacked horizontal carousel or 5-card grid featuring animated recommendation cards (including **Dynamic Hours** extension cards for peak traffic).
   - **Card Anatomy:**
     - **Top Row:** `[Impact Badge: ⚡ High Impact / 🚨 Rank Alert]` + `[Category Tag]` + `[Projected Boost]`.
     - **Title & Description:** Bold action headline with problem context.
     - **Pre-computed Content Preview:** Expandable preview box.
     - **Action CTA Group:** `[1-Click Execute]`, `[Customize]`, `[Dismiss]`.
4. **Secondary Intelligence Grid (3-Column Layout):**
   - **Column 1: Geo-Grid Quick Snap** - Compact 3x3 heatmap widget showing today vs 7-day rank trajectory.
   - **Column 2: Review Velocity & Sentiment** - Breakdown of positive/negative sentiment trends and unreplied count.
   - **Column 3: Direct GBP Conversion Metrics** - Sparkline charts for Calls, Direction Requests, and Website Clicks.

---

### Screen 2: AI Growth Copilot Manager (`/copilot`)
*Full-screen conversational workspace acting as a 24/7 Senior Local SEO Manager.*

#### Layout Structure:
1. **Left Sidebar (Prompt Starters & History):**
   - Pre-loaded Quick Action Buttons:
     - 🚀 *"Analyze my top competitor this week"*
     - 📈 *"How can I improve my ranking for 'dog-friendly'?"*
     - 📊 *"Prepare a monthly performance report"*
     - ✍️ *"Draft a promotional offer post for this Friday"*
2. **Main Chat Area:**
   - Header displaying Copilot status: `"AI Maps Manager (GPT-4o / Claude 3.5 Active)"` + Active location scope.
   - Chat transcript stream supporting Markdown formatting, LaTeX math formulas, table previews, and code blocks.
   - **Interactive Inline Widgets embedded directly in chat messages:**
     - *Draft Post Card Widget:* Includes edit fields and a single `[Publish to Google Maps Now]` button.
     - *Reply Preview Card Widget:* Renders review rating stars, customer text, and generated response options.
     - *Live Rank Snapshot Widget:* Embedded mini Geo-Grid map right inside the conversation thread.
3. **Chat Input Dock:**
   - Multi-line textarea with auto-expand, speech-to-text trigger, attachment button, and Send button.

---

### Screen 3: Geo-Grid, LLM Visibility & Competitor Radar (`/geo-grid`)
*Interactive spatial rank distribution tracker and AI Search visibility engine.*

#### Layout Structure:
1. **Control Header:**
   - View Tabs: `[📍 Google Maps Geo-Grid]` | `[🤖 AI Search Share-of-Voice (GEO)]`
   - Keyword Switcher Dropdown (e.g. *"breakfast cafe"*).
   - Grid Configuration: `[3x3 | 5x5 | 7x7 Grid]` selector + Distance radius step.
   - Historical Timeline Slider (Scrub backwards across previous scan dates).
2. **Tab 1 Viewport: Mapbox / Google Maps SDK Integration:**
   - Rendered grid pins color-coded by rank position (Green 1-3, Yellow 4-10, Red 11+).
3. **Tab 2 Viewport: LLM Share-of-Voice Engine:**
   - Charts displaying brand mention frequency across ChatGPT, Gemini, and Google AI Overviews.
   - "Expert Curated Lists" target table: Shows local articles (e.g., "Top 10 cafes in NYC") where the business is missing, providing outreach targets.
4. **Competitor Side-Panel: 5-Factor Differentiation Matrix:**
   - Compares Client Profile vs Top 3 Market Leaders across 5 key dimensions:
     1. **Price Level & Offers**
     2. **Quality & Review Score**
     3. **Convenience & Amenities**
     4. **Specialty Keywords**
     5. **Review Velocity**
5. **Competitor Challenge Link (Viral B2B Sharing):**
   - Button `[Share Competitor Comparison]`. Generates a public URL (e.g., "See how [Business] outranks [Competitor]").

---

### Screen 4: Reviews & Content Studio (`/reviews-posts`)
*Automated review responder, offline-to-online viral loops, & Google Posts calendar engine.*

#### Layout Structure:
1. **Tab 1: Smart Review Inbox & FTC-Compliant Speedometer:**
   - **Review Speedometer Widget:** Dashboard showing natural review pacing limit (e.g., "Safe to request 2 more reviews this week"). Ensures FTC compliance and prevents algorithmic filtering.
   - Master Auto-Responder Toggle Switch: `[Autopilot Auto-Reply: ON | OFF]`.
   - Filter bar: All, Unreplied, 5-Star, Critical (1-3 Star).
   - **AI Suggested Response Box:**
     - 3 Tone Buttons.
     - Injected GEO LSI keyword highlighting (e.g., highlights *"espresso bar near Sector B"*).
     - CTA button: `[Send Response]`.
2. **Tab 2: QR & NFC Poster Constructor (Offline-to-Online Viral Loop):**
   - Canvas to automatically generate branded Table Tents, Stickers, and Posters containing a QR code for review collection.
   - Includes a discreet watermark: *"Smart Reviews Powered by GBPilot"*.
   - Output options: `[Export PDF for Print]` or `[Order NFC Stands ($25)]`.
3. **Tab 3: Google Posts Content Planner:**
   - Calendar View & Grid List of scheduled, published, and AI-drafted Google Posts.
   - **Post Composer Modal / Panel:**
     - Post Type Selector.
     - AI Generator prompt input + GEO LSI auto-injection suggestions.
     - Image Dropzone with AI Geotag metadata overlay tagger.

---

### Screen 5: Lead Gen & Cold Outreach (`/outreach`)
*White-label lead scraper and audit report funnel for agency users.*

#### Layout Structure:
1. **Lead Finder Table:**
   - Search parameters: Location, Industry category, Radius.
   - Table columns: Business Name, Rating, Unverified Status, Missing Photos indicator, Missing Website, Action CTA.
2. **Rank Replay GIF Generator:**
   - Modal allowing agency to select a competitor's profile, calculate their 30-day rank drop, and render a 5-second animated GIF showing the grid turning from Green to Red for use in cold emails.
3. **Teaser Audit Link Generator:**
   - Click `[Generate Teaser Audit]` -> Generates unique URL `/audit/[audit_id]`.
4. **Public Audit Landing Page View (`/audit/[audit_id]`):**
   - Sleek public-facing dynamic page designed to convert local business leads.
   - Displays: Overall GBP Health Score preview, 3x3 Geo-Grid snapshot, 3 Critical Issues identified, and a call-to-action to claim a 14-day Pro Autopilot Trial.
