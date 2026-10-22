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
  Smartphone,
  Eye,
  EyeOff,
  Globe,
  Zap,
  AlertCircle
} from "lucide-react";
import { getAdminSettings, saveAdminSettings } from "@/lib/supabase/storage";
import { AdminSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  // UPI
  const [upiId, setUpiId] = useState("invitestudio@upi");
  const [payeeName, setPayeeName] = useState("InviteStudio Payments");
  const [upiEnabled, setUpiEnabled] = useState(true);

  // Active Gateway Strategy
  const [activeGateway, setActiveGateway] = useState<'upi' | 'phonepe' | 'razorpay' | 'all'>('upi');

  // PhonePe
  const [phonepeEnabled, setPhonepeEnabled] = useState(false);
  const [phonepeMerchantId, setPhonepeMerchantId] = useState("");
  const [phonepeSaltKey, setPhonepeSaltKey] = useState("");
  const [phonepeSaltIndex, setPhonepeSaltIndex] = useState("1");
  const [phonepeEnv, setPhonepeEnv] = useState<'UAT' | 'PRODUCTION'>('UAT');
  const [showPhonepeSalt, setShowPhonepeSalt] = useState(false);

  // Razorpay
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("");
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);

  // General & Security
  const [defaultPrice, setDefaultPrice] = useState(1100);
  const [adminPin, setAdminPin] = useState("Nithin@fxodigital");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const current = getAdminSettings();
    setUpiId(current.upiId || "invitestudio@upi");
    setPayeeName(current.payeeName || "InviteStudio Payments");
    setUpiEnabled(current.upiEnabled !== false);
    setDefaultPrice(current.defaultPrice || current.defaultPublicationPrice || 1100);
    setAdminPin(current.adminPin || "Nithin@fxodigital");

    setActiveGateway(current.activeGateway || 'upi');
    setPhonepeEnabled(!!current.phonepeEnabled);
    setPhonepeMerchantId(current.phonepeMerchantId || "");
    setPhonepeSaltKey(current.phonepeSaltKey || "");
    setPhonepeSaltIndex(current.phonepeSaltIndex || "1");
    setPhonepeEnv(current.phonepeEnv || 'UAT');

    setRazorpayEnabled(!!current.razorpayEnabled);
    setRazorpayKeyId(current.razorpayKeyId || "");
    setRazorpayKeySecret(current.razorpayKeySecret || "");
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminSettings = {
      upiId: upiId.trim(),
      payeeName: payeeName.trim(),
      upiEnabled,
      defaultPrice: Number(defaultPrice) || 1100,
      defaultPublicationPrice: Number(defaultPrice) || 1100,
      adminPin: adminPin.trim() || "Nithin@fxodigital",
      activeGateway,
      phonepeEnabled,
      phonepeMerchantId: phonepeMerchantId.trim(),
      phonepeSaltKey: phonepeSaltKey.trim(),
      phonepeSaltIndex: phonepeSaltIndex.trim() || "1",
      phonepeEnv,
      razorpayEnabled,
      razorpayKeyId: razorpayKeyId.trim(),
      razorpayKeySecret: razorpayKeySecret.trim(),
      updatedAt: new Date().toISOString(),
    };
    saveAdminSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Preview dynamic QR code URL
  const testUpiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${defaultPrice}&cu=INR&tn=${encodeURIComponent("Test Publication Payment")}`;
  const previewQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(testUpiUri)}`;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Payment Gateways & Settings</h1>
        <p className="text-xs text-stone-400 mt-1">
          Configure direct UPI transfers, PhonePe PG, Razorpay PG, and default invitation publication pricing.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="h-4 w-4 shrink-0" />
          <span>Settings and gateway credentials saved successfully! All customer checkouts will immediately reflect these options.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Active Gateway Selector */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif text-base font-bold">Active Customer Checkout Gateway</h3>
              </div>
              <p className="text-[11px] text-stone-400">
                Choose which payment method is presented to your customers during invitation publication.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {[
                  { id: "upi", name: "Direct UPI", desc: "QR Scan & UTR" },
                  { id: "phonepe", name: "PhonePe PG", desc: "Cards, UPI, Netbanking" },
                  { id: "razorpay", name: "Razorpay PG", desc: "Instant Checkout" },
                  { id: "all", name: "All Gateways", desc: "Customer Picks" },
                ].map((gw) => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setActiveGateway(gw.id as any)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      activeGateway === gw.id
                        ? "border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/30"
                        : "border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700"
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-0.5">{gw.name}</div>
                    <div className="text-[10px] text-stone-500">{gw.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Direct UPI Settings */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Smartphone className="w-4 h-4 text-amber-500" />
                  <h3 className="font-serif text-base font-bold">Direct UPI Configuration (Zero Fees)</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={upiEnabled}
                    onChange={(e) => setUpiEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              <div className="space-y-4 pt-1">
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
                </div>

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
                </div>
              </div>
            </div>

            {/* 3. PhonePe Gateway Configuration */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <h3 className="font-serif text-base font-bold">PhonePe Payment Gateway</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={phonepeEnabled}
                    onChange={(e) => setPhonepeEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <p className="text-[11px] text-stone-400">
                Collect payments seamlessly via Credit/Debit Cards, Net Banking, and PhonePe Wallet.
              </p>

              <div className="space-y-4 pt-1">
                {/* Environment Mode */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-stone-300">Environment:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPhonepeEnv('UAT')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        phonepeEnv === 'UAT'
                          ? "bg-purple-600 text-white"
                          : "bg-stone-800 text-stone-400 hover:text-white"
                      }`}
                    >
                      UAT / Sandbox (Test)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhonepeEnv('PRODUCTION')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        phonepeEnv === 'PRODUCTION'
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-800 text-stone-400 hover:text-white"
                      }`}
                    >
                      Production (Live)
                    </button>
                  </div>
                </div>

                {/* Merchant ID */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    PhonePe Merchant ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PGTESTPAYUAT or M22..."
                    value={phonepeMerchantId}
                    onChange={(e) => setPhonepeMerchantId(e.target.value)}
                    className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs font-mono text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Salt Key & Index */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Salt Key
                    </label>
                    <div className="relative">
                      <input
                        type={showPhonepeSalt ? "text" : "password"}
                        placeholder="e.g. 099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
                        value={phonepeSaltKey}
                        onChange={(e) => setPhonepeSaltKey(e.target.value)}
                        className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 pr-10 text-xs font-mono text-white focus:border-purple-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPhonepeSalt(!showPhonepeSalt)}
                        className="absolute right-3 top-2.5 text-stone-500 hover:text-white"
                      >
                        {showPhonepeSalt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Salt Index
                    </label>
                    <input
                      type="text"
                      placeholder="1"
                      value={phonepeSaltIndex}
                      onChange={(e) => setPhonepeSaltIndex(e.target.value)}
                      className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs font-mono text-center text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Razorpay Gateway Configuration */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <h3 className="font-serif text-base font-bold">Razorpay Payment Gateway</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={razorpayEnabled}
                    onChange={(e) => setRazorpayEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <p className="text-[11px] text-stone-400">
                Support Visa, MasterCard, RuPay, UPI, Netbanking, and International Cards with instant settlements.
              </p>

              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Razorpay Key ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. rzp_live_xxxxxxxx or rzp_test_xxxxxxxx"
                    value={razorpayKeyId}
                    onChange={(e) => setRazorpayKeyId(e.target.value)}
                    className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Razorpay Key Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showRazorpaySecret ? "text" : "password"}
                      placeholder="e.g. xxxxxxxxxxxxxxxxxxxxxxxx"
                      value={razorpayKeySecret}
                      onChange={(e) => setRazorpayKeySecret(e.target.value)}
                      className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 pr-10 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRazorpaySecret(!showRazorpaySecret)}
                      className="absolute right-3 top-2.5 text-stone-500 hover:text-white"
                    >
                      {showRazorpaySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Pricing & Security PIN */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Lock className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif text-base font-bold">Pricing & Admin Console Security</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <p className="text-[10px] text-stone-500 mt-1">
                    Standard fee per invitation published (₹1,100).
                  </p>
                </div>

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
                  <p className="text-[10px] text-stone-500 mt-1">
                    Used to authenticate at /admin-login.
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-stone-800 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-8 py-3 text-xs font-bold text-white shadow-gold hover:bg-amber-500 transition active:scale-95"
                >
                  Save All Settings & Gateways
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Live Preview & Status Column */}
        <div className="space-y-6">
          {/* Gateway Status Summary Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-white">Payment Readiness</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-white">Direct UPI</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${upiEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-stone-800 text-stone-500"}`}>
                  {upiEnabled ? "Active" : "Disabled"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">PhonePe PG</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${phonepeEnabled && phonepeMerchantId ? "bg-purple-500/20 text-purple-400" : "bg-stone-800 text-stone-500"}`}>
                  {phonepeEnabled && phonepeMerchantId ? `${phonepeEnv} Ready` : "Inactive"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white">Razorpay PG</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${razorpayEnabled && razorpayKeyId ? "bg-blue-500/20 text-blue-400" : "bg-stone-800 text-stone-500"}`}>
                  {razorpayEnabled && razorpayKeyId ? "Configured" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic UPI QR Preview */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 text-center space-y-4">
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
    </div>
  );
}
