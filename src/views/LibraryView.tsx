import React, { useState } from 'react';
import { Exercise, MuscleCategory } from '../types';
import { InlineVideoPlayer } from '../components/InlineVideoPlayer';
import { SAMPLE_VIDEOS } from '../utils/videoUtils';
import { Search, Plus, Trash2, Edit3, X, Dumbbell, ArrowLeft } from 'lucide-react';

interface LibraryViewProps {
  exercises: Exercise[];
  onAddExercise: (newEx: Omit<Exercise, 'id' | 'createdAt'>) => void;
  onUpdateExercise: (updatedEx: Exercise) => void;
  onDeleteExercise: (exerciseId: string) => void;
  isEditMode: boolean;
  onBackToDashboard?: () => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

const CATEGORIES: MuscleCategory[] = ['胸部', '背部', '腿部', '肩膀', '手臂', '核心', '全身/有氧'];

export const LibraryView: React.FC<LibraryViewProps> = ({
  exercises,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise,
  isEditMode,
  onBackToDashboard,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MuscleCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEx, setEditingEx] = useState<Exercise | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MuscleCategory>('胸部');
  const [videoUrl, setVideoUrl] = useState('');
  const [targetMuscles, setTargetMuscles] = useState('');
  const [instructions, setInstructions] = useState('');

  const openAddModal = () => {
    setEditingEx(null);
    setName('');
    setCategory('胸部');
    setVideoUrl('');
    setTargetMuscles('');
    setInstructions('');
    setIsModalOpen(true);
  };

  const openEditModal = (ex: Exercise) => {
    setEditingEx(ex);
    setName(ex.name);
    setCategory(ex.category);
    setVideoUrl(ex.videoUrl);
    setTargetMuscles(ex.targetMuscles || '');
    setInstructions(ex.instructions);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingEx) {
      onUpdateExercise({
        ...editingEx,
        name: name.trim(),
        category,
        videoUrl: videoUrl.trim(),
        targetMuscles: targetMuscles.trim() || undefined,
        instructions: instructions.trim(),
      });
      onShowToast(`已更新動作範本《${name}》`, 'success');
    } else {
      onAddExercise({
        name: name.trim(),
        category,
        videoUrl: videoUrl.trim(),
        targetMuscles: targetMuscles.trim() || undefined,
        instructions: instructions.trim(),
      });
      onShowToast(`已成功新增動作《${name}》到個人動作庫！`, 'success');
    }

    setIsModalOpen(false);
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchesCat = selectedCategory === 'ALL' || ex.category === selectedCategory;
    const q = searchTerm.toLowerCase().trim();
    const matchesQuery =
      !q ||
      ex.name.toLowerCase().includes(q) ||
      (ex.targetMuscles && ex.targetMuscles.toLowerCase().includes(q)) ||
      ex.instructions.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-[#382328]">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#fcf8f2] border border-[#e8dfd5] rounded-3xl shadow-sm">
        <div className="space-y-2">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f2e7d8] hover:bg-[#ebdcc9] text-[#382328] text-xs font-bold border border-[#ded0be] transition-all mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-rose-500" />
              <span>返回儀表板</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#382328]">個人動作庫 (Exercise Library)</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 text-xs font-bold border border-rose-200">
                {exercises.length} 個標準動作範本
              </span>
            </div>
            <p className="text-xs text-[#7c6368] mt-1">
              可設定動作名稱、示範影片網址與訓練要點。將動作複製到計畫時，變更獨立不互扣。
            </p>
          </div>
        </div>

        {isEditMode && (
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md shadow-rose-500/20 flex items-center gap-2 shrink-0 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> 新增動作範本
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-[#fcf8f2] border border-[#e8dfd5] text-[#6e545a] hover:text-[#382328]'
              }`}
            >
              全部部位
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-[#fcf8f2] border border-[#e8dfd5] text-[#6e545a] hover:text-[#382328]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9c8489]" />
            <input
              type="text"
              placeholder="搜尋動作名稱或肌群..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs text-[#382328] placeholder-[#9c8489] focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>
      </div>

      {/* Exercise Cards Grid */}
      {filteredExercises.length === 0 ? (
        <div className="text-center py-16 bg-[#fcf8f2] border border-dashed border-[#e2d5c5] rounded-2xl space-y-2">
          <Dumbbell className="w-8 h-8 text-[#9c8489] mx-auto" />
          <p className="text-sm font-bold text-[#6e545a]">尚無符合條件的動作</p>
          <p className="text-xs text-[#7c6368]">切換過濾條件或新增專屬動作。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              className="bg-[#fcf8f2] border border-[#e8dfd5] hover:border-rose-300 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-3">
                {/* Inline Video Demo with click-to-expand */}
                <InlineVideoPlayer videoUrl={ex.videoUrl} title={ex.name} aspectRatio="aspect-video" />

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 border border-rose-200 text-[10px] font-bold">
                      {ex.category}
                    </span>
                    {ex.targetMuscles && (
                      <span className="text-[11px] text-[#7c6368] font-medium truncate max-w-[150px]">
                        目標: {ex.targetMuscles}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[#382328] mt-1.5">{ex.name}</h3>
                </div>

                {ex.instructions && (
                  <div className="p-2.5 rounded-xl bg-[#f7f0e6] border border-[#e2d5c5] text-xs text-[#5c474b] leading-relaxed max-h-28 overflow-y-auto whitespace-pre-line font-normal">
                    {ex.instructions}
                  </div>
                )}
              </div>

              {/* Actions */}
              {isEditMode && (
                <div className="pt-2 border-t border-[#e8dfd5] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(ex)}
                    className="p-1.5 rounded-xl bg-[#f2e7d8] hover:bg-[#ebdcc9] text-[#382328] hover:text-rose-600 transition-colors text-xs flex items-center gap-1 font-bold px-2.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> 編輯範本
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteExercise(ex.id)}
                    className="p-1.5 rounded-xl bg-[#f2e7d8] hover:bg-rose-100 text-[#7c6368] hover:text-rose-600 transition-colors"
                    title="刪除動作"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Exercise Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#fcf8f2] border border-rose-200 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-[#382328]"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#e8dfd5] bg-[#fcf8f2]/95">
              <h3 className="text-base font-extrabold text-[#382328]">
                {editingEx ? '編輯動作範本' : '新增動作至動作庫'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-[#f2e7d8] text-[#5c474b] hover:text-[#382328]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6e545a] mb-1">動作名稱 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 槓鈴深蹲 (Barbell Back Squat)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-sm text-[#382328] focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6e545a] mb-1">肌肉部位分類 *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MuscleCategory)}
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-sm text-[#382328] focus:outline-none focus:border-rose-400"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6e545a] mb-1">主要目標肌群 (選填)</label>
                  <input
                    type="text"
                    placeholder="例如: 股四頭肌、臀大肌"
                    value={targetMuscles}
                    onChange={(e) => setTargetMuscles(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-sm text-[#382328] focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#6e545a]">示範影片網址 (選填)</label>
                  <span className="text-[10px] text-rose-600">支援 GitHub raw/blob 或 MP4 連結</span>
                </div>
                <input
                  type="text"
                  placeholder="例如: https://github.com/user/repo/blob/main/squat.mp4 或 MP4 網址"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs text-[#382328] focus:outline-none focus:border-rose-400 font-mono"
                />

                {/* Quick Fill Sample Video Buttons */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-[#7c6368]">快捷帶入測試影片:</span>
                  <button
                    type="button"
                    onClick={() => setVideoUrl(SAMPLE_VIDEOS.squat)}
                    className="px-2 py-0.5 rounded-lg bg-[#f2e7d8] text-[10px] font-bold text-[#5c474b] hover:text-rose-600"
                  >
                    深蹲
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoUrl(SAMPLE_VIDEOS.deadlift)}
                    className="px-2 py-0.5 rounded-lg bg-[#f2e7d8] text-[10px] font-bold text-[#5c474b] hover:text-rose-600"
                  >
                    硬舉
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoUrl(SAMPLE_VIDEOS.shoulderPress)}
                    className="px-2 py-0.5 rounded-lg bg-[#f2e7d8] text-[10px] font-bold text-[#5c474b] hover:text-rose-600"
                  >
                    肩推
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6e545a] mb-1">動作要點 / 步驟說明</label>
                <textarea
                  rows={4}
                  placeholder="請列出預備姿勢、發力眉角與注意事項..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-xs text-[#382328] focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6e545a] hover:text-[#382328]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold shadow-md"
                >
                  {editingEx ? '儲存修改' : '確定新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
