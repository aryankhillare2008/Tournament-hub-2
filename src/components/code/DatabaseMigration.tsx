import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const DatabaseMigration: React.FC = () => {
  const { resetDatabase, showToast } = useApp();
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  const runSafeMigration = () => {
    setMigrationStatus('running');
    setTimeout(() => {
      setMigrationStatus('success');
      showToast('Database updated successfully! `deposits`, `withdrawals` created and `users.upi_id` added.', 'success');
    }, 800);
  };

  const runFullInstall = () => {
    if (confirm('This will wipe all existing data and create fresh tables with admin credentials. Continue?')) {
      resetDatabase();
      setMigrationStatus('installed');
      showToast('Full installation complete: 8 tables created, default admin (admin / admin123) seeded.', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
        <h2 className="text-xl font-black text-white">Database Operations & Safe Migration Suite</h2>
        <p className="text-xs text-slate-400">
          Simulate executing MySQL queries for <code className="text-amber-300 font-mono text-xs">update_database.php</code> and <code className="text-amber-300 font-mono text-xs">install.php</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Safe update_database.php Runner */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
              <i className="fa-solid fa-shield-check"></i>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Safe Migration (update_database.php)</h3>
              <p className="text-[11px] text-emerald-400">Safe update without erasing existing data</p>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
            <p className="text-slate-500">// Executed queries:</p>
            <p className="text-emerald-300">✓ CREATE TABLE IF NOT EXISTS `deposits` (...)</p>
            <p className="text-emerald-300">✓ CREATE TABLE IF NOT EXISTS `withdrawals` (...)</p>
            <p className="text-emerald-300">✓ CREATE TABLE IF NOT EXISTS `settings` (...)</p>
            <p className="text-emerald-300">✓ ALTER TABLE `users` ADD COLUMN `upi_id` ...</p>
          </div>

          <button
            onClick={runSafeMigration}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            Execute Safe update_database.php
          </button>
        </div>

        {/* 2. Full install.php Runner */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
              <i className="fa-solid fa-database"></i>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Fresh Install (install.php)</h3>
              <p className="text-[11px] text-amber-400">Initial Setup & Clean Seed</p>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
            <p className="text-slate-500">// Schema setup:</p>
            <p className="text-amber-300">✓ CREATE DATABASE adept_play</p>
            <p className="text-amber-300">✓ 8 Complete DB Tables created</p>
            <p className="text-amber-300">✓ Admin seeded (admin / admin123)</p>
            <p className="text-amber-300">✓ Default UPI QR initialized</p>
          </div>

          <button
            onClick={runFullInstall}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-black rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95"
          >
            Execute Fresh install.php
          </button>
        </div>
      </div>

      {migrationStatus && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center space-y-2 animate-in fade-in duration-200">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl">
            ✓
          </div>
          <h4 className="text-sm font-bold text-white">
            {migrationStatus === 'success' 
              ? '✅ Database schema updated successfully! You can now safely delete update_database.php'
              : '✅ Full installation complete and default admin created!'}
          </h4>
          <p className="text-xs text-slate-400">
            Database tables are synchronized with your UPI deposits, withdrawals, and tournament engine.
          </p>
        </div>
      )}
    </div>
  );
};
