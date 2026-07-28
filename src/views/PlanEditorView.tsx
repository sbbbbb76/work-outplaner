import React, { useState } from 'react';
import { WorkoutPlan, Exercise, Client, PlanExercise, MuscleCategory } from '../types';
import { InlineVideoPlayer } from '../components/InlineVideoPlayer';
import { getPlanShareUrl, copyToClipboard } from '../utils/clipboardUtils';
import {
  ArrowLeft,
  Share2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Library,
  Layers,
  Repeat,
  Clock,
  Weight,
  FileText,
  User,
  Tag,
  X,
  Sparkles,
} from 'lucide-react';

interface PlanEditorViewProps {
  plan: WorkoutPlan;
  exerciseLibrary: Exercise[];
  clients: Client[];
  onUpdatePlan: (updatedPlan: WorkoutPlan) => void;
  onBackToDashboard: () => void;
  onViewPlan: (planId: string) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

const DIFFICULTY_OPTIONS: ('初階' | '中階' | '高階' | '選手極限')[] = ['初階', '中階', '高階', '選手極限'];

export const PlanEditorView: React.FC<PlanEditorViewProps> = ({
  plan,
  exerciseLibrary,
  clients,
  onUpdatePlan,
  onBackToDashboard,
  onViewPlan,
  onShowToast,
}) => {
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Custom exercise form
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<MuscleCategory>('胸部');
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');

  // Update root plan properties with instant save to parent state / LocalStorage
  const handleUpdate = (fields: Partial<WorkoutPlan>) => {
    const updated = {
      ...plan,
      ...fields,
      updatedAt: new Date().toISOString(),
    };
    onUpdatePlan(updated);
  };

  // Add Exercise from Library
  const handleAddFromLibrary = (ex: Exercise) => {
    const newPlanExercise: PlanExercise = {
      instanceId: 'inst-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      exerciseId: ex.id,
      name: ex.name,
      category: ex.category,
      videoUrl: ex.videoUrl,
      instructions: ex.instructions,
      sets: 3,
      reps: '10-12 次',
      weight: '自重',
      restSeconds: '90 秒',
      completedSets: [false, false, false],
    };

    const newExercises = [...plan.exercises, newPlanExercise];
    handleUpdate({ exercises: newExercises });
    onShowToast(`已將《${ex.name}》加入課表`, 'success');
  };

  // Add Custom Exercise directly
  const handleAddCustomExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newPlanExercise: PlanExercise = {
      instanceId: 'inst-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: customName.trim(),
      category: customCategory,
      videoUrl: customVideoUrl.trim(),
      instructions: customInstructions.trim(),
      sets: 3,
      reps: '10 次',
      weight: '適中重量',
      restSeconds: '90 秒',
      completedSets: [false, false, false],
    };

    handleUpdate({ exercises: [...plan.exercises, newPlanExercise] });
    onShowToast(`已新增自訂動作《${customName}》`, 'success');

    // Reset
    setCustomName('');
    setCustomVideoUrl('');
    setCustomInstructions('');
    setIsCustomModalOpen(false);
  };

  // Update specific plan exercise
  const handleUpdateExercise = (instanceId: string, fields: Partial<PlanExercise>) => {
    const newExercises = plan.exercises.map((ex) => {
      if (ex.instanceId === instanceId) {
        const updatedSets = fields.sets !== undefined ? fields.sets : ex.sets;
        const currentCompleted = ex.completedSets || [];
        let newCompleted = [...currentCompleted];
        if (updatedSets > currentCompleted.length) {
          newCompleted = [
            ...currentCompleted,
            ...Array(updatedSets - currentCompleted.length).fill(false),
          ];
        } else if (updatedSets < currentCompleted.length) {
          newCompleted = currentCompleted.slice(0, updatedSets);
        }

        return { ...ex, ...fields, completedSets: newCompleted };
      }
      return ex;
    });

    handleUpdate({ exercises: newExercises });
  };

