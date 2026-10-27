import React from 'react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { 
    users, 
    tournaments, 
    transactions, 
    deposits, 
    withdrawals, 
    participants,
    setActiveView, 
    setSelectedTournamentId 
  } = useApp();

  const totalUsers = users.length;
  const totalTournaments = tournaments.length;
  const prizeDistributed = transactions
    .filter(t => t.type === 'credit' && t.description.toLowerCase().includes('prize money'))
    .reduce((acc, t) => acc + t.amount, 0);

  // Calculate estimated platform commission
  const totalCommission = tournaments.reduce((acc, t) => {
    const pCount = participants.filter(p => p.tournament_id === t.id).length;
    const pool = t.entry_fee * pCount;
    return acc + (pool * (t.commission_percent / 100));
  }, 0);

  const pendingDeposits = deposits.filter(d => d.status === 'Pending').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'Pending').length;

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Admin Operations Dashboard</h2>
          <p className="text-xs text-slate-400">Live platform metrics, payment verifications & match controls</p>
        </div>
        <button
          onClick={() => setActiveView('admin_tournaments')}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Create Tournament</span>
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
          <h3 className="text-2xl font-black text-white mt-1">{totalUsers}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tournaments</p>
          <h3 className="text-2xl font-black text-amber-400 mt-1">{totalTournaments}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prize Distributed</p>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">₹{prizeDistributed.toFixed(2)}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Revenue</p>
          <h3 className="text-2xl font-black text-cyan-400 mt-1">₹{totalCommission.toFixed(2)}</h3>
        </div>
      </div>

      {/* Action Cards: Pending Deposits & Withdrawals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => setActiveView('admin_deposits')}
          className={`cursor-pointer rounded-3xl p-5 border transition-all ${
            pendingDeposits > 0 
              ? 'bg-amber-950/20 border-amber-500/50 hover:border-amber-400' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          } flex items-center justify-between shadow-lg`}
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
              <i className="fa-solid fa-qrcode"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Manual UPI Deposits</h4>
              <p className="text-xs text-slate-400">Verify user transaction UTR & approve</p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black text-xs rounded-full">
            {pendingDeposits} Pending
          </span>
        </div>

        <div 
          onClick={() => setActiveView('admin_withdrawals')}
          className={`cursor-pointer rounded-3xl p-5 border transition-all ${
            pendingWithdrawals > 0 
              ? 'bg-emerald-950/20 border-emerald-500/50 hover:border-emerald-400' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          } flex items-center justify-between shadow-lg`}
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
              <i className="fa-solid fa-money-bill-transfer"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Withdrawal Payouts</h4>
              <p className="text-xs text-slate-400">Send money to user UPI ID</p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-full">
            {pendingWithdrawals} Pending
          </span>
        </div>
      </div>

      {/* Recent Tournaments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Recent Tournaments</h3>
          <button 
            onClick={() => setActiveView('admin_tournaments')}
            className="text-xs text-amber-400 font-bold hover:underline"
          >
            Manage All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400 uppercase">
              <tr>
                <th className="py-2.5">Tournament</th>
                <th className="py-2.5">Game</th>
                <th className="py-2.5">Entry/Prize</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tournaments.slice(0, 5).map(t => (
                <tr key={t.id}>
                  <td className="py-3 font-semibold text-white">{t.title}</td>
                  <td className="py-3 text-amber-400 font-bold">{t.game_name}</td>
                  <td className="py-3">₹{t.entry_fee} / ₹{t.prize_pool}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === 'Live' ? 'bg-red-500/20 text-red-400' : (t.status === 'Completed' ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/20 text-emerald-400')
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedTournamentId(t.id);
                        setActiveView('admin_manage_tournament');
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg font-bold text-[11px]"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
