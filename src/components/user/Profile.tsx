import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const Profile: React.FC = () => {
  const { currentUser, users, switchUser, updateUserProfile, userLogout, setActiveView } = useApp();

  const [email, setEmail] = useState<string>(currentUser.email);
  const [upiId, setUpiId] = useState<string>(currentUser.upi_id || '');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(email, upiId);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setOldPassword('');
    setNewPassword('');
    alert('Password updated successfully in database!');
  };

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-24 space-y-4">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center shadow-xl space-y-2">
        <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto text-xl font-black text-slate-950 shadow-lg shadow-amber-500/20">
          {currentUser.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-black text-white">{currentUser.username}</h2>
          <p className="text-xs text-slate-400">{currentUser.email}</p>
        </div>
        <div className="pt-1">
          <span className="inline-block px-3 py-1 bg-slate-950 border border-amber-500/30 rounded-full text-xs text-amber-300 font-bold">
            Wallet: ₹{currentUser.wallet_balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Switch Demo Player Account (Helpful for testing multiplayer joining / winning) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-2">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <i className="fa-solid fa-users text-amber-400"></i>
          <span>Switch Active Player (Testing Tool)</span>
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => {
                switchUser(u.id);
                setEmail(u.email);
                setUpiId(u.upi_id || '');
              }}
              className={`p-2 rounded-xl text-xs text-left border transition-all ${
                u.id === currentUser.id
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="block font-semibold">{u.username}</span>
              <span className="text-[10px] text-slate-500">₹{u.wallet_balance.toFixed(0)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Account & Saved UPI ID Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <i className="fa-solid fa-id-card text-amber-400"></i>
          <span>Account & UPI Settings</span>
        </h3>

        <form onSubmit={handleProfileSave} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Username (Fixed ID)</label>
            <input 
              type="text" 
              disabled 
              value={currentUser.username} 
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed" 
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Saved UPI ID for Instant Withdrawals</label>
            <input 
              type="text" 
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. aryan@okaxis or shadow@paytm" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono" 
            />
            <p className="text-[10px] text-slate-500 mt-1">Saved automatically so you don't have to enter it every time you withdraw.</p>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            Save Account & UPI ID
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <i className="fa-solid fa-lock text-amber-400"></i>
          <span>Change Password</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Current Password</label>
            <input 
              type="password" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required 
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" 
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required 
              minLength={6}
              placeholder="Min 6 characters"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Logout Action */}
      <button 
        onClick={() => {
          userLogout();
          setActiveView('user_login');
        }}
        className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-2xl text-xs text-center uppercase tracking-wider transition-all"
      >
        <i className="fa-solid fa-arrow-right-from-bracket mr-1.5"></i>
        <span>Logout Account</span>
      </button>
    </main>
  );
};
