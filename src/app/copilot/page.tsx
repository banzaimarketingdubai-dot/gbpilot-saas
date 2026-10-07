'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Bot, 
  Send, 
  Sparkles, 
  MapPin, 
  Star, 
  Check, 
  Paperclip, 
  Mic, 
  TrendingUp, 
  Zap, 
  Building2, 
  Clock, 
  Share2 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  widget?: 'DRAFT_POST' | 'REPLY_PREVIEW' | 'RANK_SNAPSHOT';
  widgetData?: any;
}

export default function CopilotPage() {
  const [activeProfile, setActiveProfile] = useState<{id?: string, name: string, address: string, city?: string} | null>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  React.useEffect(() => {
    let profileName = 'Manhattan Bakery & Cafe';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gbpilot_active_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setActiveProfile(parsed);
          profileName = parsed.name;
        } catch (e) {
          console.error(e);
        }
      }
    }
    setMessages([
      {
        id: 'msg-1',
        sender: 'assistant',
        timestamp: '10:42 AM',
        text: `Hello! I am your 24/7 AI Local SEO Manager for **${profileName}**. I have continuously monitored your local competitors and spatial Geo-Grid maps today. How can I boost your search visibility?`,
      },
      {
        id: 'msg-2',
        sender: 'user',
        timestamp: '10:43 AM',
        text: "How can I improve my ranking for my primary keyword this week?",
      }
    ]);
  }, []);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [postPublished, setPostPublished] = useState(false);
  const [replySent, setReplySent] = useState(false);

  const promptStarters = [
    "🚀 Analyze my top competitor this week",
    "📈 How can I improve my ranking for 'dog-friendly'?",
    "📊 Prepare a monthly performance report",
    "✍️ Draft a promotional offer post for this Friday"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const response = await fetch(`${baseUrl}/api/v1/copilot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: activeProfile?.id || 'profile_123',
          message: query
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: data.id || `msg-${Date.now() + 1}`,
            sender: 'assistant',
            timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: data.text,
            widget: data.widget as any,
            widgetData: data.widgetData
          }
        ]);
      } else {
        throw new Error('Chat API returned error status');
      }
    } catch (err) {
      console.error("Copilot AI error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: "⚠️ I encountered a network error while connecting to the GenAI engine. Please ensure the backend is running and NEXT_PUBLIC_API_URL is correctly set.",
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 flex gap-6">
        
        {/* Left Sidebar: Prompt Starters & Context */}
        <div className="hidden md:flex flex-col w-72 space-y-4">
          
          {/* Status Panel */}
          <div className="material-card p-4 space-y-3 bg-white">
            <div className="flex items-center gap-2 border-b border-google-border-light pb-2.5">
              <div className="p-1.5 bg-google-blue-light text-google-blue rounded-lg">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-google-text-primary text-xs">AI Copilot Engine</h3>
                <span className="text-[10px] text-google-green font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-google-green animate-pulse" /> Active & Synchronized
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-google-text-secondary">
              <div className="flex justify-between">
                <span>Model Scope:</span>
                <span className="font-bold text-google-text-primary">GPT-4o / Claude 3.5</span>
              </div>
              <div className="flex justify-between">
                <span>Active Business:</span>
                <span className="font-bold text-google-blue">Manhattan Bakery</span>
              </div>
            </div>
          </div>

          {/* Prompt Starters */}
          <div className="material-card p-4 space-y-3 bg-white">
            <h4 className="font-bold text-google-text-primary text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-google-blue" />
              Suggested AI Prompts
            </h4>

            <div className="space-y-2">
              {promptStarters.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(starter.substring(2))}
                  className="w-full text-left p-2.5 rounded-lg text-xs font-medium text-google-text-primary bg-google-bg hover:bg-google-blue-light hover:text-google-blue border border-google-border transition-all duration-150"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Main Chat Workspace */}
        <div className="flex-1 material-card flex flex-col h-[calc(100vh-140px)] bg-white overflow-hidden shadow-material-1">
          
          {/* Header Bar */}
          <div className="px-6 py-3.5 border-b border-google-border-light flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-google-blue text-white flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <h2 className="font-bold text-google-text-primary text-sm flex items-center gap-2">
                  AI Growth Copilot Workspace
                  <span className="text-[10px] bg-google-blue-light text-google-blue px-2 py-0.5 rounded font-bold">
                    GPT-4o Active
                  </span>
                </h2>
                <p className="text-[11px] text-google-text-secondary">Proactive Assistant • Manhattan Bakery & Cafe</p>
              </div>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-google-bg">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  msg.sender === 'user' 
                    ? 'bg-google-text-primary text-white' 
                    : 'bg-google-blue text-white'
                }`}>
                  {msg.sender === 'user' ? 'U' : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-3 ${msg.sender === 'user' ? 'items-end' : ''}`}>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-google-blue text-white rounded-tr-none'
                      : 'bg-white text-google-text-primary border border-google-border rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`text-[10px] block mt-2 ${msg.sender === 'user' ? 'text-blue-100 text-right' : 'text-google-text-tertiary'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* INLINE INTERACTIVE WIDGETS */}

                  {/* Widget 1: Embedded Geo-Grid Snapshot */}
                  {msg.widget === 'RANK_SNAPSHOT' && msg.widgetData && (
                    <div className="material-card p-4 bg-white border border-google-border max-w-md">
                      <div className="flex items-center justify-between border-b border-google-border-light pb-2 mb-3">
                        <span className="font-bold text-xs text-google-text-primary flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-google-blue" />
                          Live Geo-Grid: "{msg.widgetData.keyword}"
                        </span>
                        <span className="text-[11px] font-bold text-google-green bg-google-green-light px-2 py-0.5 rounded">
                          Avg Rank: {msg.widgetData.avgRank}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {msg.widgetData.grid.map((g: any, i: number) => (
                          <div 
                            key={i}
                            className={`h-12 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                              g.rank <= 2 ? 'bg-google-green' : g.rank <= 3 ? 'bg-google-yellow' : 'bg-google-red'
                            }`}
                          >
                            #{g.rank}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Widget 2: Draft Post Card Widget */}
                  {msg.widget === 'DRAFT_POST' && msg.widgetData && (
                    <div className="material-card p-4 bg-white border-2 border-google-blue/30 max-w-lg space-y-3">
                      <div className="flex items-center justify-between border-b border-google-border-light pb-2">
                        <span className="font-bold text-xs text-google-blue flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Draft Google Post Card
                        </span>
                        <span className="text-[10px] bg-google-blue-light text-google-blue font-bold px-2 py-0.5 rounded">
                          Ready to Publish
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-google-text-primary">{msg.widgetData.title}</h4>
                        <p className="text-xs text-google-text-secondary mt-1 bg-google-bg p-2.5 rounded border border-google-border">
                          {msg.widgetData.body}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {msg.widgetData.lsi.map((lsi: string, i: number) => (
                          <span key={i} className="text-[10px] bg-google-bg text-google-text-secondary px-2 py-0.5 rounded border border-google-border font-mono">
                            #{lsi}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => setPostPublished(true)}
                          disabled={postPublished}
                          className="material-button-primary text-xs py-2 px-4"
                        >
                          {postPublished ? (
                            <>
                              <Check className="w-4 h-4 text-white" />
                              <span>Published to Google Maps!</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5 fill-white" />
                              <span>Publish to Google Maps Now</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Widget 3: Review Reply Preview Widget */}
                  {msg.widget === 'REPLY_PREVIEW' && msg.widgetData && (
                    <div className="material-card p-4 bg-white border border-google-border max-w-lg space-y-3">
                      <div className="flex items-center justify-between border-b border-google-border-light pb-2">
                        <div className="flex items-center gap-1 text-google-yellow">
                          {[...Array(msg.widgetData.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-google-yellow text-google-yellow" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-google-text-primary">{msg.widgetData.customer}</span>
                      </div>

                      <p className="text-xs italic text-google-text-secondary bg-google-bg p-2 rounded">
                        "{msg.widgetData.reviewText}"
                      </p>

                      <div className="p-2.5 bg-google-blue-light/50 rounded-lg border border-google-blue/20 text-xs">
                        <span className="font-bold text-google-blue block mb-1">AI GEO-Optimized Draft Reply:</span>
                        <p className="text-google-text-primary">{msg.widgetData.aiResponse}</p>
                      </div>

                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => setReplySent(true)}
                          disabled={replySent}
                          className="material-button-primary text-xs py-2 px-4"
                        >
                          {replySent ? (
                            <>
                              <Check className="w-4 h-4 text-white" />
                              <span>Response Sent to Google!</span>
                            </>
                          ) : (
                            <span>Send Response Now</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-google-text-secondary italic">
                <Bot className="w-4 h-4 text-google-blue animate-spin" />
                <span>AI Copilot is analyzing ranking factors...</span>
              </div>
            )}
          </div>

          {/* Chat Input Dock */}
          <div className="p-4 border-t border-google-border bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask AI Copilot to analyze competitors, draft posts, or audit profile..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="material-input text-xs flex-1 py-3"
              />
              <button
                type="submit"
                className="material-button-primary p-3 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </main>
      <Footer />
    </div>
  );
}
