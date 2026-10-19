'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  Lock, 
  Check, 
  RefreshCw, 
  X, 
  TrendingUp, 
  Share2, 
  Edit3,
  Copy,
  Gift,
  HelpCircle,
  SlidersHorizontal
} from 'lucide-react';
import { HealthGauge } from '@/components/HealthGauge';
import { getSubscription } from '@/lib/subscription';
import { runInspectionAudit, InspectionAuditReport } from '@/lib/inspection/auditEngine';
import { 
  generateSmartSeoDescription, 
  SeoCopyTone, 
  extractGeoAnchors,
  detectBusinessNiche,
  BusinessNiche,
  NICHE_LIST,
  getNicheCatalogItems
} from '@/lib/inspection/seoCopyGenerator';

export interface AuditActionCardItem {
  id: string;
  categoryTitle: string;
  gapTag: 'CRITICAL_FIX' | 'HIGH_IMPACT' | 'CONVERSION_BOOSTER';
  isFree: boolean; // True for starter free issues, false for Pro
  problemText: string;
  beforeValue: string;
  afterAiValue: string;
  impactMetric: string;
  applied: boolean;
  isCustomized?: boolean;
  beforeMeta?: string;
  afterMeta?: string;
  keywordChips?: string[];
}

interface OnboardingInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName?: string;
  businessAddress?: string;
  category?: string;
  city?: string;
  currentDescription?: string;
  currentPhone?: string;
  onComplete?: () => void;
}

