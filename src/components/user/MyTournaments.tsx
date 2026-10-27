import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const MyTournaments: React.FC = () => {
  const { tournaments, participants, currentUser, setActiveView, showToast } = useApp();
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');

  const userJoinedTournaments = tournaments.filter(t => 
    participants.some(p => p.tournament_id === t.id && p.user_id === currentUser.id)
  );

  const upcomingMatches = userJoinedTournaments.filter(t => t.status !== 'Completed');
  const completedMatches = userJoinedTournaments.filter(t => t.status === 'Completed');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'success');
  };

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-24 space-y-4">
      {/* Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
        <button
          onClick={() => setTab('upcoming')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            tab === 'upcoming'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Upcoming / Live ({upcomingMatches.length})
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            tab === 'completed'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Completed ({completedMatches.length})
        </button>
      </div>

      {tab === 'upcoming' ? (
        <div className="space-y-4">
          {upcomingMatches.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <i className="fa-solid fa-gamepad text-4xl text-slate-600"></i>
              <h4 className="text-sm font-bold text-white">No active match entries</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                You have not registered for any upcoming matches yet. Browse tournaments to get started.
              </p>
              <button
                onClick={() => setActiveView('user_home')}
                className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-2xl text-xs uppercase tracking-wider"
              >
                Browse Tournaments
              </button>
            </div>
          ) : (
            upcomingMatches.map(t => (
              <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-slate-800 text-amber-400 text-[10px] font-bold rounded-lg border border-amber-500/20">
                    {t.game_name}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    t.status === 'Live' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    ● {t.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-white">{t.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    <i className="fa-regular fa-clock text-amber-400 mr-1"></i>
                    {new Date(t.match_time).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Room ID & Password Display Card */}
                <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-3.5 space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                      <i className="fa-solid fa-door-open text-amber-400"></i>
                      <span>Room ID:</span>
                    </span>
                    {t.room_id ? (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-extrabold text-amber-300">{t.room_id}</span>
                        <button 
                          onClick={() => copyToClipboard(t.room_id, 'Room ID')}
                          className="text-slate-400 hover:text-amber-300 text-xs active:scale-95"
                        >
                          <i className="fa-regular fa-copy"></i>
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Revealed 15 mins before match</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-2">
                    <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                      <i className="fa-solid fa-key text-amber-400"></i>
                      <span>Password:</span>
                    </span>
                    {t.room_password ? (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-extrabold text-amber-300">{t.room_password}</span>
                        <button 
                          onClick={() => copyToClipboard(t.room_password, 'Room Password')}
                          className="text-slate-400 hover:text-amber-300 text-xs active:scale-95"
                        >
                          <i className="fa-regular fa-copy"></i>
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Revealed 15 mins before match</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                  <span>Prize Pool: <strong className="text-emerald-400">₹{t.prize_pool}</strong></span>
                  <span>Entry: <strong className="text-amber-400">₹{t.entry_fee}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {completedMatches.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-2">
              <i className="fa-solid fa-trophy text-4xl text-slate-600"></i>
              <h4 className="text-sm font-bold text-white">No match history</h4>
              <p className="text-xs text-slate-500">Your completed match results and trophies will appear here.</p>
            </div>
          ) : (
            completedMatches.map(t => {
              const isWinner = t.winner_user_id === currentUser.id;
              return (
                <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.game_name}</span>
                    {isWinner ? (
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] rounded-full flex items-center space-x-1 shadow-md shadow-amber-500/20 animate-bounce">
                        <i className="fa-solid fa-crown"></i> <span>CHAMPION / WINNER</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 font-semibold text-[10px] rounded-full">
                        Participated
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-white">{t.title}</h4>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs flex justify-between items-center">
                    <span className="text-slate-400">
                      Winner: <strong className="text-amber-300">{t.winner_username || 'Declared'}</strong>
                    </span>
                    <span className="text-slate-400">
                      Prize: <strong className="text-emerald-400">₹{t.prize_pool}</strong>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </main>
  );
};
