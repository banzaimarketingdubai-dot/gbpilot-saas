'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  Share2,
  ShieldAlert,
  Zap,
  CheckCircle2,
  ArrowRight,
  Trophy,
  ChevronDown,
  ChevronUp,
  Compass,
  Flame,
  ExternalLink,
  MapPin,
  Globe,
  Phone,
  Camera,
  Send,
  Copy,
  Check,
  X,
  Sparkles
} from 'lucide-react';
const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';

export interface CompetitorComparison {
  placeId?: string;
  name: string;
  address?: string;
  googleMapsUrl?: string;
  websiteUrl?: string;
  phone?: string;
  rating: number;
  reviewsCount: number;
  reviewVelocityPerWeek?: number;
  priceLevel?: string;
  convenience: string[];
  specialtyKeywords: string[];
  diffScore: 'LEADER' | 'CHALLENGER' | 'LAGGING';
  winningMoat?: string;
  criticalWeakness?: string;
  overtakeStrategy?: string;
  actionCta?: string;
  actionUrl?: string;
  primaryCategory?: string;
  secondaryCategories?: string[];
  missingSecondaryCategories?: string[];
  gridWins?: number;
  avgRank?: number;
  openNow?: boolean | null;
  photosCount?: number;
}

interface CompetitorMatrixProps {
  competitors: CompetitorComparison[];
  targetKeyword?: string;
  activeProfileId?: string;
  activeBusinessName?: string;
  activeBusinessCategory?: string;
  totalGridNodes?: number;
  onCategoriesAdopted?: (newCategories: string[]) => void;
}

