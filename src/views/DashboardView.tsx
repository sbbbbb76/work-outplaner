import React, { useState, useRef } from 'react';
import { WorkoutPlan, Client } from '../types';
import { getPlanShareUrl, copyToClipboard } from '../utils/clipboardUtils';
import {
  Search,
  Plus,
  Users,
  Share2,
  Edit,
  Trash2,
  Dumbbell,
  ChevronRight,
  Filter,
  Flame,
  Camera,
  X,
  Check,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';

interface DashboardViewProps {
  plans: WorkoutPlan[];
  clients: Client[];
  selectedClientId: string | null;
  onSelectClientFilter: (clientId: string | null) => void;
  onOpenClientManager: () => void;
  onViewPlan: (planId: string) => void;
  onEditPlan: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  onCreatePlan: () => void;
  isEditMode: boolean;
  heroBannerUrl?: string;
  onUpdateHeroBanner?: (url: string) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

const PRESET_BANNERS = [
  {
    id: 'b1',
    name: '經典重訓力量',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'b2',
    name: '啞鈴槓鈴器材',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'b3',
    name: '粉柔美學健身房',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'b4',
    name: '極簡現代場館',
    url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'b5',
    name: '有氧美學工作室',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  plans,
  clients,
  selectedClientId,
  onSelectClientFilter,
  onOpenClientManager,
  onViewPlan,
  onEditPlan,
  onDeletePlan,
  onCreatePlan,
  isEditMode,
  heroBannerUrl = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
  onUpdateHeroBanner,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [tempBannerUrl, setTempBannerUrl] = useState(heroBannerUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter plans based on selected client filter tag and search query
  const filteredPlans = plans.filter((plan) => {
    const matchesClient =
      selectedClientId === null
        ? true
        : selectedClientId === 'unassigned'
        ? !plan.clientId
        : plan.clientId === selectedClientId;

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      plan.title.toLowerCase().includes(query) ||
      plan.description.toLowerCase().includes(query) ||
      plan.tags.some((t) => t.toLowerCase().includes(query));

    return matchesClient && matchesSearch;
  });

  const handleShare = async (plan: WorkoutPlan, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getPlanShareUrl(plan.id);
    const success = await copyToClipboard(url);
    if (success) {
      onShowToast(`已成功複製《${plan.title}》分享連結！`, 'success');
    } else {
      onShowToast('複製失敗，請手動複製網址', 'error');
    }
  };

  const getClientById = (clientId?: string) => clients.find((c) => c.id === clientId);

  // Handle local file upload for banner
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('請選擇圖檔格式 (.jpg, .png, .webp)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setTempBannerUrl(result);
        onShowToast('圖片載入成功，請點擊「套用變更」存檔', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyBanner = () => {
    if (onUpdateHeroBanner) {
      onUpdateHeroBanner(tempBannerUrl);
      onShowToast('橫幅圖片已成功更新！', 'success');
    }
    setIsBannerModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Hero Image Block (Customizable in Edit Mode) */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-200/80 shadow-lg bg-[#fcf8f2] group h-48 sm:h-56 lg:h-64">
        {/* Banner Image */}
        <img
          src={heroBannerUrl}
          alt="Workout Training Banner"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a171b]/80 via-[#2a171b]/20 to-transparent flex flex-col justify-between p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-xs font-bold shadow-sm">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Weight Training Planner</span>
            </span>

            {/* Custom Banner Button (Only visible in Edit Mode) */}
            {isEditMode && (
              <button
                type="button"
                onClick={() => {
                  setTempBannerUrl(heroBannerUrl);
                  setIsBannerModalOpen(true);
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#fcf8f2]/90 hover:bg-[#ffffff] text-rose-800 font-bold text-xs shadow-md backdrop-blur-md border border-rose-200 transition-all active:scale-95"
              >
                <Camera className="w-4 h-4 text-rose-500" />
                <span>自訂橫幅圖片</span>
              </button>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
              重訓課表與動作教學管理
            </h2>
            <p className="text-xs sm:text-sm text-rose-100/90 font-medium drop-shadow-sm">
              個人化課表排定、影片示範無縫串接與學員資料管理
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Client Scroll Filter Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6e545a]">
            <Filter className="w-3.5 h-3.5 text-rose-500" />
            <span>依學員分類過濾菜單</span>
          </div>
          <button
            onClick={onOpenClientManager}
            className="text-xs text-rose-600 hover:text-rose-700 hover:underline font-bold"
          >
            + 管理學員
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-rose-200">
          <button
            type="button"
            onClick={() => onSelectClientFilter(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedClientId === null
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-[#f7f0e6] border border-[#e2d5c5] text-[#4a363a] hover:bg-[#f2e7d8]'
            }`}
          >
            全部菜單 ({plans.length})
          </button>

          {clients.map((client) => {
            const count = plans.filter((p) => p.clientId === client.id).length;
            const isSelected = selectedClientId === client.id;
            return (
              <button
                key={client.id}
                type="button"
                onClick={() => onSelectClientFilter(client.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-[#f7f0e6] border border-[#e2d5c5] text-[#4a363a] hover:bg-[#f2e7d8]'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${client.avatarColor}`} />
                <span>{client.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#eae0d2] text-[#6e545a]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onSelectClientFilter('unassigned')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedClientId === 'unassigned'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-[#f7f0e6] border border-[#e2d5c5] text-[#4a363a] hover:bg-[#f2e7d8]'
            }`}
          >
            一般範本 ({plans.filter((p) => !p.clientId).length})
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7176]" />
          <input
            type="text"
            placeholder="搜尋計畫名稱、關鍵字標籤..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f7f0e6] border border-[#e2d5c5] rounded-xl text-sm text-[#382328] placeholder-[#9c8489] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/30 transition-all"
          />
        </div>

        <div className="text-xs text-[#6e545a] flex items-center justify-between sm:justify-end gap-4">
          <span>
            共 <strong className="text-rose-600 font-extrabold">{filteredPlans.length}</strong> 個訓練計畫
          </span>

          {isEditMode && (
            <button
              type="button"
              onClick={onCreatePlan}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>新增計畫</span>
            </button>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#fcf8f2] border border-dashed border-[#e2d5c5] rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#f2e7d8] flex items-center justify-center mx-auto text-rose-500">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#382328]">未找到符合條件的訓練計畫</h3>
          <p className="text-xs text-[#7c6368] max-w-sm mx-auto">
            嘗試切換學員過濾或搜尋關鍵字，或者點擊下方按鈕建立新菜單。
          </p>
          {isEditMode && (
            <button
              type="button"
              onClick={onCreatePlan}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> 立即新增菜單
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan) => {
            const assignedClient = getClientById(plan.clientId);

            return (
              <div
                key={plan.id}
                onClick={() => onViewPlan(plan.id)}
                className="group relative bg-[#fcf8f2] border border-[#e8dfd5] hover:border-rose-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header Tag / Client */}
                  <div className="flex items-center justify-between gap-2">
                    {assignedClient ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2e7d8] border border-[#ded0be] text-xs font-bold text-[#382328]">
                        <span className={`w-2 h-2 rounded-full ${assignedClient.avatarColor}`} />
                        <span className="truncate max-w-[120px]">{assignedClient.name}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-[#f5efe6] border border-[#e3d7c9] text-[11px] font-medium text-[#7c6368]">
                        一般菜單範本
                      </span>
                    )}

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        plan.difficulty === '初階'
                          ? 'bg-sky-500/10 text-sky-700 border border-sky-300/60'
                          : plan.difficulty === '中階'
                          ? 'bg-amber-500/10 text-amber-800 border border-amber-300/60'
                          : 'bg-rose-500/10 text-rose-700 border border-rose-300/60'
                      }`}
                    >
                      {plan.difficulty}
                    </span>
                  </div>

                  {/* Plan Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-[#382328] group-hover:text-rose-600 transition-colors line-clamp-1">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-[#6e545a] line-clamp-2 mt-1 leading-relaxed">
                      {plan.description || '暫無計畫詳細描述'}
                    </p>
                  </div>

                  {/* Exercise Count & Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs text-[#382328] font-semibold bg-[#f2e7d8] px-2.5 py-1 rounded-lg border border-[#ded0be]">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      {plan.exercises.length} 個訓練動作
                    </span>

                    {plan.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-[#7c6368] bg-[#f5efe6] border border-[#e3d7c9] px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="pt-3 border-t border-[#e8dfd5] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleShare(plan, e)}
                      className="p-2 rounded-xl bg-[#f2e7d8] text-[#5c474b] hover:text-rose-600 hover:bg-[#ebdcc9] transition-colors"
                      title="複製分享連結"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {isEditMode && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditPlan(plan.id);
                          }}
                          className="p-2 rounded-xl bg-[#f2e7d8] text-[#5c474b] hover:text-rose-600 hover:bg-[#ebdcc9] transition-colors"
                          title="編輯計畫"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePlan(plan.id);
                          }}
                          className="p-2 rounded-xl bg-[#f2e7d8] text-[#7c6368] hover:text-rose-600 hover:bg-[#ebdcc9] transition-colors"
                          title="刪除計畫"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                    查看菜單 <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Banner Customization Modal (Only in Edit Mode) */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#fcf8f2] border border-rose-200 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-[#382328]">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#fcf8f2]/95 backdrop-blur-md p-5 border-b border-[#e8dfd5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#f2e7d8] border border-[#ded0be] flex items-center justify-center text-rose-500 shadow-sm">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#382328]">自訂頂部橫幅圖片</h3>
                  <p className="text-xs text-[#7c6368]">選擇風格範本或上傳您專屬的健身主題圖片</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="p-2 rounded-xl bg-[#f2e7d8] text-[#5c474b] hover:text-[#382328] hover:bg-[#ebdcc9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Preview Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6e545a] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                  <span>目前預覽效果</span>
                </label>
                <div className="relative rounded-2xl overflow-hidden h-32 border border-[#e8dfd5] bg-slate-900 shadow-inner">
                  <img src={tempBannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white drop-shadow">Weight Training Planner 橫幅</span>
                  </div>
                </div>
              </div>

              {/* Preset Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#6e545a] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                  <span>精選主題圖片範本</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESET_BANNERS.map((preset) => {
                    const isSelected = tempBannerUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setTempBannerUrl(preset.url)}
                        className={`relative rounded-xl overflow-hidden h-20 border text-left transition-all group ${
                          isSelected
                            ? 'ring-2 ring-rose-500 border-rose-500 shadow-md'
                            : 'border-[#e8dfd5] hover:border-rose-300'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors p-2 flex flex-col justify-end">
                          <span className="text-[10px] font-bold text-white drop-shadow truncate">
                            {preset.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Local File or Enter URL */}
              <div className="space-y-4 pt-2 border-t border-[#e8dfd5]">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#6e545a] flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-rose-500" />
                    <span>從裝置上傳圖片檔</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#f2e7d8] hover:bg-[#ebdcc9] border border-[#ded0be] text-xs font-bold text-[#382328] flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Upload className="w-4 h-4 text-rose-500" />
                    <span>選擇電腦/手機圖片上傳</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#6e545a] flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-rose-500" />
                    <span>輸入網路圖片網址 (Image URL)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={tempBannerUrl}
                    onChange={(e) => setTempBannerUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#f7f0e6] border border-[#e2d5c5] rounded-xl text-xs text-[#382328] placeholder-[#9c8489] focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#f2e7d8]/60 border-t border-[#e8dfd5] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  setTempBannerUrl(
                    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80'
                  )
                }
                className="px-3 py-2 rounded-xl text-xs font-bold text-[#7c6368] hover:text-[#382328] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重設預設</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#f5efe6] hover:bg-[#eae0d2] text-[#5c474b] font-bold text-xs border border-[#e3d7c9] transition-all"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleApplyBanner}
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
                >
                  套用變更
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
