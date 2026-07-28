import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { ConfirmModalState } from '../types';

interface ConfirmModalProps {
  state: ConfirmModalState;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ state, onClose }) => {
  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#fcf8f2] border border-rose-200 rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-150 text-[#382328]"
      >
        <div className="p-5 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-200 text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-extrabold text-[#382328]">{state.title}</h3>
            <p className="mt-1 text-sm text-[#6e545a] leading-relaxed">{state.message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#7c6368] hover:text-[#382328] hover:bg-[#f2e7d8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-3.5 bg-[#f7f0e6] border-t border-[#e2d5c5] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-[#6e545a] hover:text-[#382328] hover:bg-[#f5efe6] rounded-xl transition-colors"
          >
            {state.cancelText || '取消'}
          </button>
          <button
            type="button"
            onClick={() => {
              state.onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-extrabold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md transition-all active:scale-95"
          >
            {state.confirmText || '確認刪除'}
          </button>
        </div>
      </div>
    </div>
  );
};