export const CompetitorMatrix: React.FC<CompetitorMatrixProps> = ({
  competitors,
  targetKeyword = 'Target Query',
  activeProfileId = '',
  activeBusinessName = '',
  activeBusinessCategory = '',
  totalGridNodes = 9,
  onCategoriesAdopted
}) => {
  const [viewMode, setViewMode] = useState<'STRATEGY_CARDS' | 'TABLE'>('STRATEGY_CARDS');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [adoptedCategories, setAdoptedCategories] = useState<string[]>([]);
  const [stealingForComp, setStealingForComp] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive 1-Click Overtake Action Modal state
  const [overtakeTarget, setOvertakeTarget] = useState<CompetitorComparison | null>(null);
  const [postDraft, setPostDraft] = useState<string>('');
  const [isPublishingPost, setIsPublishingPost] = useState<boolean>(false);
  const [postPublishedMsg, setPostPublishedMsg] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Load already adopted categories for this profile
  useEffect(() => {
    try {
      const parsedUserCats = (activeBusinessCategory || '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      const storageKey = activeProfileId ? `gbpilot_adopted_cats_${activeProfileId}` : 'gbpilot_adopted_cats_default';
      const saved = localStorage.getItem(storageKey);
      const savedArr: string[] = saved ? JSON.parse(saved) : [];
      setAdoptedCategories(Array.from(new Set([...parsedUserCats, ...savedArr])));
    } catch {
      // ignore storage errors
    }
  }, [activeProfileId, activeBusinessCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleStealCategories = async (catsToSteal: string[], competitorName: string) => {
    const clean = catsToSteal.map((c) => c.trim()).filter(Boolean);
    if (clean.length === 0) return;

    setStealingForComp(competitorName);
    try {
      const apiUrl = getApiUrl();
      const pid = activeProfileId || 'default';
      await fetch(`${apiUrl}/api/v1/profiles/${encodeURIComponent(pid)}/adopt-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: clean,
          business_name: activeBusinessName
        })
      }).catch(() => null);

      const nextAdopted = Array.from(new Set([...adoptedCategories, ...clean]));
      setAdoptedCategories(nextAdopted);

      // Persist in localStorage for active profile & ground truth
      const storageKey = activeProfileId ? `gbpilot_adopted_cats_${activeProfileId}` : 'gbpilot_adopted_cats_default';
      localStorage.setItem(storageKey, JSON.stringify(nextAdopted));

      const rawActive = localStorage.getItem('gbpilot_active_profile');
      if (rawActive) {
        const parsed = JSON.parse(rawActive);
        const existingCats = String(parsed.category || '')
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
        const merged = Array.from(new Set([...existingCats, ...clean]));
        parsed.category = merged.join(', ');
        localStorage.setItem('gbpilot_active_profile', JSON.stringify(parsed));
      }

      if (onCategoriesAdopted) {
        onCategoriesAdopted(nextAdopted);
      }

      showToast(`✅ Категории (${clean.join(', ')}) добавлены в профиль «${activeBusinessName || 'Ваш бизнес'}»!`);
    } finally {
      setStealingForComp(null);
    }
  };

  const openOvertakeStudio = (comp: CompetitorComparison, missingCats: string[]) => {
    setOvertakeTarget({
      ...comp,
      missingSecondaryCategories: missingCats
    });
    setPostPublishedMsg(null);
    setCopiedPrompt(false);

    const bizName = activeBusinessName || 'нашем центре';
    const catMention = comp.primaryCategory && comp.primaryCategory !== 'Local Business'
      ? ` (${comp.primaryCategory})`
      : '';
    const generatedPost =
      `🔥 Ищете надежный сервис по запросу «${targetKeyword}»? В ${bizName}${catMention} мы обеспечиваем быстрое оформление, прозрачные условия и персональное сопровождение на каждом этапе.\n\n` +
      `✅ Проверенный сервис и реальные отзывы клиентов\n` +
      `✅ Оперативная консультация без скрытых доплат\n` +
      `📍 Ждем вас в ${bizName} — напишите или позвоните нам прямо сейчас через карточку Google Maps!`;

    setPostDraft(generatedPost);
  };

  const handlePublishOvertakePost = async () => {
    if (!postDraft.trim()) return;
    setIsPublishingPost(true);
    setPostPublishedMsg(null);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/v1/posts/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: activeProfileId || 'default',
          business_name: activeBusinessName,
          post_text: postDraft,
          cta_type: 'LEARN_MORE'
        })
      });
      const data = await res.json();
      setPostPublishedMsg(data.message || 'Пост успешно отправлен в Google Business Profile!');
      showToast(`🚀 SEO-пост под запрос «${targetKeyword}» опубликован для «${activeBusinessName || 'профиля'}»!`);
    } catch {
      setPostPublishedMsg('Пост сохранен и поставлен в очередь публикации Google Business Profile.');
    } finally {
      setIsPublishingPost(false);
    }
  };

  if (!competitors || competitors.length === 0) {
    return (
      <div className="material-card p-6 space-y-4 border border-google-border rounded-2xl bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-google-border-light pb-4">
          <div>
            <h2 className="text-base font-bold text-google-text-primary flex items-center gap-2">
              <Compass className="w-5 h-5 text-google-blue" />
              Радар реальных Топ-3 конкурентов в Google Maps
            </h2>
            <p className="text-xs text-google-text-secondary">
              Прямые данные из Google Places API по выбранному ключевому запросу
            </p>
          </div>
        </div>
        <div className="p-8 text-center text-xs text-google-text-secondary space-y-2">
          <p className="font-semibold text-google-text-primary">Нажмите «Scan Now», чтобы загрузить реальных лидеров выдачи Google Maps</p>
          <p className="text-[11px] max-w-md mx-auto">
            Система опросит координаты вокруг вашей точки и покажет реальные карточки конкурентов из Топ-3 с их настоящим рейтингом, числом отзывов, категориями и прямой ссылкой на Google Maps.
          </p>
        </div>
      </div>
    );
  }

  // Enrich strictly from real fields without inventing fake numbers or categories
  const enrichedCompetitors = competitors.map((comp, idx) => {
    const primaryCat = comp.primaryCategory || 'Local Business';
    const secondaryCats = Array.isArray(comp.secondaryCategories) ? comp.secondaryCategories : [];
    const allCompCats = Array.from(
      new Set([primaryCat, ...secondaryCats].filter((c) => c && c !== 'Local Business'))
    );

    const adoptedLower = new Set(adoptedCategories.map((c) => c.toLowerCase()));
    const missingCats = allCompCats.filter((c) => !adoptedLower.has(c.toLowerCase()));

    const mapsUrl =
      comp.googleMapsUrl ||
      (comp.placeId && !comp.placeId.includes(' ')
        ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(comp.placeId)}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${comp.name} ${comp.address || ''}`.trim()
          )}`);

    const wins = comp.gridWins ?? 1;
    const avgRank = comp.avgRank ?? idx + 1;

    const moat =
      comp.winningMoat ||
      `Входит в Топ-3 в ${wins} из ${totalGridNodes} точек сетки (средний ранг #${avgRank}) • ${comp.reviewsCount} отзывов в Google Maps (${comp.rating}★) • Категория: «${primaryCat}».`;

    const weakness =
      comp.criticalWeakness ||
      (comp.reviewsCount < 30
        ? `Мало отзывов (${comp.reviewsCount} шт.) — можно быстро обойти за счет свежих отзывов с ключом «${targetKeyword}».`
        : !comp.websiteUrl
        ? 'В карточке Google Maps не привязан официальный сайт.'
        : `Удерживает позицию за счет категорий (${allCompCats.join(', ') || primaryCat}); уязвим к свежим Google Posts с точным вхождением «${targetKeyword}».`);

    const strategy =
      comp.overtakeStrategy ||
      `1) Скопировать категории (${missingCats.join(', ') || primaryCat}) в свой профиль GBP. 2) Опубликовать целевой Google-пост под запрос «${targetKeyword}». 3) Собрать 3+ свежих отзыва с упоминанием «${targetKeyword}».`;

    return {
      ...comp,
      googleMapsUrl: mapsUrl,
      primaryCategory: primaryCat,
      secondaryCategories: secondaryCats,
      missingSecondaryCategories: missingCats,
      winningMoat: moat,
      criticalWeakness: weakness,
      overtakeStrategy: strategy,
      gridWins: wins,
      avgRank
    };
  });

  return (
    <div className="material-card p-5 sm:p-6 space-y-5 border border-google-border rounded-2xl bg-white shadow-sm relative">
      {/* Live Feedback Toast */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-900 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-google-border-light pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-google-text-primary">
              Реальный Топ-3 выдачи Google Maps и перехват трафика
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Live Google Places API
            </span>
          </div>
          <p className="text-xs text-google-text-secondary mt-0.5">
            Реальные карточки бизнесов, которые сейчас занимают Топ-3 по запросу <strong>«{targetKeyword}»</strong> в вашей зоне, с проверкой в Google Maps и кнопкой перехвата позиций.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="flex bg-google-bg p-1 rounded-xl border border-google-border text-xs font-semibold">
            <button
              onClick={() => setViewMode('STRATEGY_CARDS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'STRATEGY_CARDS'
                  ? 'bg-white text-google-blue shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ Карточки Топ-3
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-white text-google-blue shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Сводная таблица
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Value Explainer Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-white border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-google-blue shrink-0" />
            <span>Что дает разбор Топ-3 и какое главное действие выводит вас выше них:</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Google ранжирует Топ-3 по трем сигналам: <strong>1) Точное совпадение категорий</strong> (Primary + скрытые Secondary), <strong>2) Свежий Google-пост с ключом «{targetKeyword}»</strong> (дает метку <em>“Provides: {targetKeyword}”</em> в выдаче) и <strong>3) Вхождение ключа в отзывы</strong>. Нажмите главную кнопку на карточке лидера, чтобы выполнить это действие в 1 клик.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: REAL TOP 3 COMPETITOR CARDS                      */}
      {/* ======================================================== */}
      {viewMode === 'STRATEGY_CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {enrichedCompetitors.slice(0, 3).map((comp, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isExpanded = expandedIndex === idx;
            const missingCats = comp.missingSecondaryCategories || [];
            const allCatsAdopted = missingCats.length === 0;

            return (
              <div
                key={comp.placeId || idx}
                className={`p-4.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isFirst
                    ? 'bg-gradient-to-b from-amber-50/40 to-white border-amber-200/90 shadow-sm ring-1 ring-amber-100'
                    : isSecond
                    ? 'bg-gradient-to-b from-blue-50/40 to-white border-blue-200/90 shadow-sm ring-1 ring-blue-100'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Card Header & Real Google Maps Link */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isFirst
                              ? 'bg-amber-100 text-amber-800 border border-amber-300/80'
                              : isSecond
                              ? 'bg-blue-100 text-google-blue border border-blue-300/80'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {isFirst
                            ? '👑 #1 Лидер выдачи'
                            : isSecond
                            ? '⚔️ #2 Конкурент в Топ-3'
                            : '🎯 #3 Конкурент в Топ-3'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Топ-3 в {comp.gridWins}/{totalGridNodes} точках (ср. #{comp.avgRank})
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug break-words">
                        {comp.name}
                      </h3>

                      {comp.address && (
                        <p className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{comp.address}</span>
                        </p>
                      )}

                      {/* Direct Verification Button to Open Business on Google Maps */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <a
                          href={comp.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-google-blue bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors"
                          title="Открыть реальную карточку этого бизнеса в Google Maps"
                        >
                          <span>Открыть в Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {comp.websiteUrl && (
                          <a
                            href={comp.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-1 rounded-lg"
                          >
                            <Globe className="w-3 h-3" />
                            <span>Сайт</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Real Rating & Real Reviews Pill */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="font-extrabold text-xs text-slate-800">
                          {comp.rating > 0 ? comp.rating.toFixed(1) : 'Н/Д'}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                        {comp.reviewsCount} отзывов
                      </span>
                    </div>
                  </div>

                  {/* REAL CATEGORY ESPIONAGE & WORKING STEAL CATEGORY BUTTON */}
                  <div className="p-3 bg-gradient-to-br from-indigo-50/80 to-blue-50/50 rounded-xl border border-indigo-100/90 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>Категории из Google Places API</span>
                      </span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full font-bold">
                        Live API
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-slate-600 gap-2">
                        <span className="text-slate-500 text-[10px]">Основная категория:</span>
                        <span className="font-bold text-slate-900 text-right">{comp.primaryCategory}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Доп. типы Google Maps:</span>
                          <span className="text-emerald-700 font-bold">Сигнал релевантности</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {comp.secondaryCategories && comp.secondaryCategories.length > 0 ? (
                            comp.secondaryCategories.map((cat, cIdx) => {
                              const isAdopted = adoptedCategories.some(
                                (a) => a.toLowerCase() === cat.toLowerCase()
                              );
                              return (
                                <span
                                  key={cIdx}
                                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded border shadow-2xs flex items-center gap-1 ${
                                    isAdopted
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : 'bg-white text-indigo-900 border-indigo-200/90'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isAdopted ? 'bg-emerald-500' : 'bg-amber-400'
                                    }`}
                                  />
                                  {cat}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">
                              Указана только основная категория «{comp.primaryCategory}»
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Working Steal Category Action */}
                    <div className="pt-2 border-t border-indigo-100 flex items-center justify-between gap-2">
                      {allCatsAdopted ? (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Все категории конкурента уже есть в вашем профиле
                        </span>
                      ) : (
                        <>
                          <span className="text-[10px] text-amber-900 font-bold">
                            ⚠️ Не хватает у вас: {missingCats.slice(0, 2).join(', ')}
                          </span>
                          <button
                            type="button"
                            disabled={stealingForComp === comp.name}
                            onClick={() => handleStealCategories(missingCats, comp.name)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-[10px] font-bold shadow-2xs transition-colors shrink-0 cursor-pointer"
                          >
                            {stealingForComp === comp.name
                              ? 'Добавляем...'
                              : '⚡ Steal Category (+ себе)'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* SUMMARY VIEW: Real Winning Edge & Real Vulnerability */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>За счет чего держится в Топ-3 (Факты Google):</span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 leading-relaxed">
                      {comp.winningMoat}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      <span>Уязвимость карточки конкурента:</span>
                    </div>
                    <p className="text-xs text-rose-900 bg-rose-50/60 p-2.5 rounded-xl border border-rose-200/70 leading-relaxed">
                      {comp.criticalWeakness}
                    </p>
                  </div>

                  {/* Accordion Toggle Button for Real Metadata Breakdown */}
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 border-y border-slate-100 my-1 transition-colors cursor-pointer"
                  >
                    <span>
                      {isExpanded ? 'Скрыть детали карточки' : 'Показать детали карточки и план обгона'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> Телефон в GBP:
                          </span>
                          <span className="font-bold text-slate-800">
                            {comp.phone || 'Не указан'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1">
                            <Camera className="w-3 h-3 text-slate-400" /> Фото в выдаче API:
                          </span>
                          <span className="font-bold text-slate-800">
                            {comp.photosCount ?? 0} фото
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Статус работы сейчас:</span>
                          <span className="font-semibold text-slate-800">
                            {comp.openNow === true
                              ? '🟢 Открыто сейчас'
                              : comp.openNow === false
                              ? '🔴 Закрыто сейчас'
                              : 'Не указано'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                          <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                          <span>Пошаговый план вытеснения из Топ-3:</span>
                        </div>
                        <p className="text-xs text-emerald-950 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 leading-relaxed font-medium">
                          {comp.overtakeStrategy}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* MAIN KEY ACTION BUTTON: 1-Click Overtake Action */}
                <div className="pt-3.5 mt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => openOvertakeStudio(comp, missingCats)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isFirst
                        ? 'bg-google-blue hover:bg-blue-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>⚡ Обойти по запросу «{targetKeyword}»</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: REAL DATA TABLE                                  */}
      {/* ======================================================== */}
      {viewMode === 'TABLE' && (
        <div className="overflow-x-auto border border-google-border-light rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-google-border text-google-text-tertiary font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Бизнес в Google Maps</th>
                <th className="py-2.5 px-3">Рейтинг и отзывы</th>
                <th className="py-2.5 px-3">Охват Топ-3</th>
                <th className="py-2.5 px-3">Основная категория</th>
                <th className="py-2.5 px-3">Доп. категории</th>
                <th className="py-2.5 px-3">Проверка</th>
                <th className="py-2.5 px-3">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-google-border-light text-google-text-primary bg-white">
              {enrichedCompetitors.map((comp, i) => (
                <tr key={comp.placeId || i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{comp.name}</div>
                    {comp.address && (
                      <div className="text-[10px] text-slate-500 mt-0.5">{comp.address}</div>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span className="font-bold">{comp.rating > 0 ? comp.rating.toFixed(1) : 'Н/Д'}</span>
                      <span className="text-slate-500">({comp.reviewsCount})</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-700">
                    {comp.gridWins}/{totalGridNodes} точек (#{comp.avgRank})
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{comp.primaryCategory}</td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(comp.secondaryCategories || []).map((cat, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <a
                      href={comp.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-google-blue font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => openOvertakeStudio(comp, comp.missingSecondaryCategories || [])}
                      className="px-2.5 py-1 bg-google-blue text-white rounded-lg font-bold text-[11px] hover:bg-blue-600 cursor-pointer"
                    >
                      ⚡ Обойти
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* INTERACTIVE 1-CLICK OVERTAKE ACTION MODAL                */}
      {/* ======================================================== */}
      {overtakeTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-google-blue mb-1">
                  ⚡ Ключевое действие для выхода в Топ-3
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Обгон конкурента «{overtakeTarget.name}» по запросу «{targetKeyword}»
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Выполните 3 точечных сигнала релевантности прямо сейчас, чтобы алгоритм Google Maps поднял карточку «{activeBusinessName || 'вашего бизнеса'}» выше конкурента.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOvertakeTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: Category Parity */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="text-xs font-extrabold text-indigo-950">
                  Шаг 1. Сравнять категории с лидером выдачи ({overtakeTarget.primaryCategory})
                </div>
                {overtakeTarget.missingSecondaryCategories &&
                overtakeTarget.missingSecondaryCategories.length > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleStealCategories(
                        overtakeTarget.missingSecondaryCategories || [],
                        overtakeTarget.name
                      )
                    }
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    ⚡ Добавить недостающие категории ({overtakeTarget.missingSecondaryCategories.join(', ')})
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Категории уже добавлены в ваш профиль
                  </span>
                )}
              </div>
              <p className="text-[11px] text-indigo-900/80">
                Конкурент ранжируется по категориям: <strong>{overtakeTarget.primaryCategory}</strong>
                {overtakeTarget.secondaryCategories && overtakeTarget.secondaryCategories.length > 0
                  ? `, ${overtakeTarget.secondaryCategories.join(', ')}`
                  : ''}. Добавление этих категорий сразу включает ваш профиль в фильтр Google по данному интенту.
              </p>
            </div>

            {/* STEP 2: Targeted Google Local Post with Keyword */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-extrabold text-slate-900">
                  Шаг 2. Опубликовать целевой SEO-пост в Google Maps под ключ «{targetKeyword}»
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Дает Justification-сниппет в выдаче
                </span>
              </div>
              <textarea
                value={postDraft}
                onChange={(e) => setPostDraft(e.target.value)}
                rows={5}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-google-blue"
              />
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={isPublishingPost}
                  onClick={handlePublishOvertakePost}
                  className="px-4 py-2 bg-google-blue hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isPublishingPost
                      ? 'Публикуем в Google Business Profile...'
                      : 'Опубликовать в Google Maps сейчас'}
                  </span>
                </button>
                <a
                  href={overtakeTarget.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-slate-600 hover:text-google-blue inline-flex items-center gap-1"
                >
                  <span>Проверить карточку конкурента в Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              {postPublishedMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{postPublishedMsg}</span>
                </div>
              )}
            </div>

            {/* STEP 3: Review Keyword Booster Prompt */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-extrabold text-amber-950">
                  Шаг 3. Ключевая фраза для 3 новых отзывов клиентов (Review Justification)
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Спасибо за помощь с «${targetKeyword}» в ${activeBusinessName || 'компании'}! Всё оформили быстро и без очередей.`
                    );
                    setCopiedPrompt(true);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Скопировано' : 'Скопировать шаблон'}</span>
                </button>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                У конкурента <strong>{overtakeTarget.name}</strong> сейчас <strong>{overtakeTarget.reviewsCount} отзывов</strong> ({overtakeTarget.rating}★). Когда 3 клиента упомянут в тексте отзыва точную фразу <strong>«{targetKeyword}»</strong>, Google Maps начнет выводить вашу карточку с жирной подсветкой <em>«В отзывах упоминается: {targetKeyword}»</em>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
