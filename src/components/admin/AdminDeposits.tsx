import React from 'react';
import { useApp } from '../../context/AppContext';

export const AdminDeposits: React.FC = () => {
  const { deposits, approveDeposit, rejectDeposit } = useApp();

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Manual UPI Deposit Requests</h2>
          <p className="text-xs text-slate-400">Verify user-submitted 12-digit UTR/Txn ID with your bank/UPI notification</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400 uppercase">
              <tr>
                <th className="py-2.5">User</th>
                <th className="py-2.5">Amount (₹)</th>
                <th className="py-2.5">Transaction ID / UTR</th>
                <th className="py-2.5">Timestamp</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {deposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No deposit requests logged.
                  </td>
                </tr>
              ) : (
                deposits.map(d => (
                  <tr key={d.id}>
                    <td className="py-3.5">
                      <span className="font-bold text-white block">{d.username}</span>
                      <span className="text-[10px] text-slate-500 font-mono">ID: #{d.user_id}</span>
                    </td>
                    <td className="py-3.5 font-black text-emerald-400 text-sm">₹{d.amount.toFixed(2)}</td>
                    <td className="py-3.5">
                      <div className="inline-flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-amber-300 font-bold">
                        <span>{d.transaction_id}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(d.transaction_id);
                            alert('Copied UTR: ' + d.transaction_id);
                          }}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          <i className="fa-regular fa-copy text-[10px]"></i>
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-400 text-[11px]">
                      {new Date(d.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === 'Pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : d.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {d.status === 'Pending' ? (
                        <div className="inline-flex space-x-2">
                          <button
                            onClick={() => approveDeposit(d.id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all active:scale-95"
                          >
                            Approve (+₹{d.amount})
                          </button>
                          <button
                            onClick={() => rejectDeposit(d.id)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-lg text-xs transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] font-semibold">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
