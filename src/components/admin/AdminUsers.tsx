import React from 'react';
import { useApp } from '../../context/AppContext';

export const AdminUsers: React.FC = () => {
  const { users, participants, transactions, toggleUserBlock } = useApp();

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Registered Users</h2>
          <p className="text-xs text-slate-400">View user wallets, match participation & account status</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400 uppercase">
              <tr>
                <th className="py-2.5">User</th>
                <th className="py-2.5">Email</th>
                <th className="py-2.5">Saved UPI ID</th>
                <th className="py-2.5">Wallet Balance</th>
                <th className="py-2.5">Matches</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map(u => {
                const matchCount = participants.filter(p => p.user_id === u.id).length;
                return (
                  <tr key={u.id}>
                    <td className="py-3.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-xs">
                          {u.username.charAt(0)}
                        </div>
                        <span className="font-bold text-white">{u.username}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-400">{u.email}</td>
                    <td className="py-3.5 font-mono text-cyan-300">{u.upi_id || '<Not set>'}</td>
                    <td className="py-3.5 font-black text-amber-400 text-sm">₹{u.wallet_balance.toFixed(2)}</td>
                    <td className="py-3.5">{matchCount}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.is_blocked ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {u.is_blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => toggleUserBlock(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          u.is_blocked
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {u.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
