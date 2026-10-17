'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Target, 
  Search, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Film, 
  Copy, 
  Check, 
  AlertTriangle,
  Building2,
  X
} from 'lucide-react';
import Link from 'next/link';

interface ProspectLead {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  category: string;
  isUnverified: boolean;
  missingPhotos: boolean;
  missingWebsite: boolean;
  monthlyLossFormatted: string;
  outreachHook: string;
}

const DEFAULT_PROSPECT_LEADS: ProspectLead[] = [
  {
    id: 'lead_dubai_ac_1',
    name: 'CoolBreeze AC & Maintenance Dubai',
    address: 'Al Barsha 1, Dubai, UAE',
    rating: 3.8,
    reviews: 14,
    category: 'Home Services (HVAC)',
    isUnverified: false,
    missingPhotos: true,
    missingWebsite: false,
    monthlyLossFormatted: 'AED 14,500/mo',
    outreachHook: 'Теряет 42 звонка/мес из-за отсутствия фото-отзывов с EXIF и незаполненного каталога услуг'
  },
  {
    id: 'lead_downtown_dentist_2',
    name: 'Downtown Smile Dental Clinic',
    address: 'Downtown Dubai, Boulevard Plaza Tower 1',
    rating: 4.1,
    reviews: 28,
    category: 'Healthcare & Dentistry',
    isUnverified: false,
    missingPhotos: true,
    missingWebsite: false,
    monthlyLossFormatted: 'AED 22,000/mo',
    outreachHook: '1★ отзыв без ответа и отсутствие фото до/после роняют позицию с #2 на #8'
  },
  {
    id: 'lead_austin_plumbing_3',
    name: 'Apex Plumbing & Leak Detection',
    address: 'Austin, Texas, USA',
    rating: 3.9,
    reviews: 19,
    category: 'Plumbing Services',
    isUnverified: false,
    missingPhotos: true,
    missingWebsite: false,
    monthlyLossFormatted: '$4,800/mo',
    outreachHook: 'Высокая ставка PPC ($95/лид). Конкуренты забирают звонки через 35+ фото-отзывов'
  }
];

