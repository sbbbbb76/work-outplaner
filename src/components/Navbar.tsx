import React from 'react';
import { Dumbbell, LayoutDashboard, Library, PlusCircle, ShieldCheck, Edit2, ArrowLeft, FileEdit, Eye, Settings } from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'library' | 'editor' | 'viewer';
  onSelectTab: (tab: 'dashboard' | 'library' | 'editor' | 'viewer') => void;
  onNewPlan: () => void;
  isEditMode: boolean;
  onOpenSettings: () => void;
  isHidden?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onNewPlan,
  isEditMode,
  onOpenSettings,
  isHidden = false,
}) => {
  if (isHidden) {
    return (
      <header className="sticky top-0 z-40 bg-[#fdf2f4]/95 backdrop-blur-md border-b border-rose-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 overflow-hidden">
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer group shrink min-w-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shrink-0">
              <Dumbbell className="w-4 h-4 font-bold" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#382328] group-hover:text-rose-600 transition-colors truncate">
              Weight Training Planner
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-300 transition-all shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">進入儀表板</span>
            <span className="xs:hidden">總覽</span>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-[#fdf2f4]/90 backdrop-blur-md border-b border-rose-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4 overflow-hidden">
        {/* Brand / Logo */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md sm:shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <h1 className="text-xs sm:text-base font-extrabold tracking-tight text-[#382328] group-hover:text-rose-600 transition-colors truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none">
                Weight Training Planner
              </h1>
              {isEditMode ? (
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-300 shrink-0">
                  <Edit2 className="w-2.5 h-2.5" /> 編輯模式
                </span>
              ) : (
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f5efe6] text-[#7c6368] border border-[#e3d7c9] shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5 text-[#7c6368]" /> 唯讀保護
                </span>
              )}
            </div>
            <p className="hidden sm:block text-[11px] text-[#7c6368] font-medium truncate">
              重訓菜單與教學管理平台
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'dashboard'
                ? 'bg-[#f7f0e6] text-rose-600 border border-[#e2d5c5] shadow-sm font-bold'
                : 'text-[#6e545a] hover:text-[#382328] hover:bg-rose-100/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">儀表板</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('library')}
            className={`flex items-center gap-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'library'
                ? 'bg-[#f7f0e6] text-rose-600 border border-[#e2d5c5] shadow-sm font-bold'
                : 'text-[#6e545a] hover:text-[#382328] hover:bg-rose-100/50'
            }`}
          >
            <Library className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">動作庫</span>
          </button>

          {currentTab === 'editor' && (
            <button
              type="button"
              onClick={() => onSelectTab('editor')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#f7f0e6] text-rose-600 border border-[#e2d5c5] shadow-sm font-bold"
            >
              <FileEdit className="w-4 h-4" />
              <span>編輯中</span>
            </button>
          )}

          {currentTab === 'viewer' && (
            <button
              type="button"
              onClick={() => onSelectTab('viewer')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#f7f0e6] text-rose-600 border border-[#e2d5c5] shadow-sm font-bold"
            >
              <Eye className="w-4 h-4" />
              <span>預覽中</span>
            </button>
          )}

          {/* Settings button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#f7f0e6] hover:bg-[#f2e7d8] text-[#382328] border border-[#e2d5c5] transition-all active:scale-95"
            title="系統設定與寫入模式"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
            <span className="hidden xs:inline">設定</span>
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={onNewPlan}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">新增計畫</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
