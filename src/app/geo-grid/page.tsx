'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CompetitorMatrix, CompetitorComparison } from '@/components/CompetitorMatrix';
import { 
  MapPin, 
  Bot, 
  Search, 
  Calendar, 
  Layers, 
  Share2, 
  TrendingUp, 
  ExternalLink,
  Sparkles,
  Sliders
} from 'lucide-react';

const MOCK_COMPETITORS: CompetitorComparison[] = [
  {
    name: 'Your Business',
    rating: 4.9,
    reviewsCount: 148,
    reviewVelocityPerWeek: 5,
    priceLevel: '$$',
    convenience: ['WiFi', 'Outdoor Seating', 'Takeout', 'Apple Pay'],
    specialtyKeywords: ['sourdough', 'espresso', 'pastries', 'catering'],
    diffScore: 'LEADER'
  },
  {
    name: 'Green Bakery & Artisan Bread',
    rating: 4.6,
    reviewsCount: 112,
    reviewVelocityPerWeek: 6,
    priceLevel: '$$',
    convenience: ['Takeout', 'Curbside Pickup'],
    specialtyKeywords: ['gluten-free', 'vegan sourdough', 'drip coffee'],
    diffScore: 'CHALLENGER'
  },
  {
    name: 'Central District Cafe',
    rating: 4.4,
    reviewsCount: 89,
    reviewVelocityPerWeek: 2,
    priceLevel: '$',
    convenience: ['WiFi', 'Pet Friendly'],
    specialtyKeywords: ['cold brew', 'bagels', 'sandwiches'],
    diffScore: 'LAGGING'
  }
];