export default function OutreachPage() {
  const [searchLocation, setSearchLocation] = useState('');
  const [category, setCategory] = useState('');
  const [showGifModal, setShowGifModal] = useState(false);
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [leads, setLeads] = useState<ProspectLead[]>(DEFAULT_PROSPECT_LEADS);
  const [outreachToast, setOutreachToast] = useState<string | null>(null);

  const handleGenerateTeaser = (leadId: string) => {
    const url = `${window.location.origin}/audit/${leadId}`;
    setGeneratedLink(url);
  };

  const handleCopyPitch = (lead: ProspectLead) => {
    const url = `${window.location.origin}/audit/${lead.id}`;
    const pitch = `Здравствуйте! Заметили, что карточка «${lead.name}» в Google Maps теряет около ${lead.monthlyLossFormatted} в виде бесплатных звонков клиентов из-за 2 критических ошибок профиля (${lead.outreachHook}). Ваши прямые конкуренты забирают эти лиды себе. Мы сформировали для вас бесплатный аудит с расчетом эквивалента рекламы: ${url}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pitch);
      setOutreachToast(`Питч для «${lead.name}» скопирован в буфер! Готов для отправки в WhatsApp / Email.`);
      setTimeout(() => setOutreachToast(null), 4000);
    }
  };

  const handleGenerateRankReplayGif = () => {
    setIsGeneratingGif(true);
    setTimeout(() => {
      setIsGeneratingGif(false);
      setShowGifModal(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Header Bar */}
        <div className="material-card p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-google-text-primary flex items-center gap-2">
              <Target className="w-6 h-6 text-google-blue" />
              Lead Gen & Cold Outreach Funnel
            </h1>
            <p className="text-xs text-google-text-secondary mt-1">
              White-label lead scraper, Rank Replay GIF generator, and instant teaser audit link builder.
            </p>
          </div>

          <button 
            onClick={handleGenerateRankReplayGif}
            className="material-button-primary text-xs py-2.5 px-4 font-bold"
          >
            <Film className="w-4 h-4" />
            <span>Generate Rank Replay GIF (Cold Email)</span>
          </button>
        </div>

        {/* Lead Scraper Filter Controls */}
        <div className="material-card p-4 bg-white flex flex-wrap items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-google-blue" />
            <span className="font-semibold text-google-text-secondary">Location:</span>
            <input 
              type="text" 
              value={searchLocation} 
              onChange={(e) => setSearchLocation(e.target.value)} 
              className="material-input text-xs py-1.5 px-3 w-48"
            />
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-google-text-tertiary" />
            <span className="font-semibold text-google-text-secondary">Industry Category:</span>
            <input 
              type="text" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="material-input text-xs py-1.5 px-3 w-48"
            />
          </div>

          <button className="material-button-primary text-xs py-2 px-4">
            <Search className="w-3.5 h-3.5" />
            <span>Find Local Leads</span>
          </button>

        </div>

        {/* Toast notification */}
        {outreachToast && (
          <div className="fixed top-16 right-4 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs border border-slate-700 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{outreachToast}</span>
            </div>
            <button onClick={() => setOutreachToast(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Lead Finder Table */}
        <div className="material-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-google-border-light pb-3">
            <h3 className="font-bold text-google-text-primary text-sm">Discovered Prospect Leads ({leads.length})</h3>
            <span className="text-xs text-google-text-tertiary">Оценка упущенной выгоды по методике Steve Hunsaker</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-google-border text-google-text-tertiary font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Business Name</th>
                  <th className="py-2.5 px-3">GBP Rating</th>
                  <th className="py-2.5 px-3">Missing Photos</th>
                  <th className="py-2.5 px-3">Упущенная выгода (PPC Equiv)</th>
                  <th className="py-2.5 px-3">Диагностика</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-google-border-light text-google-text-primary">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <div className="font-semibold text-slate-600">No leads discovered yet</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Enter a location and category above and click "Find Local Leads".</p>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-google-bg transition-colors">
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-google-text-primary text-xs block">{lead.name}</span>
                        <span className="text-[10px] text-google-text-tertiary">{lead.address} • {lead.category}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-google-text-primary">
                      {lead.rating} ⭐ ({lead.reviews} reviews)
                    </td>

                    <td className="py-3 px-3">
                      {lead.missingPhotos ? (
                        <span className="text-amber-600 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          ⚠️ Нет фото с EXIF
                        </span>
                      ) : (
                        <span className="text-google-green text-[11px]">Sufficient</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                        -{lead.monthlyLossFormatted}
                      </span>
                    </td>

                    <td className="py-3 px-3 max-w-xs">
                      <span className="text-[11px] text-slate-600 line-clamp-2">
                        {lead.outreachHook}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleCopyPitch(lead)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>📋 Питч</span>
                        </button>
                        <button
                          onClick={() => handleGenerateTeaser(lead.id)}
                          className="material-button-primary text-[11px] py-1 px-2.5"
                        >
                          Аудит
                        </button>
                        <Link
                          href={`/audit/${lead.id}`}
                          target="_blank"
                          className="material-button-ghost text-[11px] py-1 px-2 text-google-blue"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generated Link Banner */}
        {generatedLink && (
          <div className="material-card p-4 bg-google-blue-light border border-google-blue/30 flex items-center justify-between gap-4 animate-in fade-in">
            <div>
              <span className="text-xs font-bold text-google-blue block">Public Teaser Audit URL Generated:</span>
              <span className="text-xs font-mono text-google-text-primary">{generatedLink}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedLink);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="material-button-primary text-xs py-1.5 px-3"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Audit Link'}</span>
            </button>
          </div>
        )}

        {/* RANK REPLAY GIF GENERATOR MODAL */}
        {showGifModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-material-3 border border-google-border">
              
              <div className="flex items-center justify-between border-b border-google-border-light pb-3 mb-4">
                <h3 className="font-bold text-google-text-primary text-sm flex items-center gap-2">
                  <Film className="w-4 h-4 text-google-blue" />
                  Rank Replay Animated GIF Rendered
                </h3>
              </div>

              {/* Simulated GIF Preview Canvas */}
              <div className="p-4 bg-slate-900 rounded-xl text-white text-center space-y-3">
                <span className="text-[10px] text-google-yellow font-bold uppercase tracking-wider">
                  30-DAY RANK DECAY REPLAY (5 SEC GIF)
                </span>
                
                <div className="grid grid-cols-3 gap-2 py-2 max-w-[200px] mx-auto">
                  <div className="h-10 rounded bg-google-green font-bold flex items-center justify-center text-xs animate-pulse">#1</div>
                  <div className="h-10 rounded bg-google-yellow font-bold flex items-center justify-center text-xs animate-pulse">#4</div>
                  <div className="h-10 rounded bg-google-red font-bold flex items-center justify-center text-xs animate-pulse">#9</div>
                </div>

                <p className="text-[11px] text-slate-300">
                  Ready to attach to cold email pitches to demonstrate ranking drops to local business owners.
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button 
                  onClick={() => setShowGifModal(false)}
                  className="material-button-ghost text-xs"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    alert("GIF file downloaded for cold outreach email!");
                    setShowGifModal(false);
                  }}
                  className="material-button-primary text-xs"
                >
                  Download .GIF File
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
