import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AdminSettings: React.FC = () => {
  const { settings, updateAdminSettings } = useApp();

  const [upiId, setUpiId] = useState<string>(settings.upi_id);
  const [qrUrl, setQrUrl] = useState<string>(settings.qr_image_url);
  const [appName, setAppName] = useState<string>(settings.app_name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings(upiId, qrUrl, appName);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setQrUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDynamicQr = () => {
    if (!upiId) {
      alert('Please enter a UPI ID first.');
      return;
    }
    const dynamic = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(appName)}&cu=INR`)}`;
    setQrUrl(dynamic);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Payment & UPI Settings (admin/settings.php)</h2>
          <p className="text-xs text-slate-400">Manage the official QR code and UPI ID shown to users when adding money</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Preview Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center space-y-3 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Live Deposit QR Preview</h3>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <img 
              src={qrUrl || settings.qr_image_url} 
              alt="UPI QR Preview" 
              className="w-44 h-44 mx-auto rounded-xl border border-slate-700 shadow-md bg-white p-1 object-contain"
            />
            <p className="text-xs font-mono font-bold text-amber-300 mt-2">{upiId || 'your-upi-id@bank'}</p>
            <p className="text-[10px] text-slate-500">{appName}</p>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            This QR code is fetched directly from the <code className="text-amber-300 font-mono text-[10px]">settings</code> table by the user's wallet modal.
          </p>
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <i className="fa-solid fa-gear text-amber-400"></i>
            <span>Update UPI Configuration</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin UPI ID (VPA) <span className="text-red-400">*</span>
              </label>
              <input 
                type="text" 
                required 
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. adeptplay@upi or merchant@oksbi" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">Users will manually send money to this UPI ID.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                1. Upload QR Code Image from Device
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">Upload a screenshot/export of your official GPay, PhonePe, or Paytm QR.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">
                  2. Or QR Image URL / Auto-Generator
                </label>
                <button
                  type="button"
                  onClick={generateDynamicQr}
                  className="text-[10px] text-amber-400 font-bold hover:underline"
                >
                  Auto-Generate Dynamic QR
                </button>
              </div>
              <input 
                type="text" 
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                placeholder="https://..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">App Brand Name</label>
              <input 
                type="text" 
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              Save Settings & Update QR Code
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
