import React from 'react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { currentUser, setActiveView, userAuthToken } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div 
          onClick={() => setActiveView('user_home')} 
          className="flex items-center space-x-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <i className="fa-solid fa-gamepad text-sm"></i>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Adept Play
            </h1>
            <p className="text-[9px] text-slate-400 -mt-0.5 font-medium tracking-wide">Esports Arena</p>
          </div>
        </div>

        {userAuthToken ? (
          <button
            onClick={() => setActiveView('user_wallet')}
            className="flex items-center space-x-2 bg-slate-950/80 hover:bg-slate-800 border border-amber-500/30 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-inner"
          >
            <i className="fa-solid fa-wallet text-amber-400 text-xs"></i>
            <span className="text-xs font-bold text-amber-300">
              ₹{currentUser.wallet_balance.toFixed(2)}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setActiveView('user_login')}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};
