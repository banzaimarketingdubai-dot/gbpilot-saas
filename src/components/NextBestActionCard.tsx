'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Info,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InspectionAuditReport, AuditRecommendation } from '@/lib/inspection/auditEngine';

interface NextBestActionCardProps {
  auditReport: InspectionAuditReport | null;
  onApplyAction?: (actionId: string) => void;
  onOpenAuditModal?: () => void;
}

export function NextBestActionCard({
  auditReport,
  onApplyAction,
  onOpenAuditModal
}: NextBestActionCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [showRoiExplanation, setShowRoiExplanation] = useState(false);

  // If no report or profile yet, return an inviting onboarding state
  if (!auditReport || auditReport.recommendations.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-google-blue flex items-center justify-center shrink-0 border border-blue-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Подключите Google Business Profile для расчёта окупаемости
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              GBPilot автоматически выявит точки утечки трафика и покажет эквивалент экономии на рекламе Google Ads.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const recommendations = auditReport.recommendations;
  const currentAction = recommendations[currentIndex] || recommendations[0];
  const isCurrentDone = completedActions[currentAction.id] || false;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  const handleExecute = async () => {
    if (isExecuting || isCurrentDone) return;
    setIsExecuting(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#1A73E8', '#1E8E3E', '#F9AB00', '#10B981']
      });
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 600));

    setCompletedActions((prev) => ({ ...prev, [currentAction.id]: true }));
    setIsExecuting(false);

    if (onApplyAction) {
      onApplyAction(currentAction.id);
    }
  };

  return (
    <div className="bg-white border-2 border-blue-100 rounded-3xl p-4 sm:p-6 shadow-xs relative overflow-hidden transition-all">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50/50 to-emerald-50/30 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

      {/* Header Bar: Stepper & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-blue-600 text-white shadow-2xs">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Главный шаг недели
              </span>
              <span className="text-[10px] bg-blue-50 text-google-blue font-bold px-2 py-0.5 rounded-full border border-blue-200">
                Шаг {currentIndex + 1} из {recommendations.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Один конкретный шаг с прямым влиянием на прибыль и экономию рекламы
            </p>
          </div>
        </div>

        {/* Stepper Controls & Quick ROI Info Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowRoiExplanation(!showRoiExplanation)}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
            title="Как рассчитывается выгода в деньгах?"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Справка по ROI</span>
          </button>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
              title="Предыдущая рекомендация"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
              title="Следующая рекомендация"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-4 space-y-4 relative z-10">
        {/* Row 1: Action Title & Value Badges */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-slate-900">
                {currentAction.categoryTitle}
              </span>

              {/* Safety Suspension Risk Badge */}
              {currentAction.suspensionRisk === 'HIGH_RISK_LOCKED' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200">
                  <ShieldCheck className="w-3 h-3 text-rose-600" />
                  <span>Критическая зона: Защита от бана</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Безопасная зона: Риск бана 0%</span>
                </span>
              )}
            </div>

            {/* Why explanation (1 sentence on client language) */}
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {currentAction.problemText}
            </p>
          </div>

          {/* Right Pillar: Financial Impact Pill */}
          <div className="shrink-0 self-start p-2.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 text-left min-w-[170px]">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Эквивалент рекламы
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-emerald-700">
                {currentAction.financialImpactFormatted || `+${auditReport.currencySymbol}450/mo`}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-800/80 block mt-0.5">
              {currentAction.impactMetric.split('(')[0].trim()}
            </span>
          </div>
        </div>

        {/* Row 2: Before vs After AI preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ❌ Сейчас в профиле:
            </span>
            <p className="text-slate-600 text-xs line-clamp-2 italic">
              {currentAction.beforeValue}
            </p>
          </div>
          <div className="space-y-1 md:border-l md:border-slate-200 md:pl-3">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Решение GBPilot AI:</span>
            </span>
            <p className="text-slate-800 text-xs font-semibold line-clamp-2">
              {currentAction.afterValue}
            </p>
          </div>
        </div>

        {/* Expandable Mini-Sheet: ROI Formula Explanation */}
        {showRoiExplanation && (
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Info className="w-4 h-4 text-google-blue" />
                <span>Откуда берутся цифры экономии? (Формула Стива Хансакера)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowRoiExplanation(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              В нише <strong>{auditReport.industryBenchmark.categoryGroup}</strong> средняя стоимость одного целевого лида (звонка или заявки) в Google Ads составляет <strong>{auditReport.industryBenchmark.leadCostFormatted}</strong>.
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Попадание в Топ-3 Google Maps генерирует постоянный поток звонков по коммерческим запросам <em>без оплаты за клики</em>. Это действие устраняет утечку видимости и привлекает клиентов с эквивалентной ценностью платного рекламного бюджета.
            </p>
          </div>
        )}

        {/* Row 3: Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Потенциал полной оптимизации профиля: <strong>+{auditReport.revenueRecoveryFormatted}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {onOpenAuditModal && (
              <button
                type="button"
                onClick={onOpenAuditModal}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Все 6 рекомендаций →
              </button>
            )}

            <button
              type="button"
              onClick={handleExecute}
              disabled={isExecuting || isCurrentDone}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                isCurrentDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : 'bg-google-blue hover:bg-blue-600 text-white'
              }`}
            >
              {isExecuting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isCurrentDone ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Применено к профилю</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>⚡ Применить автоматически AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
