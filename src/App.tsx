import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { NotificationToast } from './components/common/NotificationToast';

// User Views
import { UserHome } from './components/user/UserHome';
import { MyTournaments } from './components/user/MyTournaments';
import { Wallet } from './components/user/Wallet';
import { Profile } from './components/user/Profile';
import { UserLogin } from './components/user/UserLogin';

// Admin Views
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminTournaments } from './components/admin/AdminTournaments';
import { AdminManageTournament } from './components/admin/AdminManageTournament';
import { AdminDeposits } from './components/admin/AdminDeposits';
import { AdminWithdrawals } from './components/admin/AdminWithdrawals';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminSettings } from './components/admin/AdminSettings';

// Code & Migration Tools
import { CodeExplorer } from './components/code/CodeExplorer';
import { DatabaseMigration } from './components/code/DatabaseMigration';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView } = useApp();
  const [deviceFrame, setDeviceFrame] = useState<boolean>(true);

  // Implement User Requirement: Disable text selection, right-click, and zoom
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent inspect / developer hotkeys
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S'))
      ) {
        e.preventDefault();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Disable pinch to zoom
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouch, { passive: false });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  const isUserView = activeView.startsWith('user_');
  const isAdminView = activeView.startsWith('admin_');
  const isCodeView = activeView === 'code_explorer';
  const isMigrationView = activeView === 'migration_runner';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Workspace Mode Switcher */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs">
              <i className="fa-solid fa-fire"></i>
            </div>
            <span className="font-extrabold text-xs uppercase tracking-wider text-white">
              Adept Play Esports Platform
            </span>
          </div>

          {/* Quick Mode Switches */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveView('user_home')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all ${
                isUserView
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <i className="fa-solid fa-mobile-screen"></i>
              <span>User Mobile App</span>
            </button>

            <button
              onClick={() => setActiveView('admin_dashboard')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all ${
                isAdminView
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <i className="fa-solid fa-shield-halved"></i>
              <span>Admin Control Panel</span>
            </button>

            <button
              onClick={() => setActiveView('code_explorer')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all ${
                isCodeView
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <i className="fa-solid fa-code"></i>
              <span>PHP Source Files</span>
            </button>

            <button
              onClick={() => setActiveView('migration_runner')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all ${
                isMigrationView
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <i className="fa-solid fa-database"></i>
              <span>DB Migration</span>
            </button>
          </div>

          {/* Toggle Mobile Phone Frame */}
          {isUserView && (
            <button
              onClick={() => setDeviceFrame(!deviceFrame)}
              className="hidden lg:flex items-center space-x-1 text-[11px] font-semibold text-slate-400 hover:text-amber-300 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg"
              title="Toggle mobile device frame"
            >
              <i className={`fa-solid ${deviceFrame ? 'fa-expand' : 'fa-mobile'}`}></i>
              <span>{deviceFrame ? 'Full Width' : 'Phone Frame'}</span>
            </button>
          )}
        </div>
      </div>

      <NotificationToast />

      {/* Main Content Render */}
      <div className="flex-1">
        {isUserView ? (
          <div className={deviceFrame ? 'max-w-md mx-auto min-h-[92vh] bg-slate-950 border-x border-slate-800/80 shadow-2xl relative' : 'w-full'}>
            <Header />
            {activeView === 'user_home' && <UserHome />}
            {activeView === 'user_tournaments' && <MyTournaments />}
            {activeView === 'user_wallet' && <Wallet />}
            {activeView === 'user_profile' && <Profile />}
            {activeView === 'user_login' && <UserLogin />}
            <BottomNav />
          </div>
        ) : isAdminView ? (
          <div>
            <AdminHeader />
            {activeView === 'admin_dashboard' && <AdminDashboard />}
            {activeView === 'admin_tournaments' && <AdminTournaments />}
            {activeView === 'admin_manage_tournament' && <AdminManageTournament />}
            {activeView === 'admin_deposits' && <AdminDeposits />}
            {activeView === 'admin_withdrawals' && <AdminWithdrawals />}
            {activeView === 'admin_users' && <AdminUsers />}
            {activeView === 'admin_settings' && <AdminSettings />}
          </div>
        ) : isCodeView ? (
          <CodeExplorer />
        ) : isMigrationView ? (
          <DatabaseMigration />
        ) : null}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
