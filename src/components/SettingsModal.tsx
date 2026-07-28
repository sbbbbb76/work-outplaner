import React, { useRef } from 'react';
import {
  X,
  Settings as SettingsIcon,
  ShieldCheck,
  Edit2,
  Users,
  Download,
  Upload,
  Smartphone,
  Database,
  Sliders,
  Layers,
} from 'lucide-react';
import { WorkoutPlan, Exercise, Client } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onOpenClientManager: () => void;
  plans: WorkoutPlan[];
  exercises: Exercise[];
  clients: Client[];
  onImportData: (data: { plans?: WorkoutPlan[]; exercises?: Exercise[]; clients?: Client[] }) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  onToggleEditMode,
  onOpenClientManager,
  plans,
  exercises,
  clients,
  onImportData,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Export Data as JSON file
  const handleExportBackup = () => {
    try {
      const backupData = {
        version: '1.5.0',
        exportedAt: new Date().toISOString(),
        plans,
        exercises,
        clients,
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weight_training_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast('備份檔案匯出成功！', 'success');
    } catch (err) {
      onShowToast('匯出失敗，請重試', 'error');
    }
  };

  // Import Data from JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid format');
        }

        onImportData({
          plans: Array.isArray(parsed.plans) ? parsed.plans : undefined,
          exercises: Array.isArray(parsed.exercises) ? parsed.exercises : undefined,
          clients: Array.isArray(parsed.clients) ? parsed.clients : undefined,
        });

        onShowToast('系統備份資料已成功匯入復原！', 'success');
        onClose();
      } catch (err) {
        onShowToast('讀取備份檔案失敗，請確認檔案格式為 JSON', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#fcf8f2] border border-rose-200 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-[#382328]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#fcf8f2]/95 backdrop-blur-md p-5 border-b border-[#e8dfd5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f2e7d8] border border-[#ded0be] flex items-center justify-center text-rose-500 shadow-sm">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#382328]">系統設定與操作模式</h3>
              <p className="text-xs text-[#7c6368]">切換寫入權限與管理系統資料擴充</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#f2e7d8] text-[#5c474b] hover:text-[#382328] hover:bg-[#ebdcc9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Section 1: Mode Switch */}
          <div className="bg-[#f7f0e6] border border-[#e2d5c5] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-bold text-[#382328]">全域模式切換 (Global Mode)</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isEditMode
                    ? 'bg-rose-500/10 text-rose-600 border border-rose-300'
                    : 'bg-[#eae0d2] text-[#7c6368] border border-[#d8cabb]'
                }`}
              >
                {isEditMode ? '編輯模式 EDIT' : '唯讀保護 READ-ONLY'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#fcf8f2] rounded-xl border border-[#e8dfd5]">
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#382328] flex items-center gap-2">
                  {isEditMode ? (
                    <>
                      <Edit2 className="w-4 h-4 text-rose-500" />
                      <span>開放全面編輯與建立內容</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#7c6368]" />
                      <span>唯讀保護模式 (防止誤觸修改)</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-[#7c6368] leading-normal">
                  {isEditMode
                    ? '已啟用編輯權限，您可以新增、刪除及修改訓練菜單與動作庫。'
                    : '已開啟防護模式，關閉主要介面修改功能，確保閱覽簡潔。'}
                </p>
              </div>

              <button
                type="button"
                onClick={onToggleEditMode}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isEditMode ? 'bg-rose-500' : 'bg-[#d0c2b2]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isEditMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Mobile usage tips */}
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl text-xs text-rose-900">
              <Smartphone className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="space-y-1 leading-relaxed">
                <strong className="font-bold block">📱 手機端操作提示</strong>
                <span>
                  手機使用者閱覽網頁時，進入具體訓練課表頁面點擊<strong>【編輯課表】</strong>，即可流暢進行課表細項異動與調整！
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Management & Data Operations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#6e545a] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-rose-500" />
              <span>系統擴充功能與資料管理</span>
            </h4>

            {/* Client Management Entry */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenClientManager();
              }}
              className="w-full flex items-center justify-between p-3.5 bg-[#f7f0e6] hover:bg-[#f2e7d8] border border-[#e2d5c5] rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#f2e7d8] flex items-center justify-center text-[#5c474b] group-hover:text-rose-500 transition-colors">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#382328]">學員資料清單管理</div>
                  <div className="text-[11px] text-[#7c6368]">建立專屬學員標籤與分類，目前已有 {clients.length} 位學員</div>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-200">
                開啟管理
              </span>
            </button>

            {/* Export Backup */}
            <button
              type="button"
              onClick={handleExportBackup}
              className="w-full flex items-center justify-between p-3.5 bg-[#f7f0e6] hover:bg-[#f2e7d8] border border-[#e2d5c5] rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#f2e7d8] flex items-center justify-center text-[#5c474b] group-hover:text-rose-500 transition-colors">
                  <Download className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#382328]">匯出系統完整備份 (JSON)</div>
                  <div className="text-[11px] text-[#7c6368]">包含 {plans.length} 個課表, {exercises.length} 個動作範本</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#5c474b] bg-[#f5efe6] px-2.5 py-1 rounded-lg border border-[#ded0be]">
                匯出備份
              </span>
            </button>

            {/* Import Backup */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-3.5 bg-[#f7f0e6] hover:bg-[#f2e7d8] border border-[#e2d5c5] rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#f2e7d8] flex items-center justify-center text-[#5c474b] group-hover:text-rose-500 transition-colors">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#382328]">匯入復原備份檔案</div>
                  <div className="text-[11px] text-[#7c6368]">選擇備份 JSON 檔案進行資料還原</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#5c474b] bg-[#f5efe6] px-2.5 py-1 rounded-lg border border-[#ded0be]">
                選擇檔案
              </span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            {/* Wipe Cloud Database Sample Data */}
            <button
              type="button"
              onClick={async () => {
                try {
                  const { wipeAllFirestoreCollections } = await import('../services/firebaseService');
                  await wipeAllFirestoreCollections();
                  onShowToast('已成功清理 Firebase 雲端資料庫所有舊資料！', 'success');
                } catch (err) {
                  onShowToast('清理雲端資料時失敗，請確認雲端存取權限', 'error');
                }
              }}
              className="w-full flex items-center justify-between p-3.5 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200 rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-rose-900">一鍵清空 Firebase 雲端所有舊資料</div>
                  <div className="text-[11px] text-rose-700">移除 Firebase Console 中的所有舊範本集合</div>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-200/60 px-2.5 py-1 rounded-lg border border-rose-300">
                一鍵清空
              </span>
            </button>
          </div>

          {/* Section 3: Status & Info */}
          <div className="pt-2 border-t border-[#e8dfd5] flex items-center justify-between text-[11px] text-[#7c6368]">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-rose-500" />
              <span>LocalStorage 本地自動儲存</span>
            </div>
            <span>Weight Training Planner v1.5</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f2e7d8]/60 border-t border-[#e8dfd5] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
          >
            完成設定
          </button>
        </div>
      </div>
    </div>
  );
};
