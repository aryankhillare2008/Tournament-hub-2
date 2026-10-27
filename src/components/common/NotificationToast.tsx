import React from 'react';
import { useApp } from '../../context/AppContext';

export const NotificationToast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300';
      case 'error':
        return 'bg-red-950/90 border-red-500/40 text-red-300';
      case 'warning':
        return 'bg-amber-950/90 border-amber-500/40 text-amber-300';
      default:
        return 'bg-slate-900/90 border-cyan-500/40 text-cyan-300';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return 'fa-circle-check';
      case 'error':
        return 'fa-circle-xmark';
      case 'warning':
        return 'fa-triangle-exclamation';
      default:
        return 'fa-circle-info';
    }
  };

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
      <div className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl text-xs font-semibold ${getStyle()}`}>
        <i className={`fa-solid ${getIcon()} text-sm shrink-0`}></i>
        <span className="leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};
