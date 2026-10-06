'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HealthGauge } from '@/components/HealthGauge';
import { ProactiveCard, Recommendation } from '@/components/ProactiveCard';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Zap, 
  TrendingUp, 
  Phone, 
  Navigation, 
  Globe, 
  Star, 
  MapPin, 
  Clock, 
  Check, 
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileGuardAlert, setProfileGuardAlert] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState(86);
  const [allApproved, setAllApproved] = useState(false);

  useEffect(() => {
    // Fetch proactive recommendations from FastAPI backend
    const fetchRecommendations = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
        const response = await fetch(`${baseUrl}/api/v1/recommendations/profile_123`);
        
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data);
        } else {
          console.error("Failed to fetch recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, []);

  const handleExecute = async (id: string) => {
    const targetRec = recommendations.find(r => r.id === id);
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'EXECUTED' } : rec))
    );
    setHealthScore((prev) => Math.min(100, prev + 3));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      await fetch(`${baseUrl}/api/v1/recommendations/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendation_id: id,
          action_type: targetRec?.category || '1CLICK_OPTIMIZATION',
          profile_id: 'profile_123'
        })
      });
    } catch (e) {
      console.error("Execute API error:", e);
    }
  };

  const handleDismiss = (id: string) => {
    setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
  };

  const handleApproveAll = () => {
    setRecommendations((prev) =>
      prev.map((rec) => ({ ...rec, status: 'EXECUTED' }))
    );
    setHealthScore(98);
    setAllApproved(true);
  };

  const pendingCount = recommendations.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Profile Guard Banner */}
        <div className="material-card p-4 border-l-4 border-l-google-blue bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-google-blue-light text-google-blue rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-google-text-primary text-sm">Profile Guard Active</span>
                <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
              </div>
              <p className="text-xs text-google-text-secondary">
                24/7 Baseline Sentinel monitoring profile fields. Last check: 2 minutes ago. 0 unauthorized edits detected.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setProfileGuardAlert("Simulated Unauthorized Phone Number Edit Reverted by Profile Guard!")}
            className="material-button-ghost text-xs text-google-blue font-semibold hover:bg-google-blue-light"
          >
            Test Guard Sentinel
          </button>
        </div>

        {/* Simulated Alert Banner if triggered */}
        {profileGuardAlert && (
          <div className="p-4 bg-google-red-light border border-google-red/40 rounded-xl text-xs text-google-red flex items-center justify-between font-medium animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-google-red" />
              <span>{profileGuardAlert}</span>
            </div>
            <button onClick={() => setProfileGuardAlert(null)} className="underline text-[11px]">Dismiss</button>
          </div>
        )}

        {/* Top Header: Health Meter + Primary Quick Action */}
        <div className="material-card p-6 bg-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <HealthGauge score={healthScore} size={100} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-google-text-primary">Business Profile Health</h1>
                <span className="text-xs font-bold text-google-green bg-google-green-light px-2.5 py-0.5 rounded-full">
                  TOP 5% IN SECTOR
                </span>
              </div>
              <p className="text-xs text-google-text-secondary mt-1">
                {pendingCount > 0 
                  ? `AI identified ${pendingCount} high-impact recommendations to increase local search rank.` 
                  : 'All proactive actions executed! Your profile is at peak optimization.'}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-google-text-secondary">
                <span>📍 Geo-Grid Rank: <strong className="text-google-green">#2 Avg</strong></span>
                <span>⭐ Rating: <strong className="text-google-text-primary">4.9 (148 reviews)</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleApproveAll}
              disabled={pendingCount === 0}
              className="material-button-primary w-full sm:w-auto text-xs py-3 px-5 font-bold"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{allApproved ? 'All 4 Actions Executed' : `⚡ Approve All ${pendingCount} Actions`}</span>
            </button>
          </div>
        </div>

        {/* Central Hero Section: Proactive Next Best Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-google-blue" />
              <h2 className="text-lg font-bold text-google-text-primary">Today's Proactive Next Best Actions</h2>
            </div>
            <span className="text-xs font-semibold text-google-text-secondary bg-google-bg px-2.5 py-1 rounded-lg border border-google-border">
              {pendingCount} Actions Pending
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <ProactiveCard
                key={rec.id}
                recommendation={rec}
                onExecute={handleExecute}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        </div>

        {/* Secondary Intelligence Grid (3-Column Layout) */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Column 1: Geo-Grid Quick Snap */}
          <div className="material-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-google-border-light pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-google-blue" />
                <h3 className="font-bold text-google-text-primary text-sm">Geo-Grid Quick Snap</h3>
              </div>
              <span className="text-[11px] text-google-blue font-semibold">3x3 Grid</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1">
              {[1, 2, 1, 2, 3, 2, 4, 3, 2].map((rank, i) => (
                <div 
                  key={i} 
                  className={`h-14 rounded-lg flex items-center justify-center font-extrabold text-white text-base shadow-sm ${
                    rank <= 2 ? 'bg-google-green' : rank <= 3 ? 'bg-google-yellow' : 'bg-google-red'
                  }`}
                >
                  #{rank}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-google-border-light flex items-center justify-between text-xs">
              <span className="text-google-text-secondary">7-Day Trajectory:</span>
              <span className="text-google-green font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +2 Positions Up
              </span>
            </div>
          </div>

          {/* Column 2: Review Velocity & FTC Speedometer */}
          <div className="material-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-google-border-light pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-google-yellow fill-google-yellow" />
                <h3 className="font-bold text-google-text-primary text-sm">Review Velocity & Speedometer</h3>
              </div>
              <span className="text-[10px] font-bold text-google-green bg-google-green-light px-2 py-0.5 rounded">
                FTC SAFE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-google-bg p-2.5 rounded-lg border border-google-border-light">
                <span className="text-google-text-secondary">Weekly Safe Request Limit:</span>
                <span className="font-bold text-google-text-primary">5 / 8 Requests Used</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-google-text-secondary">
                  <span>Sentiment Trajectory</span>
                  <span className="text-google-green font-bold">98% Positive</span>
                </div>
                <div className="w-full bg-google-border-light rounded-full h-2">
                  <div className="bg-google-green h-2 rounded-full w-[98%]" />
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px]">
                <span className="text-google-text-secondary">Unreplied Reviews:</span>
                <span className="font-bold text-google-blue bg-google-blue-light px-2 py-0.5 rounded">0 Pending</span>
              </div>
            </div>
          </div>

          {/* Column 3: Direct GBP Conversion Metrics */}
          <div className="material-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-google-border-light pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-google-green" />
                <h3 className="font-bold text-google-text-primary text-sm">30-Day Conversion Actions</h3>
              </div>
              <span className="text-[10px] text-google-text-tertiary">Direct Google Data</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-google-text-secondary">
                  <Phone className="w-4 h-4 text-google-blue" /> Direct Phone Calls
                </span>
                <span className="font-bold text-google-text-primary">342 (+18%)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-google-text-secondary">
                  <Navigation className="w-4 h-4 text-google-green" /> Direction Requests
                </span>
                <span className="font-bold text-google-text-primary">890 (+24%)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-google-text-secondary">
                  <Globe className="w-4 h-4 text-purple-600" /> Website Clicks
                </span>
                <span className="font-bold text-google-text-primary">1,240 (+12%)</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
