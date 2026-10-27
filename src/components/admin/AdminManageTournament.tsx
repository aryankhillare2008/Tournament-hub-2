import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TournamentStatus } from '../../types';

export const AdminManageTournament: React.FC = () => {
  const { 
    tournaments, 
    selectedTournamentId, 
    participants, 
    users, 
    updateRoomCredentials, 
    declareWinner, 
    setActiveView 
  } = useApp();

  const tournament = tournaments.find(t => t.id === selectedTournamentId) || tournaments[0];

  const [roomId, setRoomId] = useState<string>(tournament?.room_id || '');
  const [roomPassword, setRoomPassword] = useState<string>(tournament?.room_password || '');
  const [status, setStatus] = useState<TournamentStatus>(tournament?.status || 'Upcoming');
  const [selectedWinnerId, setSelectedWinnerId] = useState<string>('');

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-white">Tournament not found.</p>
        <button onClick={() => setActiveView('admin_tournaments')} className="mt-3 text-amber-400 text-xs">
          Back to Tournaments
        </button>
      </div>
    );
  }

  const tournamentParticipants = participants.filter(p => p.tournament_id === tournament.id);

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    updateRoomCredentials(tournament.id, roomId, roomPassword, status);
  };

  const handleDeclareWinner = (e: React.FormEvent) => {
    e.preventDefault();
    const wId = parseInt(selectedWinnerId);
    if (!wId) {
      alert('Please select a winning player from the participants.');
      return;
    }
    declareWinner(tournament.id, wId);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => setActiveView('admin_tournaments')}
            className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Tournaments</span>
          </button>
          <h2 className="text-xl font-black text-white mt-1">{tournament.title}</h2>
          <p className="text-xs text-slate-400">Game: {tournament.game_name} | Prize: ₹{tournament.prize_pool} | Entry: ₹{tournament.entry_fee}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          tournament.status === 'Completed' ? 'bg-slate-800 text-slate-400' : (tournament.status === 'Live' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400')
        }`}>
          {tournament.status}
        </span>
      </div>

      {/* Grid: Room Info & Winner Declaration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Room Credentials Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <i className="fa-solid fa-key"></i>
            <span>Room Credentials</span>
          </h3>

          <form onSubmit={handleSaveRoom} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Room ID</label>
              <input 
                type="text" 
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="e.g. ROOM-89421" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Room Password</label>
              <input 
                type="text" 
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                placeholder="e.g. adept99pass" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tournament Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as TournamentStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Upcoming">Upcoming (Hidden Credentials)</option>
                <option value="Live">Live (Room Credentials Visible to Participants)</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Save Room Credentials
            </button>
          </form>
        </div>

        {/* 2. Winner Declaration */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
            <i className="fa-solid fa-trophy"></i>
            <span>Declare Match Winner</span>
          </h3>

          {tournament.status === 'Completed' ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-2">
              <i className="fa-solid fa-crown text-3xl text-amber-400"></i>
              <h4 className="text-sm font-bold text-emerald-400">Tournament Completed</h4>
              <p className="text-xs text-slate-300">
                Winner: <strong className="text-white">{tournament.winner_username || 'Player'}</strong>
              </p>
              <p className="text-[11px] text-slate-400">Prize money of ₹{tournament.prize_pool} was automatically credited to wallet.</p>
            </div>
          ) : (
            <form onSubmit={handleDeclareWinner} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Winning Player</label>
                <select 
                  value={selectedWinnerId}
                  onChange={(e) => setSelectedWinnerId(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Winner from Participants --</option>
                  {tournamentParticipants.map(p => {
                    const u = users.find(user => user.id === p.user_id);
                    return (
                      <option key={p.id} value={p.user_id}>
                        {u?.username || `User #${p.user_id}`} (Joined at {new Date(p.joined_at).toLocaleTimeString()})
                      </option>
                    );
                  })}
                </select>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Clicking declare winner will credit <strong className="text-emerald-400 font-bold">₹{tournament.prize_pool}</strong> to the winner's wallet and close the tournament.
              </p>
              <button 
                type="submit" 
                disabled={tournamentParticipants.length === 0}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
              >
                Declare Winner & Distribute Prize
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Registered Participants ({tournamentParticipants.length})
        </h3>
        {tournamentParticipants.length === 0 ? (
          <p className="text-xs text-slate-500">No participants have joined yet.</p>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {tournamentParticipants.map((p, idx) => {
              const u = users.find(user => user.id === p.user_id);
              return (
                <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 text-slate-500 font-mono">#{idx + 1}</span>
                    <div>
                      <p className="font-bold text-white">{u?.username || `User #${p.user_id}`}</p>
                      <p className="text-[10px] text-slate-500">{u?.email || 'Registered Player'}</p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    Joined: {new Date(p.joined_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
