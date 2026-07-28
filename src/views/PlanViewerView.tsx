import React from 'react';
import { WorkoutPlan, Client, PlanExercise } from '../types';
import { InlineVideoPlayer } from '../components/InlineVideoPlayer';
import { getPlanShareUrl, copyToClipboard } from '../utils/clipboardUtils';
import {
  Share2,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Flame,
  Printer,
  Check,
  Eye,
  Lock,
} from 'lucide-react';

interface PlanViewerViewProps {
  plan: WorkoutPlan;
  client?: Client;
  onUpdatePlanExercises?: (updatedExercises: PlanExercise[]) => void;
  isStandaloneHashView?: boolean;
  isEditMode?: boolean;
  onBackToDashboard?: () => void;
  onEditPlan?: (planId: string) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const PlanViewerView: React.FC<PlanViewerViewProps> = ({
  plan,
  client,
  onUpdatePlanExercises,
  isStandaloneHashView = false,
  isEditMode = false,
  onBackToDashboard,
  onEditPlan,
  onShowToast,
}) => {
  // Toggle set completed state
  const handleToggleSet = (exerciseInstanceId: string, setIndex: number) => {
    if (!onUpdatePlanExercises) return;

    const newExercises = plan.exercises.map((ex) => {
      if (ex.instanceId === exerciseInstanceId) {
        const currentCompleted = [...(ex.completedSets || Array(ex.sets).fill(false))];
        currentCompleted[setIndex] = !currentCompleted[setIndex];
        return { ...ex, completedSets: currentCompleted };
      }
      return ex;
    });

    onUpdatePlanExercises(newExercises);
  };

  const handleShare = async () => {
    const url = getPlanShareUrl(plan.id);
    const success = await copyToClipboard(url);
    if (success) {
      onShowToast('已複製分享網址！可貼給學員或社群開啟', 'success');
    } else {
      onShowToast('複製失敗', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate total completed sets
  let totalSetsCount = 0;
  let totalCompletedSetsCount = 0;

  plan.exercises.forEach((ex) => {
    totalSetsCount += ex.sets;
    if (ex.completedSets) {
      totalCompletedSetsCount += ex.completedSets.filter(Boolean).length;
    }
  });

  const progressPercent =
    totalSetsCount > 0 ? Math.round((totalCompletedSetsCount / totalSetsCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 print:p-0 text-[#382328]">
      {/* Top Header / Nav when in app or standalone */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#fcf8f2] border border-[#e8dfd5] rounded-2xl print:hidden shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f2e7d8] hover:bg-[#ebdcc9] text-[#382328] border border-[#ded0be] transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-rose-500" />
              <span>返回儀表板</span>
            </button>
          )}

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-900 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>唯讀互動模式</span>
          </span>

          {onEditPlan && isEditMode && (
            <button
              type="button"
              onClick={() => onEditPlan(plan.id)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f2e7d8] hover:bg-[#ebdcc9] text-rose-600 border border-[#ded0be] transition-all active:scale-95"
            >
              <span>進入編輯此課表</span>
            </button>
          )}

          {isStandaloneHashView && !onBackToDashboard && (
            <a
              href="#/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f2e7d8] hover:bg-[#ebdcc9] text-rose-600 border border-[#ded0be] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>開啟重訓系統儀表板</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-[#f2e7d8] hover:bg-[#ebdcc9] text-[#5c474b] hover:text-[#382328] border border-[#ded0be] transition-colors"
            title="列印 / 輸出 PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-rose-500/20 active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" /> 複製分享連結
          </button>
        </div>
      </div>

      {/* Plan Main Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#fcf8f2] border border-[#e8dfd5] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                plan.difficulty === '初階'
                  ? 'bg-sky-500/10 text-sky-700 border border-sky-300'
                  : plan.difficulty === '中階'
                  ? 'bg-amber-500/10 text-amber-800 border border-amber-300'
                  : 'bg-rose-500/10 text-rose-700 border border-rose-300'
              }`}
            >
              {plan.difficulty}課表
            </span>

            {client && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2e7d8] border border-[#ded0be] text-xs font-bold text-[#382328]">
                <span className={`w-2.5 h-2.5 rounded-full ${client.avatarColor}`} />
                學員: {client.name}
              </span>
            )}
          </div>

          <span className="text-xs text-[#7c6368] font-mono">
            更新時間: {new Date(plan.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#382328] tracking-tight">
          {plan.title}
        </h1>

        {plan.description && (
          <p className="text-sm text-[#5c474b] leading-relaxed font-normal bg-[#f7f0e6] p-4 rounded-2xl border border-[#e2d5c5]">
            {plan.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {plan.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Progress Tracker Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#6e545a] mb-1.5">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-rose-500" />
              本日訓練進度
            </span>
            <span className="font-mono text-rose-600 font-extrabold">
              {totalCompletedSetsCount} / {totalSetsCount} 組 ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3 bg-[#f2e7d8] rounded-full overflow-hidden p-0.5 border border-[#ded0be]">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercises Cards List */}
      <div className="space-y-6">
        <h2 className="text-lg font-extrabold text-[#382328] flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-600" /> 訓練菜單動作明細
        </h2>

        {plan.exercises.map((ex, idx) => {
          const completedSets = ex.completedSets || Array(ex.sets).fill(false);

          return (
            <div
              key={ex.instanceId}
              className="bg-[#fcf8f2] border border-[#e8dfd5] rounded-3xl p-5 sm:p-6 shadow-sm space-y-5"
            >
              {/* Exercise Title & Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#e8dfd5] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-2xl bg-rose-500 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-700 border border-rose-200 text-xs font-bold">
                        {ex.category}
                      </span>
                      <h3 className="text-lg font-bold text-[#382328]">{ex.name}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Layout: Video + Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Video Player */}
                <div className="md:col-span-5">
                  <InlineVideoPlayer videoUrl={ex.videoUrl} title={ex.name} aspectRatio="aspect-video" />
                </div>

                {/* Parameters & Set Tracker */}
                <div className="md:col-span-7 space-y-4">
                  {/* Parameter Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-[#f7f0e6] rounded-2xl border border-[#e2d5c5]">
                      <span className="block text-[10px] text-[#7c6368] font-medium">組數 x 次數</span>
                      <strong className="text-sm font-bold text-rose-600">
                        {ex.sets} 組 x {ex.reps}
                      </strong>
                    </div>

                    <div className="p-2.5 bg-[#f7f0e6] rounded-2xl border border-[#e2d5c5]">
                      <span className="block text-[10px] text-[#7c6368] font-medium">建議重量</span>
                      <strong className="text-sm font-bold text-[#382328]">{ex.weight}</strong>
                    </div>

                    <div className="p-2.5 bg-[#f7f0e6] rounded-2xl border border-[#e2d5c5]">
                      <span className="block text-[10px] text-[#7c6368] font-medium">組間休息</span>
                      <strong className="text-sm font-bold text-[#5c474b]">{ex.restSeconds}</strong>
                    </div>
                  </div>

                  {/* Interactive Set Checkboxes */}
                  <div className="p-3.5 bg-[#f7f0e6] rounded-2xl border border-[#e2d5c5] space-y-2">
                    <span className="text-xs font-bold text-[#6e545a] block mb-1">
                      點擊勾選完成組數 (Completed Sets):
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {Array.from({ length: ex.sets }).map((_, sIdx) => {
                        const isDone = completedSets[sIdx];
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleToggleSet(ex.instanceId, sIdx)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                              isDone
                                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                                : 'bg-[#fdfbf7] border border-[#e2d5c5] text-[#6e545a] hover:text-[#382328]'
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              <Circle className="w-3.5 h-3.5" />
                            )}
                            第 {sIdx + 1} 組
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cues / Notes */}
                  {ex.notes && (
                    <div className="p-3 bg-amber-500/10 border border-amber-300 rounded-2xl text-xs text-amber-900 leading-relaxed">
                      <strong className="font-bold text-amber-800 block mb-0.5">💡 教練提醒:</strong>
                      {ex.notes}
                    </div>
                  )}

                  {/* Detailed Instructions */}
                  {ex.instructions && (
                    <div className="p-3.5 bg-[#f7f0e6] rounded-2xl border border-[#e2d5c5] text-xs text-[#6e545a] leading-relaxed whitespace-pre-line">
                      <strong className="font-bold text-[#382328] block mb-1">動作要點說明:</strong>
                      {ex.instructions}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Back Navigation Bar */}
      <div className="pt-4 pb-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#e8dfd5] print:hidden">
        {onBackToDashboard ? (
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-extrabold bg-[#f2e7d8] hover:bg-[#ebdcc9] text-[#382328] border border-[#ded0be] shadow-sm active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-rose-500" />
            <span>返回儀表板</span>
          </button>
        ) : (
          <a
            href="#/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-extrabold bg-[#f2e7d8] hover:bg-[#ebdcc9] text-[#382328] border border-[#ded0be] shadow-sm active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-rose-500" />
            <span>返回重訓系統儀表板</span>
          </a>
        )}

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#6e545a] hover:text-[#382328] bg-[#f7f0e6] border border-[#e2d5c5] transition-colors"
        >
          ↑ 回到頁首
        </button>
      </div>
    </div>
  );
};
