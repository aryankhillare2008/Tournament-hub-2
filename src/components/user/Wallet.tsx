import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AppSettings } from '../../types';

export const Wallet: React.FC = () => {
  const { 
    currentUser, 
    settings: contextSettings, 
    transactions, 
    deposits, 
    withdrawals, 
    submitDepositRequest, 
    submitWithdrawalRequest,
    setActiveView,
    showToast 
  } = useApp();

  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);

  // Admin UPI Details state (fetched from DB / persistent settings)
  const [adminSettings, setAdminSettings] = useState<AppSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Deposit form state
  const [depositAmount, setDepositAmount] = useState<string>('100');
  const [depositTxnId, setDepositTxnId] = useState<string>('');

  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState<string>('100');
  const [withdrawUpiId, setWithdrawUpiId] = useState<string>(currentUser.upi_id || '');

  // Fetch Admin UPI details from DB/storage whenever modal opens or settings change
  const fetchAdminUpiDetails = () => {
    setIsLoadingSettings(true);
    setSettingsError(null);

    try {
      // Simulate database fetch: query `SELECT * FROM settings WHERE id = 1`
      const savedSettings = localStorage.getItem('adept_settings');
      let currentData: AppSettings;
      
      if (savedSettings) {
        currentData = JSON.parse(savedSettings);
      } else {
        currentData = contextSettings;
      }

      if (!currentData || !currentData.upi_id || currentData.upi_id.trim() === '') {
        setSettingsError('Admin UPI ID is not configured yet in Admin Settings.');
        setAdminSettings(null);
      } else {
        setAdminSettings(currentData);
      }
    } catch (err) {
      console.error('Error fetching admin UPI details:', err);
      setSettingsError('Failed to fetch payment details from the database.');
    } finally {
      setIsLoadingSettings(false);
    }
  };

  useEffect(() => {
    if (showDepositModal) {
      fetchAdminUpiDetails();
    }
  }, [showDepositModal, contextSettings]);

  const userTransactions = transactions.filter(t => t.user_id === currentUser.id);
  const userPendingDeposits = deposits.filter(d => d.user_id === currentUser.id && d.status === 'Pending');
  const userPendingWithdrawals = withdrawals.filter(w => w.user_id === currentUser.id && w.status === 'Pending');

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!depositTxnId.trim()) {
      showToast('Please enter the UPI Transaction ID (UTR)', 'error');
      return;
    }
    if (submitDepositRequest(amt, depositTxnId)) {
      setShowDepositModal(false);
      setDepositTxnId('');
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (submitWithdrawalRequest(amt, withdrawUpiId)) {
      setShowWithdrawModal(false);
    }
  };

  const copyUpi = () => {
    if (!adminSettings?.upi_id) return;
    navigator.clipboard.writeText(adminSettings.upi_id);
    setCopiedUpi(true);
    showToast('Admin UPI ID copied to clipboard!', 'success');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-24 space-y-4">
      {/* Wallet Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center space-x-1.5">
            <i className="fa-solid fa-shield-halved"></i>
            <span>Gaming Wallet</span>
          </span>
          <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-500/30">
            INR (₹)
          </span>
        </div>

        <div className="mb-5">
          <p className="text-xs text-slate-400 font-medium">Available Balance</p>
          <h2 className="text-3xl font-black text-white tracking-tight mt-0.5">
            ₹{currentUser.wallet_balance.toFixed(2)}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowDepositModal(true)}
            className="py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-circle-plus text-sm"></i>
            <span>Add Money</span>
          </button>
          <button
            onClick={() => {
              setWithdrawUpiId(currentUser.upi_id || '');
              setShowWithdrawModal(true);
            }}
            className="py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-arrow-up-from-bracket text-sm"></i>
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Pending Requests Alert */}
      {(userPendingDeposits.length > 0 || userPendingWithdrawals.length > 0) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
            <i className="fa-solid fa-hourglass-half"></i>
            <span>Pending Requests Under Verification</span>
          </h4>
          {userPendingDeposits.map(d => (
            <div key={d.id} className="flex justify-between items-center text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="font-semibold text-white">Deposit Request</span>
                <span className="block text-[10px] text-slate-400 font-mono">UTR: {d.transaction_id}</span>
              </div>
              <span className="font-bold text-emerald-400">+₹{d.amount.toFixed(2)} (Pending)</span>
            </div>
          ))}
          {userPendingWithdrawals.map(w => (
            <div key={w.id} className="flex justify-between items-center text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="font-semibold text-white">Withdrawal Request</span>
                <span className="block text-[10px] text-slate-400 font-mono">To: {w.upi_id}</span>
              </div>
              <span className="font-bold text-amber-400">-₹{w.amount.toFixed(2)} (Processing)</span>
            </div>
          ))}
        </div>
      )}

      {/* Transaction History */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center space-x-2">
          <i className="fa-solid fa-clock-rotate-left text-amber-400"></i>
          <span>Transaction Ledger</span>
        </h3>

        <div className="space-y-2">
          {userTransactions.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500">
              No transactions recorded yet.
            </div>
          ) : (
            userTransactions.map(txn => (
              <div 
                key={txn.id}
                className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${
                    txn.type === 'credit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    <i className={`fa-solid ${txn.type === 'credit' ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-snug">{txn.description}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(txn.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-black ${
                  txn.type === 'credit' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 1. ADD MONEY MODAL (Fetches Admin UPI Details from Database) */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                <i className="fa-solid fa-qrcode text-amber-400"></i>
                <span>Scan & Pay via UPI</span>
              </h3>
              <button 
                onClick={() => setShowDepositModal(false)} 
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close Modal"
              >
                ✕
              </button>
            </div>

            {/* Fetching Status & Display */}
            {isLoadingSettings ? (
              <div className="py-8 text-center space-y-2">
                <i className="fa-solid fa-circle-notch fa-spin text-amber-400 text-2xl"></i>
                <p className="text-xs text-slate-400">Fetching Admin UPI details from database...</p>
              </div>
            ) : settingsError ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center space-y-3">
                <i className="fa-solid fa-circle-exclamation text-red-400 text-2xl"></i>
                <p className="text-xs text-red-300 font-semibold">{settingsError}</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowDepositModal(false);
                    setActiveView('admin_settings');
                  }}
                  className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase"
                >
                  Configure in Admin Settings
                </button>
              </div>
            ) : (
              <>
                {/* QR Code & Admin UPI Card */}
                <div className="text-center space-y-2.5 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
                  <div className="relative inline-block mx-auto">
                    <img 
                      src={adminSettings?.qr_image_url || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=adeptplay@upi&pn=AdeptPlayEsports&cu=INR'} 
                      alt="Admin UPI QR Code" 
                      className="w-44 h-44 mx-auto rounded-xl border border-slate-700 shadow-md bg-white p-1 object-contain"
                    />
                    <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                      VERIFIED UPI
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    Scan with PhonePe, Google Pay, Paytm, or BHIM
                  </p>
                  
                  {/* Copyable Admin UPI ID */}
                  <div className="bg-slate-900 border border-amber-500/30 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
                    <div className="text-left overflow-hidden mr-2">
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Admin UPI ID</span>
                      <span className="font-mono text-amber-300 font-bold truncate block">
                        {adminSettings?.upi_id}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={copyUpi}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                        copiedUpi 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                      }`}
                    >
                      <i className={`fa-regular ${copiedUpi ? 'fa-check' : 'fa-copy'}`}></i>
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Amount Selectors */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Select Quick Amount</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {quickAmounts.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt.toString())}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          depositAmount === amt.toString()
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deposit Submission Form */}
                <form onSubmit={handleDepositSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Amount Paid (₹)</label>
                    <input 
                      type="number" 
                      min="10" 
                      step="1" 
                      required 
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="e.g. 100" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      UPI Transaction ID / 12-Digit UTR <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={depositTxnId}
                      onChange={(e) => setDepositTxnId(e.target.value)}
                      placeholder="e.g. 42910398214" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Check your payment receipt in PhonePe / GPay under &ldquo;UTR&rdquo; or &ldquo;UPI Ref No.&rdquo;
                    </p>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    Submit Deposit Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                <i className="fa-solid fa-money-bill-transfer text-amber-400"></i>
                <span>Withdraw to UPI</span>
              </h3>
              <button 
                onClick={() => setShowWithdrawModal(false)} 
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close Modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Amount to Withdraw (₹)</label>
                <input 
                  type="number" 
                  min="50" 
                  max={currentUser.wallet_balance}
                  step="1" 
                  required 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Min ₹50" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Available: ₹{currentUser.wallet_balance.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Your Destination UPI ID</label>
                <input 
                  type="text" 
                  required 
                  value={withdrawUpiId}
                  onChange={(e) => setWithdrawUpiId(e.target.value)}
                  placeholder="e.g. mobile@paytm or upi@oksbi" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">Money will be transferred directly to this address.</p>
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                Request ₹{withdrawAmount} Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
