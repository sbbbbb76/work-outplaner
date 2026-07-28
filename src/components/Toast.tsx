import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[10001] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md animate-in slide-in-from-top-3 fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-[#fcf8f2] border-rose-300 text-[#382328]'
              : toast.type === 'error'
              ? 'bg-[#fff0f2] border-rose-400 text-rose-950'
              : 'bg-[#f7f0e6] border-[#e2d5c5] text-[#382328]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-rose-500 shrink-0" />}

          <span className="text-sm font-bold flex-1">{toast.text}</span>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-[#eae0d2] transition-opacity"
          >
            <X className="w-4 h-4 text-[#382328]" />
          </button>
        </div>
      ))}
    </div>
  );
};