function generateDefaultActionCards(
  businessName: string,
  businessAddress: string,
  auditReport: InspectionAuditReport,
  category?: string,
  city?: string,
  seoTone: SeoCopyTone = 'SEO',
  currentDescription?: string,
  currentPhone?: string,
  nicheOverride?: BusinessNiche,
  customOwnerNotes?: string
): AuditActionCardItem[] {
  const name = businessName !== '—' && businessName ? businessName : 'вашего заведения';
  const address = businessAddress !== '—' && businessAddress ? businessAddress : 'в вашем районе';
  const geo = extractGeoAnchors(address, city);
  const activeNiche = nicheOverride || detectBusinessNiche(name, category);

  // Generate genuine, high-quality, niche-aware Local SEO description
  const highQualitySeoBio = generateSmartSeoDescription({
    businessName: name,
    businessAddress: address,
    category,
    city: geo.city,
    tone: seoTone,
    explicitNiche: activeNiche,
    customNotes: customOwnerNotes
  });

  // Calculate real metrics from existing profile
  const hasRealDescription = Boolean(currentDescription && currentDescription.trim().length > 0);
  const existingDescText = hasRealDescription 
    ? currentDescription!.trim() 
    : 'Описание не заполнено в Google Business Profile (0 / 750 знаков). Карточка не ранжируется по целевым запросам района.';
  const existingDescLen = hasRealDescription ? currentDescription!.trim().length : 0;

  const catalogPreview = getNicheCatalogItems(activeNiche, auditReport.currencySymbol);

  return [
    {
      id: 'audit-bio',
      categoryTitle: 'Основная категория и SEO-описание профиля (Profile Bio)',
      gapTag: 'CRITICAL_FIX',
      isFree: true, // 100% FREE STARTER FIX
      problemText: hasRealDescription
        ? `Текущее описание слишком короткое (${existingDescLen} из 750 знаков) и не содержит ключевых поисковых запросов для ${geo.landmarkOrDistrict}. Google Maps отдает приоритет конкурентам с полным описанием.`
        : `Описание карточки в Google Maps отсутствует (0 из 750 знаков). Поисковый алгоритм не может связать заведение «${name}» с запросами гостей поблизости.`,
      beforeValue: existingDescText,
      beforeMeta: `${existingDescLen} / 750 знаков • Упущено ${Math.max(0, 750 - existingDescLen)} знаков`,
      afterAiValue: highQualitySeoBio,
      afterMeta: `${highQualitySeoBio.length} / 750 знаков • Проиндексировано 6 поисковых фраз`,
      keywordChips: [
        `Локация: ${geo.landmarkOrDistrict}`,
        `Удобства и сервисы`,
        `Поисковые LSI-ключи`,
        `Призыв к действию (CTA)`
      ],
      impactMetric: '+4 ключевых поисковых запроса в выдаче',
      applied: false
    },
    {
      id: 'audit-holiday-hours',
      categoryTitle: 'График работы в праздничные дни (Защита от потери клиентов)',
      gapTag: 'HIGH_IMPACT',
      isFree: true, // 100% FREE STARTER FIX
      problemText: 'Не подтверждены часы работы на ближайшие праздничные дни. Google Maps вывешивает тревожное желтое предупреждение «Часы работы могут отличаться», из-за чего до 40% гостей уходят к конкурентам.',
      beforeValue: 'Официальные часы на праздники не подтверждены в Google Maps. На карточке выводится плашка: «Часы работы могут отличаться».',
      beforeMeta: 'Статус: Предупреждение Google активно (риск оттока гостей)',
      afterAiValue: 'Подтвержден официальный график работы заведения (08:00 – 22:00) на все государственные праздники года. Гарантирует непрерывный статус «Открыто» в выдаче Google Maps без предупреждений.',
      afterMeta: 'Статус: 100% подтверждено • Предупреждение снято',
      impactMetric: 'Устраняет ложный флаг «Закрыто»',
      applied: false
    },
    {
      id: 'audit-attributes',
      categoryTitle: 'Атрибуты и удобства для гостей (Фильтры на Картах)',
      gapTag: 'HIGH_IMPACT',
      isFree: false, // PRO TIER
      problemText: 'В карточке не включены популярные теги, по которым пользователи фильтруют заведения на Картах (Wi-Fi, парковка, оплата картой, терраса и др.).',
      beforeValue: 'Включено только 2 базовых атрибута. Профиль исключается из поисковой выдачи, когда пользователь включает фильтры на Картах.',
      beforeMeta: 'Активно: 2 из 10 ключевых атрибутов',
      afterAiValue: '✓ Бесплатный Wi-Fi для гостей  ✓ Оплата картой и QR  ✓ Уютная терраса / Зал  ✓ Дог-френдли  ✓ Парковка для гостей  ✓ Еда навынос  ✓ Доступная среда',
      afterMeta: 'Активировано: 8 новых фильтров ранжирования',
      impactMetric: 'Соответствие 8 фильтрам на Картах',
      applied: false
    },
    {
      id: 'audit-services-menu',
      categoryTitle: 'Каталог меню и услуг (Для Google Поиска и AI Overview)',
      gapTag: 'CONVERSION_BOOSTER',
      isFree: false, // PRO TIER
      problemText: 'Каталог услуг или меню не заполнен. Ни Google Карты, ни умный поиск (Gemini, AI Overview) не могут показать клиентам ваши цены и популярные позиции.',
      beforeValue: '0 структурированных позиций в каталоге Google. Карточка не показывается в расширенной поисковой выдаче товаров и услуг.',
      beforeMeta: '0 позиций • Раздел не заполнен',
      afterAiValue: catalogPreview,
      afterMeta: '10 структурированных позиций с ценами для Google AI',
      impactMetric: 'Прямой выбор и цитирование в AI Overview',
      applied: false
    },
    {
      id: 'audit-exif-photos',
      categoryTitle: 'Геолокационная привязка фото (EXIF GPS координаты)',
      gapTag: 'CRITICAL_FIX',
      isFree: false, // PRO TIER
      problemText: 'Загруженные фотографии не содержат точных GPS-координат точки входа. Алгоритм Google Maps отдает приоритет карточкам с подтвержденным гео-центроидом.',
      beforeValue: '0% загруженных фотографий имеют GPS-привязку к реальным координатам входа в заведение.',
      beforeMeta: 'EXIF метаданные: отсутствуют',
      afterAiValue: `Пакет геопривязки EXIF: внедрение точных географических координат точки входа (${address}) в метаданные фотографий для приоритетного ранжирования в радиусе заведения.`,
      afterMeta: 'Координатный центроид зафиксирован на Картах',
      impactMetric: 'Приоритет в карусели фото Google Maps',
      applied: false
    },
    {
      id: 'audit-sentinel-guard',
      categoryTitle: 'Защита от несанкционированных правок конкурентов (Sentinel Guard)',
      gapTag: 'CRITICAL_FIX',
      isFree: false, // PRO TIER
      problemText: 'Телефон и адрес не защищены от сторонних правок. Любой пользователь или конкурент может предложить «исправление», что ведет к блокировке карточки или подмене номера.',
      beforeValue: currentPhone 
        ? `Номер телефона (${currentPhone}) и адрес открыты для сторонних правок. Нет автоматического отката чужих изменений.`
        : 'Контакты и физический адрес уязвимы для чужих правок конкурентов (риск повторной верификации).',
      beforeMeta: 'Статус: Профиль не защищен от правок',
      afterAiValue: '«Золотой снимок» данных зафиксирован в Sentinel Guard. Круглосуточный авто-откат любых чужих изменений за 180 секунд без риска повторной видео-верификации.',
      afterMeta: 'Статус: 24/7 Shield активен • Авто-откат включен',
      impactMetric: '100% защита от бана и подмены контактов',
      applied: false
    }
  ];
}

