import React from 'react';
import { useApp } from '../../context/AppContext';

export const AdminHeader: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  const navLinks = [
    { id: 'admin_dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'admin_tournaments', label: 'Tournaments', icon: 'fa-trophy' },
    { id: 'admin_deposits', label: 'Deposits', icon: 'fa-qrcode' },
    { id: 'admin_withdrawals', label: 'Withdrawals', icon: 'fa-money-bill-transfer' },
    { id: 'admin_users', label: 'Users', icon: 'fa-users' },
    { id: 'admin_settings', label: 'UPI Settings', icon: 'fa-gear' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div 
          onClick={() => setActiveView('admin_dashboard')}
          className="flex items-center space-x-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <i className="fa-solid fa-crown text-sm"></i>
          </div>
          <div>
            <h1 className="font-black text-sm tracking-wider uppercase text-white">Adept Admin</h1>
            <p className="text-[9px] text-amber-400 font-bold -mt-0.5">Control Suite</p>
          </div>
        </div>

        {/* Desktop Admin Nav */}
        <nav className="hidden md:flex items-center space-x-1 text-xs font-bold">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveView(link.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeView === link.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Switch back to User View */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveView('user_home')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
          >
            <i className="fa-solid fa-mobile-screen text-amber-400"></i>
            <span>User App</span>
          </button>
        </div>
      </div>
    </header>
  );
};
