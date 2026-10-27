import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const UserHome: React.FC = () => {
  const { tournaments, participants, currentUser, joinTournament, setActiveView } = useApp();
  const [selectedGame, setSelectedGame] = useState<string>('All');
  const [joinModalTournament, setJoinModalTournament] = useState<number | null>(null);

  const games = ['All', 'BGMI', 'Free Fire MAX', 'COD Mobile'];

  const filteredTournaments = tournaments.filter(t => {
    if (t.status === 'Completed') return false;
    if (selectedGame === 'All') return true;
    return t.game_name.toLowerCase().includes(selectedGame.toLowerCase());
  });

  const getJoinedCount = (tId: number) => participants.filter(p => p.tournament_id === tId).length;
  const isJoined = (tId: number) => participants.some(p => p.tournament_id === tId && p.user_id === currentUser.id);

  const activeModalT = tournaments.find(t => t.id === joinModalTournament);

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-24 space-y-4">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-5 shadow-xl text-white">
        <div className="relative z-10 space-y-1">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Tournaments Active</span>
          </span>
          <h2 className="text-xl font-black tracking-tight leading-tight">Daily Esports Battles</h2>
          <p className="text-xs text-amber-100 font-medium">Win real cash prizes with instant UPI withdrawals</p>
        </div>
        <i className="fa-solid fa-trophy absolute -right-2 -bottom-4 text-8xl text-white/10 transform rotate-12 pointer-events-none"></i>
      </div>

      {/* Game Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {games.map(game => (
          <button
            key={game}
            onClick={() => setSelectedGame(game)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedGame === game
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {game}
          </button>
        ))}
      </div>

      {/* Tournament Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
            <i className="fa-solid fa-fire text-amber-400"></i>
            <span>Available Matches</span>
          </h3>
          <span className="text-[11px] text-slate-400">{filteredTournaments.length} Matches</span>
        </div>

        {filteredTournaments.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-2">
            <i className="fa-solid fa-gamepad text-4xl text-slate-600"></i>
            <p className="text-sm text-slate-300 font-bold">No tournaments found</p>
            <p className="text-xs text-slate-500">Switch game filter or check back in a few minutes.</p>
          </div>
        ) : (
          filteredTournaments.map(t => {
            const joined = isJoined(t.id);
            const count = getJoinedCount(t.id);
            return (
              <div 
                key={t.id} 
                className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/80 rounded-3xl overflow-hidden shadow-xl transition-all duration-200"
              >
                {/* Card Header */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-slate-800 text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
                      {t.game_name}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 ${
                      t.status === 'Live'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{t.status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-white leading-snug">{t.title}</h4>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                      <span><i className="fa-regular fa-clock text-amber-400 mr-1"></i>{new Date(t.match_time).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span><i className="fa-solid fa-users text-slate-500 mr-1"></i>{count} Joined</span>
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/90 text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Prize Pool</p>
                      <p className="text-base font-black text-emerald-400">₹{t.prize_pool.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="border-l border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Entry Fee</p>
                      <p className="text-base font-black text-amber-400">₹{t.entry_fee.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Card Action */}
                  {joined ? (
                    <button
                      onClick={() => setActiveView('user_tournaments')}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-400 font-bold rounded-2xl text-xs flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Already Joined (View Room Details)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setJoinModalTournament(t.id)}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
                    >
                      <i className="fa-solid fa-bolt"></i>
                      <span>Join Now (₹{t.entry_fee})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Join Confirmation Modal */}
      {activeModalT && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                <i className="fa-solid fa-shield-halved text-amber-400"></i>
                <span>Confirm Registration</span>
              </h3>
              <button 
                onClick={() => setJoinModalTournament(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">{activeModalT.title}</h4>
              <p className="text-xs text-slate-400">Game: <strong className="text-amber-300">{activeModalT.game_name}</strong></p>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Entry Fee:</span>
                <span className="font-bold text-amber-300">₹{activeModalT.entry_fee}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Your Current Balance:</span>
                <span className="font-bold text-white">₹{currentUser.wallet_balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                <span>Balance After Joining:</span>
                <span className={currentUser.wallet_balance >= activeModalT.entry_fee ? 'text-emerald-400' : 'text-red-400'}>
                  ₹{(currentUser.wallet_balance - activeModalT.entry_fee).toFixed(2)}
                </span>
              </div>
            </div>

            {currentUser.wallet_balance < activeModalT.entry_fee ? (
              <div className="space-y-2">
                <p className="text-xs text-red-400 text-center font-medium">
                  Insufficient balance. Add funds via UPI to join!
                </p>
                <button
                  onClick={() => {
                    setJoinModalTournament(null);
                    setActiveView('user_wallet');
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs uppercase"
                >
                  <i className="fa-solid fa-circle-plus mr-1"></i> Add Money Now
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  joinTournament(activeModalT.id);
                  setJoinModalTournament(null);
                }}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                Confirm & Pay ₹{activeModalT.entry_fee}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