export default function GeoGridPage() {
  const [activeTab, setActiveTab] = useState<'MAPS_GRID' | 'AI_LLM_GEO'>('MAPS_GRID');
  const [selectedKeyword, setSelectedKeyword] = useState('organic sourdough bread');
  const [gridSize, setGridSize] = useState<'3x3' | '5x5' | '7x7'>('3x3');
  const [timelineIndex, setTimelineIndex] = useState(3); // Today

  // State for grid ranks
  const [isScanning, setIsScanning] = useState(false);
  const [gridRanks, setGridRanks] = useState([
    { pos: 1, rank: 0, competitor: 'No Data' },
    { pos: 2, rank: 0, competitor: 'No Data' },
    { pos: 3, rank: 0, competitor: 'No Data' },
    { pos: 4, rank: 0, competitor: 'No Data' },
    { pos: 5, rank: 0, competitor: 'No Data' },
    { pos: 6, rank: 0, competitor: 'No Data' },
    { pos: 7, rank: 0, competitor: 'No Data' },
    { pos: 8, rank: 0, competitor: 'No Data' },
    { pos: 9, rank: 0, competitor: 'No Data' },
  ]);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const stored = localStorage.getItem('gbpilot_active_profile');
      let profileId = "123";
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id) profileId = parsed.id;
      }
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const res = await fetch(`${baseUrl}/api/v1/geo-grid/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId, keyword: selectedKeyword, grid_size: 3, distance_meters: 500.0 })
      });
      
      if (res.ok) {
        const data = await res.json();
        // data.grid: [{pos: 1, rank: 1, lat: X, lng: Y}, ...]
        const newRanks = data.grid.map((g: any) => ({
          pos: g.pos,
          rank: g.rank,
          competitor: g.rank === 1 ? 'You' : (g.rank > 20 ? 'Not Found' : 'Competitor')
        }));
        setGridRanks(newRanks);
      } else {
        alert("Scan failed. Ensure API keys are active.");
      }
    } catch (e) {
      console.error(e);
      alert("Error contacting scan endpoint.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Header & Tab Bar */}
        <div className="material-card p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-google-text-primary flex items-center gap-2">
              <MapPin className="w-6 h-6 text-google-blue" />
              Geo-Grid & AI LLM Visibility Radar
            </h1>
            <p className="text-xs text-google-text-secondary mt-1">
              Spatial rank heatmap tracking & AI Search Share-of-Voice (ChatGPT, Gemini, Perplexity).
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-google-bg p-1 rounded-xl border border-google-border">
            <button
              onClick={() => setActiveTab('MAPS_GRID')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'MAPS_GRID'
                  ? 'bg-white text-google-blue shadow-sm border border-google-border-light'
                  : 'text-google-text-secondary hover:text-google-text-primary'
              }`}
            >
              📍 Google Maps Geo-Grid
            </button>
            <button
              onClick={() => setActiveTab('AI_LLM_GEO')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'AI_LLM_GEO'
                  ? 'bg-white text-google-blue shadow-sm border border-google-border-light'
                  : 'text-google-text-secondary hover:text-google-text-primary'
              }`}
            >
              🤖 AI Search Share-of-Voice (GEO)
            </button>
          </div>
        </div>

        {/* TAB 1: GOOGLE MAPS GEO-GRID */}
        {activeTab === 'MAPS_GRID' && (
          <div className="space-y-6">
            
            {/* Control Filters Bar */}
            <div className="material-card p-4 bg-white flex flex-wrap items-center justify-between gap-4 text-xs">
              
              {/* Keyword Selector */}
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-google-text-tertiary" />
                <span className="font-semibold text-google-text-secondary">Target Keyword:</span>
                <select
                  value={selectedKeyword}
                  onChange={(e) => setSelectedKeyword(e.target.value)}
                  className="material-input text-xs py-1.5 px-3 w-56 font-medium bg-white"
                >
                  <option value="bakery in new york">bakery in new york</option>
                  <option value="organic sourdough bread">organic sourdough bread</option>
                  <option value="artisan espresso bar">artisan espresso bar</option>
                  <option value="best breakfast cafe near me">best breakfast cafe near me</option>
                </select>
              </div>

              {/* Grid Selector */}
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-google-text-tertiary" />
                <span className="font-semibold text-google-text-secondary">Grid Dimension:</span>
                <div className="flex bg-google-bg p-1 rounded-lg border border-google-border">
                  {(['3x3', '5x5', '7x7'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setGridSize(size)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        gridSize === size ? 'bg-white text-google-blue shadow-xs' : 'text-google-text-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scan Trigger */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="material-button-primary text-xs py-2 px-4 font-bold flex items-center gap-2"
                >
                  {isScanning ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Scanning API...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5" />
                      Run Live Grid Scan
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Spatial Map Viewport & Pin Heatmap */}
            <div className="material-card p-6 bg-white relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-google-text-primary text-sm">Spatial Pin Heatmap ({gridSize})</h3>
                  <p className="text-xs text-google-text-secondary">Distance Step: 0.5 km radius around 540 Broadway, NY</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-google-green" /> Top 3 (Winning)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-google-yellow" /> Rank 4-8 (Warning)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-google-red" /> Rank 9+ (Lost Traffic)</span>
                </div>
              </div>

              {/* Simulated Interactive Map Grid Box */}
              <div className="w-full h-96 bg-slate-100 rounded-2xl relative flex items-center justify-center border border-google-border overflow-hidden">
                {/* Background Map Graphic Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1A73E8_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Pin Matrix Overlay */}
                <div className="grid grid-cols-3 gap-6 relative z-10 p-4">
                  {gridRanks.map((item) => {
                    const isWinning = item.rank <= 3;
                    return (
                      <div
                        key={item.pos}
                        className={`w-20 h-20 rounded-2xl shadow-material-2 flex flex-col items-center justify-center text-white transition-all transform hover:scale-110 cursor-pointer ${
                          item.rank <= 2 ? 'bg-google-green' : item.rank <= 3 ? 'bg-google-yellow' : 'bg-google-red'
                        }`}
                      >
                        <MapPin className="w-4 h-4 mb-0.5 fill-white" />
                        <span className="text-lg font-black leading-none">#{item.rank}</span>
                        <span className="text-[9px] opacity-90 truncate max-w-[60px]">{item.competitor}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Competitor Differentiation Matrix Component */}
            <CompetitorMatrix competitors={MOCK_COMPETITORS} />

          </div>
        )}

        {/* TAB 2: AI SEARCH SHARE-OF-VOICE (GEO) */}
        {activeTab === 'AI_LLM_GEO' && (
          <div className="space-y-6">
            
            {/* LLM Mentions Metric Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="material-card p-5 bg-white space-y-2">
                <span className="text-xs font-semibold text-google-text-secondary block">ChatGPT Brand Mention Rate</span>
                <span className="text-2xl font-black text-google-blue">78%</span>
                <p className="text-[11px] text-google-green font-bold">Recommended in 8/10 Local Bakery Prompts</p>
              </div>

              <div className="material-card p-5 bg-white space-y-2">
                <span className="text-xs font-semibold text-google-text-secondary block">Gemini AI Overviews Share</span>
                <span className="text-2xl font-black text-google-green">92%</span>
                <p className="text-[11px] text-google-green font-bold">Featured in Top 3 Local Snippets</p>
              </div>

              <div className="material-card p-5 bg-white space-y-2">
                <span className="text-xs font-semibold text-google-text-secondary block">Perplexity Recommendation Index</span>
                <span className="text-2xl font-black text-purple-600">65%</span>
                <p className="text-[11px] text-google-text-secondary">Needs structured citation backlinks</p>
              </div>

            </div>

            {/* Target Curated Local Lists Outreach Table */}
            <div className="material-card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-google-border-light pb-4">
                <div>
                  <h3 className="font-bold text-google-text-primary text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-google-blue" />
                    Expert Curated Lists & Citation Targets
                  </h3>
                  <p className="text-xs text-google-text-secondary">High-authority local blogs feeding data directly into LLM models.</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { title: "Top 10 Artisanal Bakeries in NYC (2026)", status: "MISSING", impact: "High", domain: "eater.com/nyc" },
                  { title: "Best Espresso & Coffee Shops in Broadway", status: "FEATURED (#2)", impact: "Verified", domain: "timeout.com/nyc" },
                  { title: "Dog-Friendly Cafes in Sector 4", status: "MISSING", impact: "Medium", domain: "nyceats.org" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-google-bg rounded-xl border border-google-border-light">
                    <div>
                      <h4 className="font-bold text-google-text-primary">{item.title}</h4>
                      <span className="text-[10px] text-google-text-tertiary font-mono">{item.domain}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        item.status.includes('FEATURED') ? 'bg-google-green-light text-google-green' : 'bg-google-red-light text-google-red'
                      }`}>
                        {item.status}
                      </span>
                      <button className="material-button-ghost text-xs text-google-blue">
                        Outreach <ExternalLink className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
