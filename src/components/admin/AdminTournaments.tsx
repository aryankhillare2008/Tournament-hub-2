import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AdminTournaments: React.FC = () => {
  const { tournaments, participants, createTournament, deleteTournament, setSelectedTournamentId, setActiveView } = useApp();

  const [title, setTitle] = useState<string>('');
  const [gameName, setGameName] = useState<string>('BGMI');
  const [entryFee, setEntryFee] = useState<string>('50');
  const [prizePool, setPrizePool] = useState<string>('2000');
  const [matchTime, setMatchTime] = useState<string>('2026-10-08T20:00');
  const [commission, setCommission] = useState<string>('20');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTournament({
      title,
      game_name: gameName,
      entry_fee: parseFloat(entryFee) || 0,
      prize_pool: parseFloat(prizePool) || 0,
      match_time: matchTime.replace('T', ' ') + ':00',
      commission_percent: parseInt(commission) || 20,
      room_id: '',
      room_password: '',
      status: 'Upcoming'
    });
    setTitle('');
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Manage Esports Tournaments</h2>
      </div>

      {/* Create Tournament Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
          <i className="fa-solid fa-plus-circle"></i>
          <span>Create New Tournament</span>
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">Tournament Title</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. BGMI Erangel Clash Solo #99" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Game</label>
            <select 
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="BGMI">BGMI (Battlegrounds Mobile India)</option>
              <option value="Free Fire MAX">Free Fire MAX</option>
              <option value="COD Mobile">Call of Duty: Mobile</option>
              <option value="Valorant">Valorant Mobile</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Match Date & Time</label>
            <input 
              type="datetime-local" 
              required 
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Entry Fee (₹)</label>
            <input 
              type="number" 
              min="0" 
              required 
              value={entryFee}
              onChange={(e) => setEntryFee(e.target.value)}
              placeholder="50" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Prize Pool (₹)</label>
            <input 
              type="number" 
              min="0" 
              required 
              value={prizePool}
              onChange={(e) => setPrizePool(e.target.value)}
              placeholder="2000" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Commission (%)</label>
            <input 
              type="number" 
              min="0" 
              max="100" 
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500" 
            />
          </div>

          <div className="flex items-end">
            <button 
              type="submit" 
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
            >
              Publish Tournament
            </button>
          </div>
        </form>
      </div>

      {/* Tournaments List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">All Tournaments ({tournaments.length})</h3>
        <div className="space-y-3">
          {tournaments.map(t => {
            const pCount = participants.filter(p => p.tournament_id === t.id).length;
            return (
              <div key={t.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 bg-slate-800 text-amber-400 text-[10px] font-bold rounded">{t.game_name}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      t.status === 'Live' ? 'bg-red-500/20 text-red-400' : (t.status === 'Completed' ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/20 text-emerald-400')
                    }`}>{t.status}</span>
                    <span className="text-[11px] text-slate-400"><i className="fa-solid fa-users mr-1"></i>{pCount} Players</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{t.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Match Time: {new Date(t.match_time).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} | Fee: ₹{t.entry_fee} | Prize: ₹{t.prize_pool}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTournamentId(t.id);
                      setActiveView('admin_manage_tournament');
                    }}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Manage & Declare Winner
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this tournament?')) {
                        deleteTournament(t.id);
                      }
                    }}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};