  // Move exercise up/down
  const handleMoveExercise = (index: number, direction: 'UP' | 'DOWN') => {
    if (direction === 'UP' && index === 0) return;
    if (direction === 'DOWN' && index === plan.exercises.length - 1) return;

    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    const newExercises = [...plan.exercises];
    const [moved] = newExercises.splice(index, 1);
    newExercises.splice(targetIndex, 0, moved);

    handleUpdate({ exercises: newExercises });
  };

  // Delete exercise from plan
  const handleDeleteExercise = (instanceId: string) => {
    const newExercises = plan.exercises.filter((ex) => ex.instanceId !== instanceId);
    handleUpdate({ exercises: newExercises });
    onShowToast('已從課表中移除動作', 'info');
  };

  // Tags string handler
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const tagsArray = val.split(',').map((t) => t.trim()).filter(Boolean);
    handleUpdate({ tags: tagsArray });
  };

  const handleShareLink = async () => {
    const url = getPlanShareUrl(plan.id);
    const success = await copyToClipboard(url);
    if (success) {
      onShowToast('已成功複製菜單唯讀分享網址！', 'success');
    } else {
      onShowToast('複製失敗', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-[#382328]">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#fcf8f2] border border-[#e8dfd5] rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#f2e7d8] hover:bg-[#ebdcc9] text-[#382328] border border-[#ded0be] transition-all active:scale-95 self-start"
        >
          <ArrowLeft className="w-4 h-4 text-rose-500" />
          <span>返回儀表板</span>
        </button>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] text-rose-700 font-mono bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-rose-500" /> 即時存檔中
          </span>

          <button
            type="button"
            onClick={handleShareLink}
            className="px-3.5 py-2 rounded-xl bg-[#f2e7d8] hover:bg-[#ebdcc9] text-[#382328] text-xs font-bold flex items-center gap-1.5 border border-[#ded0be] transition-all"
          >
            <Share2 className="w-4 h-4 text-rose-500" />
            <span>分享連結</span>
          </button>

          <button
            type="button"
            onClick={() => onViewPlan(plan.id)}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-rose-500/20 active:scale-95 transition-all"
          >
            以唯讀預覽模式開啓
          </button>
        </div>
      </div>

      {/* Plan Master Meta Form */}
      <div className="p-6 bg-[#fcf8f2] border border-[#e8dfd5] rounded-3xl space-y-5 shadow-sm">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-rose-600 uppercase tracking-wider">
            計畫主題名稱 *
          </label>
          <input
            type="text"
            value={plan.title}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            placeholder="例如: 【胸背推拉超級组】高效增肌菜單 A"
            className="w-full px-4 py-3 bg-[#fdfbf7] border border-[#e2d5c5] rounded-2xl text-lg font-bold text-[#382328] focus:outline-none focus:border-rose-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#6e545a] mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-rose-500" /> 指定歸屬學員
            </label>
            <select
              value={plan.clientId || ''}
              onChange={(e) => handleUpdate({ clientId: e.target.value || undefined })}
              className="w-full px-3 py-2.5 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs text-[#382328] focus:outline-none focus:border-rose-400"
            >
              <option value="">(未指定 / 一般範本)</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.goal ? `(${client.goal})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6e545a] mb-1">強度/難易度標籤</label>
            <select
              value={plan.difficulty}
              onChange={(e) =>
                handleUpdate({ difficulty: e.target.value as '初階' | '中階' | '高階' | '選手極限' })
              }
              className="w-full px-3 py-2.5 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs text-[#382328] focus:outline-none focus:border-rose-400"
            >
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6e545a] mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-rose-500" /> 標籤 (逗號分隔)
            </label>
            <input
              type="text"
              value={plan.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="例如: 增肌, 上肢推拉, 胸肌"
              className="w-full px-3 py-2.5 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs text-[#382328] focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#6e545a] mb-1">菜單簡介與教練前言說明</label>
          <textarea
            rows={2}
            value={plan.description}
            onChange={(e) => handleUpdate({ description: e.target.value })}
            placeholder="說明此菜單的設計理念、組間節奏與適合族群..."
            className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs text-[#382328] focus:outline-none focus:border-rose-400"
          />
        </div>
      </div>

      {/* Plan Exercises Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-[#382328] flex items-center gap-2">
              菜單動作排列 ({plan.exercises.length})
            </h3>
            <p className="text-xs text-[#7c6368]">
              可隨時調整順序、組數、次數與休息時間，變更均即時儲存。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLibraryModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#f2e7d8] hover:bg-[#ebdcc9] text-[#382328] font-bold text-xs border border-[#ded0be] flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Library className="w-4 h-4 text-rose-500" /> 從動作庫挑選
            </button>

            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> 新增自訂動作
            </button>
          </div>
        </div>

        {plan.exercises.length === 0 ? (
          <div className="text-center py-16 bg-[#fcf8f2] border border-dashed border-[#e2d5c5] rounded-3xl space-y-3">
            <p className="text-sm font-bold text-[#6e545a]">目前此計畫尚未安排任何動作</p>
            <p className="text-xs text-[#7c6368]">點擊上方按鈕，由動作庫帶入或自訂動作。</p>
          </div>
        ) : (
          <div className="space-y-4">
            {plan.exercises.map((ex, idx) => (
              <div
                key={ex.instanceId}
                className="bg-[#fcf8f2] border border-[#e8dfd5] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
              >
                {/* Exercise Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e8dfd5]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 font-extrabold text-sm flex items-center justify-center shrink-0 border border-rose-200">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#f2e7d8] text-[10px] font-bold text-rose-700">
                          {ex.category}
                        </span>
                        <h4 className="text-base font-bold text-[#382328]">{ex.name}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Reorder and Delete Controls */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveExercise(idx, 'UP')}
                      className="p-1.5 rounded-xl bg-[#f2e7d8] text-[#5c474b] hover:text-rose-600 disabled:opacity-30 transition-colors"
                      title="上移排序"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === plan.exercises.length - 1}
                      onClick={() => handleMoveExercise(idx, 'DOWN')}
                      className="p-1.5 rounded-xl bg-[#f2e7d8] text-[#5c474b] hover:text-rose-600 disabled:opacity-30 transition-colors"
                      title="下移排序"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExercise(ex.instanceId)}
                      className="p-1.5 rounded-xl bg-[#f2e7d8] text-[#7c6368] hover:text-rose-600 transition-colors"
                      title="移除此動作"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Layout: Video Preview + Controls Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left: Video */}
                  <div className="lg:col-span-4">
                    <InlineVideoPlayer videoUrl={ex.videoUrl} title={ex.name} aspectRatio="aspect-video" />
                  </div>

                  {/* Right: Exercise Parameters */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#6e545a] mb-1 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-rose-500" /> 組數 (Sets)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={ex.sets}
                          onChange={(e) =>
                            handleUpdateExercise(ex.instanceId, {
                              sets: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-sm font-extrabold text-[#382328] focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6e545a] mb-1 flex items-center gap-1">
                          <Repeat className="w-3.5 h-3.5 text-rose-500" /> 次數/秒數
                        </label>
                        <input
                          type="text"
                          value={ex.reps}
                          onChange={(e) =>
                            handleUpdateExercise(ex.instanceId, { reps: e.target.value })
                          }
                          placeholder="例如: 8-10 次"
                          className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs font-bold text-[#382328] focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6e545a] mb-1 flex items-center gap-1">
                          <Weight className="w-3.5 h-3.5 text-rose-500" /> 目標重量
                        </label>
                        <input
                          type="text"
                          value={ex.weight}
                          onChange={(e) =>
                            handleUpdateExercise(ex.instanceId, { weight: e.target.value })
                          }
                          placeholder="例如: 75 kg / 自重"
                          className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs font-bold text-[#382328] focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6e545a] mb-1 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-rose-500" /> 休息時間
                        </label>
                        <input
                          type="text"
                          value={ex.restSeconds}
                          onChange={(e) =>
                            handleUpdateExercise(ex.instanceId, { restSeconds: e.target.value })
                          }
                          placeholder="例如: 90 秒"
                          className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs font-bold text-[#382328] focus:outline-none focus:border-rose-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6e545a] mb-1 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-rose-500" /> 專屬叮嚀 / 動作提示
                      </label>
                      <input
                        type="text"
                        value={ex.notes || ''}
                        onChange={(e) =>
                          handleUpdateExercise(ex.instanceId, { notes: e.target.value })
                        }
                        placeholder="例如: 最後一組做遞減組，注意肩胛骨穩定..."
                        className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs text-[#382328] focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Back Navigation Bar */}
      <div className="pt-4 pb-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#e8dfd5]">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-extrabold bg-[#f2e7d8] hover:bg-[#ebdcc9] text-[#382328] border border-[#ded0be] shadow-sm active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-rose-500" />
          <span>返回儀表板</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewPlan(plan.id)}
            className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-500/20 transition-all"
          >
            以唯讀預覽模式開啓
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#6e545a] hover:text-[#382328] bg-[#f7f0e6] border border-[#e2d5c5] transition-colors"
          >
            ↑ 回到頁首
          </button>
        </div>
      </div>

      {/* Select from Library Modal */}
      {isLibraryModalOpen && (
        <div className="fixed inset-0 z-[9000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#fcf8f2] border border-rose-200 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col text-[#382328]"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#e8dfd5] bg-[#fcf8f2]/95">
              <h3 className="text-base font-extrabold text-[#382328] flex items-center gap-2">
                <Library className="w-4 h-4 text-rose-500" /> 從動作庫挑選動作加入
              </h3>
              <button
                onClick={() => setIsLibraryModalOpen(false)}
                className="p-1.5 rounded-xl bg-[#f2e7d8] text-[#5c474b] hover:text-[#382328]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              {exerciseLibrary.length === 0 ? (
                <p className="text-center py-8 text-sm text-[#7c6368]">動作庫目前無內容。</p>
              ) : (
                exerciseLibrary.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between p-3.5 bg-[#f7f0e6] rounded-2xl border border-[#e2d5c5] hover:border-rose-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 text-[10px] font-bold">
                          {ex.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#382328]">{ex.name}</h4>
                      </div>
                      {ex.targetMuscles && (
                        <p className="text-xs text-[#7c6368] mt-0.5">目標: {ex.targetMuscles}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddFromLibrary(ex)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
                    >
                      + 加入菜單
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Exercise Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-[9000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#fcf8f2] border border-rose-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#382328]"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#e8dfd5] bg-[#fcf8f2]/95">
              <h3 className="text-base font-extrabold text-[#382328]">自訂動作並直接加入菜單</h3>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 rounded-xl bg-[#f2e7d8] text-[#5c474b] hover:text-[#382328]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomExercise} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6e545a] mb-1">動作名稱 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 繩索臉拉 (Rope Face Pull)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-sm text-[#382328] focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6e545a] mb-1">部位分類</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as MuscleCategory)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-sm text-[#382328] focus:outline-none focus:border-rose-400"
                >
                  {['胸部', '背部', '腿部', '肩膀', '手臂', '核心', '全身/有氧'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6e545a] mb-1">示範影片網址 (選填)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={customVideoUrl}
                  onChange={(e) => setCustomVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs text-[#382328] focus:outline-none focus:border-rose-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6e545a] mb-1">動作說明/細節</label>
                <textarea
                  rows={3}
                  placeholder="步驟說明與注意事項..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs text-[#382328] focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6e545a] hover:text-[#382328]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold shadow-md"
                >
                  確認加入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
