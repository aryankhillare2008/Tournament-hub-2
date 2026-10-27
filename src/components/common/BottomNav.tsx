import React from 'react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  const navItems = [
    { id: 'user_home', label: 'Home', icon: 'fa-house' },
    { id: 'user_tournaments', label: 'Matches', icon: 'fa-trophy' },
    { id: 'user_wallet', label: 'Wallet', icon: 'fa-wallet' },
    { id: 'user_profile', label: 'Profile', icon: 'fa-user' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 py-2">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <i className={`fa-solid ${item.icon} text-lg mb-1`}></i>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full"></span>
                )}
              </div>
              <span className="text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
