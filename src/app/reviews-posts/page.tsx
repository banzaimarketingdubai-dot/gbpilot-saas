'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  MessageSquare, 
  QrCode, 
  Calendar as CalendarIcon, 
  Star, 
  Bot, 
  Check, 
  Sparkles, 
  Download, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Plus, 
  Image as ImageIcon 
} from 'lucide-react';

export default function ReviewsPostsPage() {
  const [activeTab, setActiveTab] = useState<'REVIEWS' | 'QR_NFC' | 'POSTS'>('REVIEWS');
  
  // Tab 1 state
  const [autopilotReply, setAutopilotReply] = useState(true);
  const [filterRating, setFilterRating] = useState<'ALL' | 'UNREPLIED' | 'CRITICAL'>('ALL');
  const [repliedId, setRepliedId] = useState<string | null>(null);

  // Tab 2 QR NFC state
  const [activeProfile, setActiveProfile] = useState<{name: string} | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gbpilot_active_profile');
      if (stored) {
        try {
          setActiveProfile(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const businessName = activeProfile?.name || 'Your Local Business';

  // Tab 2 QR NFC state
  const [posterTitle, setPosterTitle] = useState('Love our Service?');
  const [posterSubtitle, setPosterSubtitle] = useState('Scan to leave a 5-star Google review & get 10% off your next visit!');

  // Tab 3 Posts state
  const [postDraftText, setPostDraftText] = useState(`Enjoy fresh products baked every morning at 6 AM on Broadway NYC! Stop by ${businessName} today.`);
  const [isPostPublished, setIsPostPublished] = useState(false);

  const reviews = [
    {
      id: 'rev-1',
      customer: 'David Miller',
      rating: 5,
      date: '2 hours ago',
      text: 'The artisan sourdough is incredible! Best coffee spot in Sector 4.',
      aiSuggestedReply: 'Thank you David! We take pride in serving Sector 4 with organic sourdough and specialty coffee on Broadway.',
      status: 'UNREPLIED',
      lsi: ['artisan sourdough', 'sector 4 coffee', 'broadway bakery']
    },
    {
      id: 'rev-2',
      customer: 'Sophia Chen',
      rating: 5,
      date: 'Yesterday',
      text: 'Loved the cozy atmosphere and fast WiFi. Great place to work with a cappuccino.',
      aiSuggestedReply: 'Thank you Sophia! Glad you enjoyed our cappuccino and WiFi on Broadway NYC. See you again!',
      status: 'REPLIED',
      lsi: ['broadway nyc', 'cappuccino cafe']
    },
    {
      id: 'rev-3',
      customer: 'Alex Rivera',
      rating: 2,
      date: '3 days ago',
      text: 'Waited 15 minutes for my iced latte during peak morning rush.',
      aiSuggestedReply: `Hi Alex, we apologize for the wait during morning peak hours. We are adding an extra barista station to ensure faster service on Broadway. Please contact manager@${businessName.replace(/\s+/g, '').toLowerCase()}.com so we can make it right!`,
      status: 'UNREPLIED',
      lsi: ['morning peak hours', 'local business']
    }
  ];

  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Header & Tabs */}
        <div className="material-card p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-google-text-primary flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-google-blue" />
              Reviews & Content Studio
            </h1>
            <p className="text-xs text-google-text-secondary mt-1">
              FTC-compliant review auto-responder, viral QR/NFC constructors, & Google Posts scheduler.
            </p>
          </div>

          <div className="flex bg-google-bg p-1 rounded-xl border border-google-border">
            <button
              onClick={() => setActiveTab('REVIEWS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'REVIEWS'
                  ? 'bg-white text-google-blue shadow-sm border border-google-border-light'
                  : 'text-google-text-secondary'
              }`}
            >
              💬 Review Inbox & FTC Speedometer
            </button>
            <button
              onClick={() => setActiveTab('QR_NFC')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'QR_NFC'
                  ? 'bg-white text-google-blue shadow-sm border border-google-border-light'
                  : 'text-google-text-secondary'
              }`}
            >
              🎨 QR & NFC Poster Constructor
            </button>
            <button
              onClick={() => setActiveTab('POSTS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'POSTS'
                  ? 'bg-white text-google-blue shadow-sm border border-google-border-light'
                  : 'text-google-text-secondary'
              }`}
            >
              📅 Google Posts Content Planner
            </button>
          </div>
        </div>

        {/* TAB 1: REVIEWS INBOX & FTC SPEEDOMETER */}
        {activeTab === 'REVIEWS' && (
          <div className="space-y-6">
            
            {/* FTC Speedometer & Autopilot Toggle Banner */}
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="material-card p-5 bg-white space-y-2 border-l-4 border-l-google-green">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-google-text-primary">FTC Review Speedometer</span>
                  <span className="text-[10px] bg-google-green-light text-google-green px-2 py-0.5 rounded font-bold">SAFE PACING</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-google-green">5 / 8</span>
                  <span className="text-xs text-google-text-secondary">Requests sent this week</span>
                </div>
                <p className="text-[11px] text-google-text-tertiary leading-tight">
                  Prevents algorithmic penalty & ensures natural velocity compliance.
                </p>
              </div>

              <div className="material-card p-5 bg-white space-y-2 border-l-4 border-l-google-blue">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-google-text-primary">Autopilot Auto-Reply</span>
                  <button 
                    onClick={() => setAutopilotReply(!autopilotReply)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      autopilotReply ? 'bg-google-green justify-end' : 'bg-google-border justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
                <span className="text-xs font-bold text-google-blue block">
                  {autopilotReply ? 'AUTOPILOT ACTIVE (AI Replies to 4-5 Stars)' : 'MANUAL APPROVAL MODE'}
                </span>
                <p className="text-[11px] text-google-text-tertiary leading-tight">
                  Auto-injects GEO LSI keywords into customer response threads.
                </p>
              </div>

              <div className="material-card p-5 bg-white space-y-2">
                <span className="text-xs font-bold text-google-text-secondary">Average Review Score</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-google-text-primary">4.9 / 5.0</span>
                  <div className="flex text-google-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-google-yellow" />
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-google-text-secondary">148 Total Google Reviews</span>
              </div>

            </div>

            {/* Filter Bar */}
            <div className="material-card p-4 bg-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-google-text-secondary">Filter Reviews:</span>
                <div className="flex gap-1.5">
                  {(['ALL', 'UNREPLIED', 'CRITICAL'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFilterRating(mode)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        filterRating === mode ? 'bg-google-blue text-white' : 'bg-google-bg text-google-text-secondary border border-google-border'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="material-card p-5 bg-white space-y-3 border-l-4 border-l-google-blue">
                  
                  <div className="flex items-center justify-between border-b border-google-border-light pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-google-bg border border-google-border flex items-center justify-center font-bold text-google-text-primary text-xs">
                        {rev.customer[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-google-text-primary">{rev.customer}</h4>
                        <span className="text-[10px] text-google-text-tertiary">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-google-yellow">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-google-yellow" />
                        ))}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rev.status === 'REPLIED' ? 'bg-google-green-light text-google-green' : 'bg-google-yellow-light text-amber-700'
                      }`}>
                        {rev.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-google-text-primary italic">"{rev.text}"</p>

                  {/* AI Suggested Response Box */}
                  <div className="p-3 bg-google-bg rounded-xl border border-google-border space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-google-blue flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5" /> AI GEO-Injected Response Suggestion
                      </span>
                      <div className="flex gap-1">
                        <span className="text-[10px] bg-white text-google-text-secondary border border-google-border px-2 py-0.5 rounded font-normal">Friendly</span>
                        <span className="text-[10px] bg-google-blue-light text-google-blue px-2 py-0.5 rounded font-bold">Professional</span>
                      </div>
                    </div>

                    <p className="text-google-text-primary bg-white p-2.5 rounded border border-google-border-light text-xs">
                      {rev.aiSuggestedReply}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex gap-1">
                        {rev.lsi.map((lsi, i) => (
                          <span key={i} className="text-[10px] text-google-blue bg-google-blue-light px-2 py-0.5 rounded font-mono">
                            #{lsi}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setRepliedId(rev.id)}
                        disabled={repliedId === rev.id || rev.status === 'REPLIED'}
                        className="material-button-primary text-xs py-1.5 px-3"
                      >
                        {repliedId === rev.id || rev.status === 'REPLIED' ? (
                          <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-white" /> Replied</span>
                        ) : (
                          <span>Send Response</span>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: QR & NFC POSTER CONSTRUCTOR */}
        {activeTab === 'QR_NFC' && (
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Design Controls */}
            <div className="material-card p-6 bg-white space-y-4">
              <h3 className="font-bold text-google-text-primary text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-google-blue" />
                Table Tent & Sticker Customizer
              </h3>

              <div>
                <label className="block text-xs font-semibold text-google-text-secondary mb-1">Headline Text</label>
                <input 
                  type="text" 
                  value={posterTitle} 
                  onChange={(e) => setPosterTitle(e.target.value)} 
                  className="material-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-google-text-secondary mb-1">Incentive / Subtitle</label>
                <textarea 
                  rows={2} 
                  value={posterSubtitle} 
                  onChange={(e) => setPosterSubtitle(e.target.value)} 
                  className="material-input text-xs"
                />
              </div>

              <div className="pt-4 space-y-2 border-t border-google-border-light">
                <button 
                  onClick={() => alert("Downloading High-Res Print PDF with vector QR Code...")}
                  className="material-button-primary w-full text-xs"
                >
                  <Download className="w-4 h-4" /> Export High-Res PDF for Print
                </button>
                <button 
                  onClick={() => alert("Ordering Pre-programmed NFC Touch Stands ($25)...")}
                  className="material-button-secondary w-full text-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-google-blue" /> Order NFC Touch Stand ($25)
                </button>
              </div>
            </div>

            {/* Live Canvas Preview */}
            <div className="material-card p-8 bg-gradient-to-b from-google-blue-light/50 to-white flex flex-col items-center justify-center text-center border-2 border-google-blue/30 shadow-material-2 min-h-[380px]">
              
              <div className="w-12 h-12 rounded-full bg-google-blue text-white flex items-center justify-center font-black text-lg mb-3 shadow">
                M
              </div>
              <h3 className="text-lg font-black text-google-text-primary max-w-xs">{posterTitle}</h3>
              <p className="text-xs text-google-text-secondary mt-1 max-w-xs leading-relaxed">{posterSubtitle}</p>

              {/* Simulated QR Code Graphic */}
              <div className="my-6 p-4 bg-white rounded-2xl shadow-material-1 border border-google-border">
                <div className="w-32 h-32 bg-google-text-primary rounded-xl flex items-center justify-center text-white font-mono text-[10px]">
                  [ QR CODE ]
                </div>
              </div>

              {/* Mandatory Discrete Watermark */}
              <span className="text-[10px] text-google-text-tertiary font-semibold tracking-wider uppercase">
                ⚡ Smart Reviews Powered by GBPilot
              </span>

            </div>

          </div>
        )}

        {/* TAB 3: GOOGLE POSTS CONTENT PLANNER */}
        {activeTab === 'POSTS' && (
          <div className="space-y-6">
            
            {/* Post Composer Panel */}
            <div className="material-card p-6 bg-white space-y-4 border-2 border-google-blue/20">
              <h3 className="font-bold text-google-text-primary text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-google-blue" />
                AI Google Post Composer (GEO LSI Enhanced)
              </h3>

              <textarea 
                rows={3} 
                value={postDraftText}
                onChange={(e) => setPostDraftText(e.target.value)}
                className="material-input text-xs"
              />

              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-google-blue-light text-google-blue font-mono text-[10px] rounded">+Geotag Metadata</span>
                  <span className="px-2 py-1 bg-google-green-light text-google-green font-mono text-[10px] rounded">+SEO LSI Tags</span>
                </div>

                <button 
                  onClick={() => setIsPostPublished(true)}
                  disabled={isPostPublished}
                  className="material-button-primary text-xs"
                >
                  {isPostPublished ? (
                    <span className="flex items-center gap-1"><Check className="w-4 h-4 text-white" /> Post Scheduled on Google!</span>
                  ) : (
                    <span>Publish Post Now</span>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
