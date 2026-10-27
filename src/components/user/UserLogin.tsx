import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const UserLogin: React.FC = () => {
  const { userLogin, userSignup, setActiveView } = useApp();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Login inputs
  const [loginUser, setLoginUser] = useState<string>('AryanGamer');
  const [loginPass, setLoginPass] = useState<string>('password123');

  // Signup inputs
  const [signupUser, setSignupUser] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPass, setSignupPass] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userLogin(loginUser)) {
      setActiveView('user_home');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (userSignup(signupUser, signupEmail)) {
      setActiveView('user_home');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-2 text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <i className="fa-solid fa-gamepad text-2xl"></i>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Adept Play</h2>
          <p className="text-xs text-slate-400">Play Daily Esports Tournaments & Win Cash</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'login' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'signup' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Username or Email</label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-3.5 top-3.5 text-slate-500 text-xs"></i>
                <input
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="AryanGamer or shadow@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3.5 top-3.5 text-slate-500 text-xs"></i>
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              Login to Play <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Username</label>
              <input
                type="text"
                required
                value={signupUser}
                onChange={(e) => setSignupUser(e.target.value)}
                placeholder="e.g. ApexLegend99"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
              <input
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="gamer@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={signupPass}
                onChange={(e) => setSignupPass(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-400 flex items-center space-x-1.5">
              <i className="fa-solid fa-gift"></i>
              <span>Get ₹50 Sign-up Bonus directly in your wallet!</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              Sign Up & Claim ₹50 <i className="fa-solid fa-bolt ml-1"></i>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
