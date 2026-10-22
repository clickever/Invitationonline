"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  CreditCard, 
  Lock, 
  Check, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  Smartphone 
} from "lucide-react";
import { getAdminSettings, saveAdminSettings } from "@/lib/supabase/storage";
import { AdminSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [upiId, setUpiId] = useState("invitestudio@upi");
  const [payeeName, setPayeeName] = useState("InviteStudio Payments");
  const [defaultPrice, setDefaultPrice] = useState(1100);
  const [adminPin, setAdminPin] = useState("admin123");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const current = getAdminSettings();
    setUpiId(current.upiId || "invitestudio@upi");
    setDefaultPrice(current.defaultPrice || current.defaultPublicationPrice || 1100);
    setAdminPin(current.adminPin || "admin123");
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminSettings = {
      upiId: upiId.trim(),
      payeeName: payeeName.trim(),
      defaultPrice: Number(defaultPrice) || 1100,
      defaultPublicationPrice: Number(defaultPrice) || 1100,
      adminPin: adminPin.trim() || "admin123",
      updatedAt: new Date().toISOString(),
    };
    saveAdminSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Preview dynamic QR code URL
  const testUpiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${defaultPrice}&cu=INR&tn=${encodeURIComponent("Test Publication Payment")}`;
  const previewQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(testUpiUri)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">UPI & Admin Settings</h1>
        <p className="text-xs text-stone-400 mt-1">
          Configure your receiving UPI ID, business payee name, default invitation price, and security PIN.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="h-4 w-4" />
          <span>Settings saved successfully! All future customer checkouts will use your updated UPI ID and price.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Receiving UPI ID */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Receiving UPI ID (VPA) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. yourname@okhdfcbank or merchant@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[11px] text-stone-500 mt-1.5">
                All customer publication payments will be routed directly to this UPI address.
              </p>
            </div>

            {/* Payee Name */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Business / Payee Display Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. InviteStudio Events"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[11px] text-stone-500 mt-1.5">
                Shown to customers inside Google Pay, PhonePe, and Paytm during scan.
              </p>
            </div>

            {/* Default Price */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Default Publication Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[11px] text-stone-500 mt-1.5">
                Standard charge per invitation publication (Current standard: ₹1,100).
              </p>
            </div>

            {/* Admin Security PIN */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Admin Console Security PIN *
              </label>
              <input
                type="password"
                required
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[11px] text-stone-500 mt-1.5">
                Used to unlock this admin dashboard. Keep this PIN safe.
              </p>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-stone-800 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-gold hover:bg-amber-500 transition active:scale-95"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Live UPI Preview Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 text-center space-y-4 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-3">
              <QrCode className="h-3.5 w-3.5" />
              <span>Live Checkout Preview</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Dynamic UPI QR</h3>
            <p className="text-xs text-stone-400 mt-1 mb-4">
              Real-time QR generated for ₹{defaultPrice} to {upiId}
            </p>

            <div className="p-3 bg-white rounded-2xl inline-block shadow-md border border-stone-200 mx-auto">
              <img
                src={previewQrUrl}
                alt="UPI Preview QR"
                className="w-40 h-40 mx-auto object-contain"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800 space-y-2 text-left">
            <div className="text-[11px] text-stone-400">
              <strong className="text-stone-300">UPI Protocol:</strong> NPCI Standard
            </div>
            <div className="text-[11px] text-stone-400 truncate">
              <strong className="text-stone-300">VPA:</strong> {upiId}
            </div>
            <div className="text-[11px] text-stone-400 truncate">
              <strong className="text-stone-300">Payee:</strong> {payeeName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