export function OnboardingInspectionModal({
  isOpen,
  onClose,
  businessName = '—',
  businessAddress = '—',
  category,
  city,
  currentDescription,
  currentPhone,
  onComplete
}: OnboardingInspectionModalProps) {
  // Flow states: 'SCANNING' | 'REPORT' | 'APPLYING' | 'SUCCESS'
  const [step, setStep] = useState<'SCANNING' | 'REPORT' | 'APPLYING' | 'SUCCESS'>('SCANNING');

  // PLG Tier switch: Pro vs Free Trial
  const [isPro, setIsPro] = useState(false);
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);

  // High-Quality Local SEO Copywriting Tone Switcher
  const [seoTone, setSeoTone] = useState<SeoCopyTone>('SEO');
  const [isRegeneratingBio, setIsRegeneratingBio] = useState(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Human-in-the-Loop Niche & Activity Clarification (Avatar is the domain expert)
  const initialNiche = detectBusinessNiche(businessName, category);
  const [selectedNiche, setSelectedNiche] = useState<BusinessNiche>(initialNiche);
  const [isNichePickerOpen, setIsNichePickerOpen] = useState(false);
  const [customOwnerNotes, setCustomOwnerNotes] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sub = getSubscription();
      setIsPro(sub.isPro);
    }
  }, []);

  const auditReport = React.useMemo(() => {
    return runInspectionAudit({
      title: businessName,
      address: businessAddress
    });
  }, [businessName, businessAddress]);

  // Action Cards Data
  const [actionCards, setActionCards] = useState<AuditActionCardItem[]>(() =>
    generateDefaultActionCards(businessName, businessAddress, auditReport, category, city, 'SEO', currentDescription, currentPhone, selectedNiche, customOwnerNotes)
  );

  useEffect(() => {
    setActionCards(generateDefaultActionCards(businessName, businessAddress, auditReport, category, city, seoTone, currentDescription, currentPhone, selectedNiche, customOwnerNotes));
  }, [businessName, businessAddress, auditReport, category, city, seoTone, currentDescription, currentPhone, selectedNiche, customOwnerNotes]);

  // Scanning progress state
  const [scanProgress, setScanProgress] = useState(15);
  const [scanStageIndex, setScanStageIndex] = useState(0);

  // Applying API simulation state
  const [appliedStepIndex, setAppliedStepIndex] = useState(0);

  // Collaborative Human-in-the-Loop Inline Editing state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const handleStartEdit = (card: AuditActionCardItem) => {
    if (!card.isFree && !isPro) {
      setIsPaywallModalOpen(true);
      return;
    }
    setEditingCardId(card.id);
    setEditingText(card.afterAiValue);
  };

  const handleSaveEdit = (id: string) => {
    setActionCards(prev => prev.map(c => c.id === id ? { ...c, afterAiValue: editingText, isCustomized: true } : c));
    setEditingCardId(null);
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
  };

  const handleQuickChipAppend = (chipText: string) => {
    setEditingText(prev => prev.trim() + ' ' + chipText);
  };

  const handleToneChange = (newTone: SeoCopyTone) => {
    setSeoTone(newTone);
    setIsRegeneratingBio(true);
    setTimeout(() => {
      const newBio = generateSmartSeoDescription({
        businessName,
        businessAddress,
        category,
        city,
        tone: newTone,
        explicitNiche: selectedNiche,
        customNotes: customOwnerNotes
      });
      setActionCards(prev => prev.map(c => c.id === 'audit-bio' ? { ...c, afterAiValue: newBio, isCustomized: false } : c));
      setIsRegeneratingBio(false);
    }, 250);
  };

  const handleSelectNiche = (nicheId: BusinessNiche) => {
    setSelectedNiche(nicheId);
    setIsRegeneratingBio(true);
    const targetNicheInfo = NICHE_LIST.find(n => n.id === nicheId);
    setTimeout(() => {
      setIsRegeneratingBio(false);
      setCopiedToast(`✓ Ниша изменена на «${targetNicheInfo?.label || ''}». Рекомендации обновлены!`);
      setTimeout(() => setCopiedToast(null), 3000);
    }, 300);
  };

  const handleApplyOwnerNotes = () => {
    if (!customOwnerNotes.trim()) return;
    setIsRegeneratingBio(true);
    setTimeout(() => {
      setIsRegeneratingBio(false);
      setCopiedToast('✓ Ваши данные успешно внедрены в SEO-описание карточки!');
      setTimeout(() => setCopiedToast(null), 3000);
    }, 300);
  };

  const handleCopyText = (textToCopy: string, successMessage = 'Текст скопирован в буфер!') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedToast(successMessage);
      setTimeout(() => setCopiedToast(null), 2500);
    }
  };

  const handleApplySingleCard = (id: string) => {
    const card = actionCards.find(c => c.id === id);
    if (!card) return;

    if (!card.isFree && !isPro) {
      setIsPaywallModalOpen(true);
      return;
    }

    setActionCards(prev => prev.map(c => c.id === id ? { ...c, applied: true } : c));
    setCopiedToast('✓ Изменение успешно сохранено!');
    setTimeout(() => setCopiedToast(null), 2000);
  };

  const handleApplyFreeStarterCards = () => {
    setActionCards(prev => prev.map(c => c.isFree ? { ...c, applied: true } : c));
    setCopiedToast('🎉 2 стартовых улучшения успешно применены бесплатно!');
    setTimeout(() => setCopiedToast(null), 3000);
  };

  const handleApplyAll = () => {
    if (!isPro) {
      setIsPaywallModalOpen(true);
      return;
    }
    setStep('APPLYING');
  };

  const handleCompleteAndExit = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_initial_audit_completed', 'true');
      localStorage.setItem('gbpilot_audit_score', '100');
    }
    if (onComplete) onComplete();
    onClose();
  };

  const handleManualGoogleEdit = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_initial_audit_completed', 'true');
    }
    window.open('https://business.google.com', '_blank', 'noopener,noreferrer');
    if (onComplete) onComplete();
    onClose();
  };

  const scanStages = [
    'Анализ категорий, описания профиля и базовых NAP-данных (название, адрес, телефон)...',
    'Проверка каталога услуг, меню и актуальности цен...',
    'Проверка метаданных EXIF фото, графика работы и праздничных дней...',
    'Сравнение факторов ранжирования с топ-3 конкурентами в вашем районе...'
  ];

  const applyingSteps = [
    'Авторизация сессии через официальный Google Business Profile API...',
    'Внесение оптимизированного описания и дополнительных категорий...',
    'Публикация подтвержденного расписания на праздничные дни...',
    'Активация 8 конверсионных атрибутов заведения...',
    'Синхронизация структурированного каталога меню и услуг...',
    'Внедрение координат EXIF и фиксация эталонного «Золотого снимка»...'
  ];

  // Dynamic Scanning Simulator on Mount / Open
  useEffect(() => {
    if (!isOpen) return;

    if (step === 'SCANNING') {
      setScanProgress(15);
      setScanStageIndex(0);

      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('REPORT'), 400);
            return 100;
          }
          const next = prev + Math.floor(Math.random() * 15) + 10;
          if (next >= 75) setScanStageIndex(3);
          else if (next >= 50) setScanStageIndex(2);
          else if (next >= 25) setScanStageIndex(1);
          return Math.min(100, next);
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isOpen, step]);

  // Dynamic Applying Simulator
  useEffect(() => {
    if (step === 'APPLYING') {
      setAppliedStepIndex(0);
      const interval = setInterval(() => {
        setAppliedStepIndex(prev => {
          if (prev >= applyingSteps.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setActionCards(cards => cards.map(c => ({ ...c, applied: true })));
              setStep('SUCCESS');
            }, 600);
            return prev;
          }
          return prev + 1;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

  const freeCards = actionCards.filter(c => c.isFree);
  const freeAppliedCount = freeCards.filter(c => c.applied).length;
  const isAllFreeApplied = freeAppliedCount === freeCards.length;

  const currentNicheInfo = NICHE_LIST.find(n => n.id === selectedNiche) || NICHE_LIST[0];

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `*Экспресс-аудит Google Maps для ${businessName}*\nГотовность профиля: 64% (Требует оптимизации)\nОбнаружено 6 зон роста с потенциалом возврата +${auditReport.revenueRecoveryFormatted}/мес (эквивалент ${auditReport.savedAdSpendFormatted} рекламы Google Ads)\nПодробнее: https://gbpilot.top`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Floating Toast Feedback */}
      {copiedToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2 z-70 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Container Box */}
      <div className="bg-[#F8FAFC] w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* ======================================================== */}
        {/* MODAL TOP BAR                                            */}
        {/* ======================================================== */}
        <div className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-google-blue text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  Экспресс-аудит Google Карточки
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-google-blue border border-blue-200 shrink-0">
                  Первичная диагностика
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Заведение: <strong>{businessName}</strong> {businessAddress !== '—' ? `(${businessAddress})` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Interactive Tier Switcher for Testing Free vs Pro Paywall */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setIsPro(false)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  !isPro ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Тестирование режима Free с бесплатными стартовыми исправлениями"
              >
                Free (Демо-пейволл)
              </button>
              <button
                type="button"
                onClick={() => setIsPro(true)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isPro ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Тестирование режима Pro с автозаполнением в 1 клик"
              >
                Pro (1-клик API)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: DYNAMIC SCANNING SCREEN (PROGRESS BAR & PHASES)  */}
        {/* ======================================================== */}
        {step === 'SCANNING' && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 flex-1 bg-white">
            
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center shadow-inner">
                <Sparkles className="w-10 h-10 text-google-blue animate-spin" />
              </div>
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                AI
              </span>
            </div>

            <div className="space-y-1 max-w-md">
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Глубокая проверка карточки заведения...
              </h4>
              <p className="text-xs text-slate-500">
                Сканируем атрибуты Google Business Profile, видимость в локальном поиске и гео-сигналы для <strong>{businessName}</strong>.
              </p>
            </div>

            {/* Dynamic Linear Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-google-blue">Алгоритм экспресс-аудита</span>
                <span className="text-slate-700 font-mono">{scanProgress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-google-blue to-emerald-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>

            {/* 4 Multi-Stage Verification Steps */}
            <div className="w-full max-w-lg space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              {scanStages.map((stage, idx) => {
                const isPassed = scanStageIndex > idx || scanProgress >= 99;
                const isCurrent = scanStageIndex === idx && scanProgress < 99;

                return (
                  <div key={idx} className="flex items-start gap-2.5">
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-google-blue animate-spin shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-[11px] leading-snug ${
                      isPassed ? 'text-slate-700 font-medium' : isCurrent ? 'text-google-blue font-bold' : 'text-slate-400'
                    }`}>
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Диагностика на основе официальных факторов ранжирования Google Maps API</span>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: AUDIT REPORT SCREEN                              */}
        {/* ======================================================== */}
        {step === 'REPORT' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            
            {/* ==================================================== */}
            {/* ZONE A: PROFILE OPTIMIZATION & BUSINESS DIAGNOSTIC   */}
            {/* ==================================================== */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row items-stretch justify-between gap-6">
              
              {/* Left Column: Health Gauge & Diagnostic Assessment */}
              <div className="flex items-center gap-5 flex-1 min-w-0">
                <div className="shrink-0">
                  <HealthGauge score={64} size={110} />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                      Зона внимания • 6 точек роста
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Первичный аудит
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Готовность карточки: 64% из 100%
                  </h4>
                  <p className="text-xs text-rose-600 font-semibold leading-relaxed">
                    ⚠️ Карточка теряет до 35% клиентов и звонков из-за незаполненных данных, уступая соседним заведениям.
                  </p>
                </div>
              </div>

              {/* Divider for desktop */}
              <div className="hidden lg:block w-px bg-slate-200 self-stretch my-1" />

              {/* Right Column: Business Impact & Revenue Lift (NO confusing 98/100 plate!) */}
              <div className="flex-1 lg:max-w-md p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Потенциал после устранения уязвимостей:</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    Готовность к Топ-3
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-500 block font-medium">Возврат упущенных клиентов</span>
                    <span className="text-base sm:text-lg font-black text-emerald-700 block">
                      +{auditReport.revenueRecoveryFormatted}<span className="text-[11px] font-semibold text-slate-500">/мес</span>
                    </span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-500 block font-medium">Эквивалент платной рекламы</span>
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {auditReport.savedAdSpendFormatted}<span className="text-[11px] font-semibold text-slate-500">/мес</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 font-medium pt-0.5 border-t border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Все 6 исправлений соответствуют официальным требованиям Google Maps API</span>
                </div>
              </div>

            </div>

            {/* ==================================================== */}
            {/* HUMAN-IN-THE-LOOP NICHE & EXPERT CLARIFIER          */}
            {/* Bridges owner business knowledge & Google Maps rules */}
            {/* ==================================================== */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-google-blue flex items-center justify-center font-bold text-base shrink-0 border border-blue-200">
                    {currentNicheInfo.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ниша заведения:</span>
                      <span className="text-xs font-black text-slate-900">{currentNicheInfo.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      ИИ подобрал рекомендации по стандартам Google Maps для этой ниши. Вы можете скорректировать нишу или вписать свои слова.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNichePickerOpen(!isNichePickerOpen)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isNichePickerOpen ? 'Скрыть выбор' : '✏️ Не та ниша? Уточнить'}</span>
                </button>
              </div>

              {/* Collapsible Niche Picker & Plain Words Magic Box */}
              {isNichePickerOpen && (
                <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Выберите точную специализацию (1 клик):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {NICHE_LIST.map((niche) => (
                        <button
                          key={niche.id}
                          type="button"
                          onClick={() => handleSelectNiche(niche.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            selectedNiche === niche.id
                              ? 'bg-google-blue text-white shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span>{niche.icon}</span>
                          <span>{niche.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Owner plain words box */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Или опишите бизнес простыми словами:</span>
                      <span className="text-[10px] font-normal text-slate-400">(ИИ сам упакует ваши факты в правила Google)</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={customOwnerNotes}
                        onChange={(e) => setCustomOwnerNotes(e.target.value)}
                        placeholder="Например: делаем визараны в Камбоджу и сдаем байки, или: пицца на дровах, семейные обеды..."
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-google-blue font-sans"
                      />
                      <button
                        type="button"
                        onClick={handleApplyOwnerNotes}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                      >
                        Применить мои слова
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Gap Summary Alert & Freemium Value Proposition Banner */}
            <div className="bg-gradient-to-r from-amber-50/90 via-emerald-50/50 to-blue-50/60 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-800 shadow-2xs">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Gift className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>2 стартовых улучшения готовы бесплатно</span>
                    <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded font-black text-[10px]">
                      FREE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    ИИ составил качественное SEO-описание и график для устранения предупреждений Google. Еще 4 продвинутых инструмента доступны на тарифе Pro.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>📲 Отчет в WhatsApp</span>
                </a>
              </div>
            </div>

            {/* ==================================================== */}
            {/* ZONE B: AUDIT ACTION CARDS (BEFORE ➔ AFTER COMPARISON) */}
            {/* ==================================================== */}
            <div className="space-y-4">
              {actionCards.map((card, idx) => (
                <div
                  key={card.id}
                  className={`bg-white border rounded-3xl p-5 shadow-xs transition-all space-y-3.5 ${
                    card.applied 
                      ? 'border-emerald-300 bg-emerald-50/10' 
                      : card.isFree 
                      ? 'border-blue-200 ring-1 ring-blue-100' 
                      : 'border-slate-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        card.isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                        {card.categoryTitle}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2">
                      {card.isFree ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Gift className="w-2.5 h-2.5" />
                          <span>Доступно бесплатно</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Тариф Pro</span>
                        </span>
                      )}

                      {card.isCustomized && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-google-blue border border-blue-200 flex items-center gap-1">
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>Инсайд владельца</span>
                        </span>
                      )}

                      {card.applied ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>{card.isFree ? 'Применено' : 'Применено через API'}</span>
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          card.gapTag === 'CRITICAL_FIX' 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : card.gapTag === 'HIGH_IMPACT'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-google-blue border border-blue-200'
                        }`}>
                          {card.gapTag === 'CRITICAL_FIX' ? 'Критично' : card.gapTag === 'HIGH_IMPACT' ? 'Высокий приоритет' : 'Рост конверсии'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">Уязвимость в Google Maps: </span>
                    {card.problemText}
                  </div>

                  {/* Transparent Before vs After Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    
                    {/* Before (Было в реальной карточке Google) */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Текущее состояние в Google:
                          </span>
                        </div>
                        <p className="text-slate-700 italic leading-relaxed pt-1">
                          "{card.beforeValue}"
                        </p>
                      </div>

                      {card.beforeMeta && (
                        <div className="pt-2 border-t border-slate-200/70 text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                          <span>{card.beforeMeta}</span>
                        </div>
                      )}
                    </div>

                    {/* After (Станет / ИИ-Решение) with Collaborative Inline Edit & PLG Blur */}
                    <div className="relative p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex flex-col justify-between space-y-2 overflow-hidden">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <span className="text-[10px] font-bold text-google-blue uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Решение ИИ по стандартам Google:</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                            {card.impactMetric}
                          </span>
                        </div>

                        {/* Interactive Tone Switcher for Card 1 (SEO Profile Bio) */}
                        {card.id === 'audit-bio' && !editingCardId && (
                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            <span className="text-[10px] text-slate-400 font-semibold">Стиль ИИ:</span>
                            <button
                              type="button"
                              onClick={() => handleToneChange('SEO')}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                seoTone === 'SEO'
                                  ? 'bg-google-blue text-white shadow-2xs'
                                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                              title="Максимум поисковых ключевых слов для ранжирования"
                            >
                              🎯 Локальное SEO
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToneChange('PREMIUM')}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                seoTone === 'PREMIUM'
                                  ? 'bg-google-blue text-white shadow-2xs'
                                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                              title="Премиальная подача, сервис и атмосфера"
                            >
                              💎 Премиум
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToneChange('CONCISE')}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                seoTone === 'CONCISE'
                                  ? 'bg-google-blue text-white shadow-2xs'
                                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                              title="Лаконичные факты и призыв к действию"
                            >
                              ⚡ Краткий
                            </button>
                          </div>
                        )}

                        {/* Editing View */}
                        {editingCardId === card.id ? (
                          <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              rows={4}
                              className="w-full p-2.5 rounded-xl border border-blue-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-google-blue font-sans leading-relaxed"
                              placeholder="Дополните формулировку своими фактами о заведении..."
                            />
                            <div className="flex flex-wrap items-center gap-1 text-[10px]">
                              <span className="text-slate-400 font-semibold">Быстрые инсайды:</span>
                              <button
                                type="button"
                                onClick={() => handleQuickChipAppend('✓ Собственная парковка для гостей.')}
                                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                              >
                                + Парковка
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickChipAppend('✓ Дог-френдли терраса (миски с водой).')}
                                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                              >
                                + Дог-френдли
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickChipAppend('✓ Фирменное авторское блюдо от шефа.')}
                                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                              >
                                + Хит меню
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickChipAppend('✓ Доступно предварительное бронирование.')}
                                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                              >
                                + Бронь
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickChipAppend('✓ Уютная открытая терраса.')}
                                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                              >
                                + Терраса
                              </button>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
                              >
                                Отмена
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(card.id)}
                                className="px-3.5 py-1 bg-google-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                              >
                                Сохранить инсайд
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Content block: Crisp if Free or Pro; Blurred & Locked ONLY if Paid Card on Free Plan */
                          <div className={`mt-1 text-slate-800 font-medium leading-relaxed transition-all ${
                            !card.isFree && !isPro && !card.applied 
                              ? 'blur-xs select-none pointer-events-none' 
                              : 'select-text'
                          }`}>
                            {isRegeneratingBio && card.id === 'audit-bio' ? (
                              <div className="flex items-center gap-2 text-google-blue py-2">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>ИИ составляет описание в выбранном стиле...</span>
                              </div>
                            ) : (
                              card.afterAiValue
                            )}
                          </div>
                        )}

                        {/* Keyword Chips for Card 1 */}
                        {card.keywordChips && !editingCardId && (
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            {card.keywordChips.map((chip, cIdx) => (
                              <span key={cIdx} className="px-2 py-0.5 bg-white/90 border border-blue-200/80 rounded-md text-[9px] font-semibold text-slate-600">
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {card.afterMeta && (
                        <div className="pt-2 border-t border-blue-200/60 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                          <span>{card.afterMeta}</span>
                        </div>
                      )}

                      {/* Paywall Overlay Badge ONLY when Card is Paid & User is Free */}
                      {!card.isFree && !isPro && !card.applied && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center p-3 select-none">
                          <button
                            type="button"
                            onClick={() => setIsPaywallModalOpen(true)}
                            className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white font-bold rounded-xl text-[11px] shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Разблокировать в Pro ($49/мес)</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Card Bottom CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Эффект: {card.impactMetric}
                      </span>
                      {card.isCustomized && (
                        <span className="text-[11px] text-google-blue font-bold">
                          • Учтены ваши данные
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {/* Copy Text Button (Always free & available for unblurred content) */}
                      {(card.isFree || isPro || card.applied) && editingCardId !== card.id && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(card.afterAiValue, `Текст «${card.categoryTitle}» скопирован!`)}
                          className="px-2.5 py-1 text-slate-600 hover:text-google-blue hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Скопировать готовый текст в буфер обмена для ручной вставки в Google"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Скопировать</span>
                        </button>
                      )}

                      {!card.applied && editingCardId !== card.id && (card.isFree || isPro) && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(card)}
                          className="px-2.5 py-1 text-slate-600 hover:text-google-blue hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Отредактировать предложение ИИ с учетом ваших знаний о заведении"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Отредактировать</span>
                        </button>
                      )}

                      {card.applied ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px] px-2 py-1 bg-emerald-50 rounded-xl border border-emerald-200">
                          <Check className="w-3.5 h-3.5" /> {card.isFree ? 'Применено' : 'Синхронизировано в Pro'}
                        </span>
                      ) : card.isFree ? (
                        /* FREE ITEM: Instant 1-click free application! */
                        <button
                          type="button"
                          onClick={() => handleApplySingleCard(card.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Применить бесплатно</span>
                        </button>
                      ) : isPro ? (
                        /* PRO ITEM on Pro License */
                        <button
                          type="button"
                          onClick={() => handleApplySingleCard(card.id)}
                          className="px-3.5 py-1.5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Применить в 1 клик</span>
                        </button>
                      ) : (
                        /* PRO ITEM on Free Plan */
                        <button
                          type="button"
                          onClick={() => setIsPaywallModalOpen(true)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Доступно в Pro</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: APPLYING SCREEN (2-SEC REALISTIC API SYNC)       */}
        {/* ======================================================== */}
        {step === 'APPLYING' && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 flex-1 bg-white">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center shadow-xs">
              <RefreshCw className="w-8 h-8 text-google-blue animate-spin" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 tracking-tight">
                Синхронизация оптимизаций через Google API...
              </h4>
              <p className="text-xs text-slate-500 max-w-md">
                Вносим проверенное описание, праздничные часы, атрибуты, каталог и гео-метки напрямую в ваш Google Business Profile.
              </p>
            </div>

            <div className="w-full max-w-md space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              {applyingSteps.map((stepDesc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {appliedStepIndex >= idx ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span className={`text-[11px] ${
                    appliedStepIndex >= idx ? 'text-slate-800 font-semibold' : 'text-slate-400'
                  }`}>
                    {stepDesc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: SUCCESS & CELEBRATION SCREEN                     */}
        {/* ======================================================== */}
        {step === 'SUCCESS' && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 flex-1 bg-white">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Check className="w-10 h-10 text-emerald-600 stroke-[3]" />
            </div>

            <div className="space-y-2 max-w-md">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Оптимизация завершена
              </span>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                Карточка готова к Топ-3! 🟢 Защита Sentinel активна
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Все 6 уязвимостей успешно устранены. Профиль переведен в эталонное состояние по официальным стандартам Google Maps и поставлен на круглосуточный мониторинг.
              </p>
            </div>

            {/* Before / After Status Tile */}
            <div className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-md w-full text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Было до аудита</span>
                <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> 6 зон уязвимости (утечка гостей)
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="space-y-1 text-right">
                <span className="text-[10px] font-bold text-emerald-700 block uppercase">Стало сейчас</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% готовность • Защита 24/7
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompleteAndExit}
              className="px-6 py-3.5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Перейти в панель управления заведением</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* ZONE C: STICKY BOTTOM ACTION / PAYWALL CTA BAR           */}
        {/* ======================================================== */}
        {step === 'REPORT' && (
          <div className="bg-white border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isPro ? (
                  <span><strong>Лицензия Pro активна:</strong> Прямая авторизация и применение всех 6 оптимизаций через Google API.</span>
                ) : (
                  <span>
                    <strong>Бесплатный режим:</strong> 2 стартовых улучшения готовы к применению.
                  </span>
                )}
              </span>
            </div>

            {/* Conditional Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              
              {isPro ? (
                /* PRO USER: 1-Click Master Apply */
                <button
                  type="button"
                  onClick={handleApplyAll}
                  className="w-full sm:w-auto px-5 py-3 bg-google-blue hover:bg-blue-600 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>⚡ Применить все 6 оптимизаций через API</span>
                </button>
              ) : (
                /* FREE USER: Freemium Application + Upgrade CTA */
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  {!isAllFreeApplied ? (
                    <button
                      type="button"
                      onClick={handleApplyFreeStarterCards}
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-2xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Применить 2 бесплатных улучшения</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleManualGoogleEdit}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer text-center"
                      title="Вручную обновить профиль в Google Business Profile"
                    >
                      <span>Обновить вручную в Google ↗</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsPaywallModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-3 bg-google-blue hover:bg-blue-600 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>🚀 Разблокировать все 6 в 1 клик — $49/мес</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* PAYWALL CONVERSION MODAL                                  */}
      {/* ======================================================== */}
      {isPaywallModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setIsPaywallModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-google-blue to-blue-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
                <Zap className="w-7 h-7 fill-white" />
              </div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">
                Автозаполнение в 1 клик и 24/7 Защита
              </h4>
              <p className="text-xs text-slate-500">
                Экономьте от 2+ часов ручной рутины в Google Business Profile и включите автономную защиту карточки от чужих правок.
              </p>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Применение всех 6 оптимизаций через официальный API в 1 клик</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Круглосуточная защита от чужих правок и подмены номеров</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ИИ-автоответчик на отзывы с ключевыми словами для локального SEO</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Защита от риска повторной видео-верификации Google</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsPro(true);
                  setIsPaywallModalOpen(false);
                  setStep('APPLYING');
                }}
                className="w-full py-3.5 bg-google-blue hover:bg-blue-600 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Подключить Pro (7 дней бесплатно) — $49/мес</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPro(true);
                  setIsPaywallModalOpen(false);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Тестовое переключение на тариф Pro (Демо)
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Отмена в 1 клик в любое время. Без риска. 30 дней гарантии возврата.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
