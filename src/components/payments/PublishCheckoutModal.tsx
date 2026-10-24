"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  X, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  Check, 
  Copy, 
  QrCode, 
  Smartphone, 
  ShieldCheck, 
  ExternalLink, 
  Share2, 
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Zap
} from "lucide-react";
import { Invitation, PaymentRecord, UserProfile } from "@/lib/types";
import { 
  getCurrentUser, 
  registerUser, 
  loginUser, 
  getAdminSettings, 
  getTemplatePricingOverrides, 
  createUpiPayment, 
  saveInvitation,
  assignInvitationToUser,
  clearGuestDraft
} from "@/lib/supabase/storage";

interface PublishCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: Invitation;
  onPublishedSuccess: (updatedInvitation: Invitation) => void;
}

export default function PublishCheckoutModal({
  isOpen,
  onClose,
  invitation,
  onPublishedSuccess,
}: PublishCheckoutModalProps) {
  // Steps: 1 = Auth, 2 = Payment/Publish, 3 = Live Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Auth Form State
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Payment State
  const [amount, setAmount] = useState<number>(1100);
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Gateway Selection State
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "phonepe" | "razorpay">("upi");
  const [phonepeEnabled, setPhonepeEnabled] = useState(false);
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [phonepeMerchantId, setPhonepeMerchantId] = useState("");
  const [razorpayKeyId, setRazorpayKeyId] = useState("");

  const [adminSettings, setAdminSettings] = useState({
    upiId: "invitestudio@upi",
    payeeName: "InviteStudio Events",
    defaultPublicationPrice: 1100,
  });

  // Check login and calculate pricing on open
  useEffect(() => {
    if (isOpen) {
      const user = getCurrentUser();
      setCurrentUser(user);

      const settings = getAdminSettings();
      setAdminSettings({
        upiId: settings.upiId || "invitestudio@upi",
        payeeName: settings.payeeName || "InviteStudio Events",
        defaultPublicationPrice: settings.defaultPublicationPrice || 1100,
      });

      setPhonepeEnabled(!!settings.phonepeEnabled);
      setRazorpayEnabled(!!settings.razorpayEnabled);
      setPhonepeMerchantId(settings.phonepeMerchantId || "");
      setRazorpayKeyId(settings.razorpayKeyId || "");

      if (settings.activeGateway === "phonepe" && settings.phonepeEnabled) {
        setSelectedMethod("phonepe");
      } else if (settings.activeGateway === "razorpay" && settings.razorpayEnabled) {
        setSelectedMethod("razorpay");
      } else {
        setSelectedMethod("upi");
      }

      const overrides = getTemplatePricingOverrides();
      const customPrice = overrides[invitation.templateId];

      if (customPrice !== undefined) {
        setAmount(customPrice);
      } else if (!invitation.isPremium) {
        setAmount(0); // Free template
      } else {
        setAmount(settings.defaultPublicationPrice || 1100);
      }

      // If user is already logged in, go straight to payment/publish step
      if (user) {
        setStep(2);
      } else {
        setStep(1);
      }
    }
  }, [isOpen, invitation.templateId, invitation.isPremium]);

  if (!isOpen) return null;

  // Domain for shareable links
  const origin = typeof window !== "undefined" ? window.location.origin : "https://invitationonline-seven.vercel.app";
  const liveUrl = `${origin}/i/${invitation.slug}`;

  // Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (mobileNumber.trim().length < 10) {
      setAuthError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    setAuthLoading(true);
    const result = registerUser(fullName, email, password, mobileNumber);
    setAuthLoading(false);

    if (!result.success || !result.user) {
      setAuthError(result.error || "Registration failed. Please try again.");
      return;
    }

    setCurrentUser(result.user);
    setStep(2);
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const result = loginUser(loginIdentifier, loginPassword);
    setAuthLoading(false);

    if (!result.success || !result.user) {
      setAuthError(result.error || "Login failed. Please check your credentials.");
      return;
    }

    setCurrentUser(result.user);
    setStep(2);
  };

  // Dynamic UPI URIs
  const transactionNote = `InviteStudio - ${invitation.title.slice(0, 22)}`;
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(adminSettings.upiId)}&pn=${encodeURIComponent(adminSettings.payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiIntentUri)}`;

  // Handle Publish / Payment Confirmation
  const handleConfirmAndPublish = async () => {
    if (!currentUser) {
      setStep(1);
      return;
    }

    // If paid template and direct UPI selected, require UTR
    if (amount > 0 && selectedMethod === "upi") {
      if (!utrNumber.trim() || utrNumber.trim().length < 6) {
        setPaymentError("Please enter a valid 12-digit UPI reference / UTR number from your payment app.");
        return;
      }
    }

    setPaymentSubmitting(true);
    setPaymentError(null);

    try {
      // 1. Assign invitation to user and mark published
      const publishedInvite: Invitation = {
        ...invitation,
        userId: currentUser.id,
        isPublished: true,
        isPremium: amount > 0 ? true : invitation.isPremium,
        settings: {
          ...invitation.settings,
          isWatermarkHidden: true,
        },
        updatedAt: new Date().toISOString(),
      };

      await saveInvitation(publishedInvite);
      await assignInvitationToUser(publishedInvite.id, currentUser.id);

      // Clear guest draft from local storage
      clearGuestDraft(invitation.templateId);
      clearGuestDraft(invitation.id);

      // 2. If paid, record payment transaction
      if (amount > 0) {
        const gatewayTitle = 
          selectedMethod === "phonepe" ? "PhonePe PG" :
          selectedMethod === "razorpay" ? "Razorpay PG" : adminSettings.upiId;
        const utrVal = 
          selectedMethod === "phonepe" ? `PPE_${Date.now().toString().slice(-8)}` :
          selectedMethod === "razorpay" ? `RZP_${Date.now().toString().slice(-8)}` : utrNumber.trim();

        await createUpiPayment({
          userId: currentUser.id,
          userEmail: currentUser.email,
          invitationId: publishedInvite.id,
          invitationTitle: publishedInvite.title,
          invitationSlug: publishedInvite.slug,
          amount,
          upiId: gatewayTitle,
          utrNumber: utrVal,
          status: "completed",
        });
      }

      onPublishedSuccess(publishedInvite);
      setStep(3); // Success step
    } catch (err: any) {
      console.error("Publication error:", err);
      setPaymentError(err.message || "Failed to publish invitation. Please try again.");
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: "upi" | "amount" | "link") => {
    navigator.clipboard.writeText(text);
    if (type === "upi") {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else if (type === "amount") {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 p-6 text-white shrink-0 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/20 backdrop-blur-sm px-3 py-0.5 text-[11px] font-bold text-amber-200 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {step === 1 ? "Step 1 of 2: Your Account" : step === 2 ? "Step 2 of 2: Publish & Pay" : "🎉 Successfully Published"}
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold">
              {step === 1 ? "Save & Publish Invitation" : step === 2 ? "Confirm & Launch Live" : "Invitation is Live!"}
            </h3>
            <p className="text-xs text-amber-100/90 truncate max-w-sm">
              Event: <strong className="text-white">{invitation.title}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ========================================================================= */}
          {/* STEP 1: AUTHENTICATION (SIGN UP OR SIGN IN) */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200/80">
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  Your customized invitation design is ready! Please create an account or sign in with your email and mobile number to manage RSVPs and finalize publication.
                </p>
              </div>

              {/* Auth Switcher Tabs */}
              <div className="flex rounded-2xl bg-stone-100 p-1 border border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("register");
                    setAuthError(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    authTab === "register" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Create New Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("login");
                    setAuthError(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    authTab === "login" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Existing User Sign In
                </button>
              </div>

              {authError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* REGISTER FORM */}
              {authTab === "register" ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                      <input
                        type="email"
                        required
                        placeholder="sarah@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Password (min 6 chars) *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full rounded-2xl bg-stone-900 py-3 text-xs font-bold text-white shadow-gold hover:bg-stone-800 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                  >
                    <span>{authLoading ? "Creating Account..." : "Continue to Publication"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                /* LOGIN FORM */
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email or Mobile Number *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        required
                        placeholder="sarah@example.com or 9876543210"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full rounded-2xl bg-stone-900 py-3 text-xs font-bold text-white shadow-gold hover:bg-stone-800 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                  >
                    <span>{authLoading ? "Signing In..." : "Sign In & Continue"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: PAYMENT & PUBLICATION */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-5">
              {/* User Account Info Bar */}
              {currentUser && (
                <div className="rounded-xl bg-stone-50 p-3 border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="h-7 w-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-stone-900 block truncate">{currentUser.fullName}</span>
                      <span className="text-stone-500 text-[11px] block truncate">{currentUser.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                    Verified Host
                  </span>
                </div>
              )}

              {/* FREE PUBLICATION FLOW */}
              {amount === 0 ? (
                <div className="space-y-4 text-center py-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 mx-auto border border-emerald-200">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                      Free Community Template
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-stone-900">
                      Zero Cost Publication
                    </h4>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                      This template is included for free. Click below to instantly publish your live invitation and generate your shareable link.
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmAndPublish}
                    disabled={paymentSubmitting}
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 py-3.5 text-xs font-bold text-white shadow-lg hover:from-emerald-700 hover:to-teal-800 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                  >
                    <span>{paymentSubmitting ? "Publishing Live..." : "Publish Invitation for Free"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                /* PAID UPI PUBLICATION FLOW */
                <div className="space-y-5">
                  {/* Price Banner */}
                  <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-stone-700 block">Single Publication Fee</span>
                      <span className="text-[11px] text-stone-500">Permanent live hosting & unlimited RSVPs</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-950">
                        ₹{amount.toLocaleString("en-IN")}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        One-Time
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Switcher if multiple gateways enabled */}
                  {(phonepeEnabled || razorpayEnabled) && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                        Choose Payment Method:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMethod("upi");
                            setPaymentError(null);
                          }}
                          className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                            selectedMethod === "upi"
                              ? "border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs ring-1 ring-amber-500/20"
                              : "border-stone-200 hover:border-stone-300 text-stone-600 bg-white"
                          }`}
                        >
                          <Smartphone className="w-4 h-4 mb-1 text-amber-700" />
                          <span className="text-[11px] font-bold">Direct UPI</span>
                        </button>

                        {phonepeEnabled && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMethod("phonepe");
                              setPaymentError(null);
                            }}
                            className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                              selectedMethod === "phonepe"
                                ? "border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-xs ring-1 ring-purple-500/20"
                                : "border-stone-200 hover:border-stone-300 text-stone-600 bg-white"
                            }`}
                          >
                            <CreditCard className="w-4 h-4 mb-1 text-purple-600" />
                            <span className="text-[11px] font-bold">PhonePe PG</span>
                          </button>
                        )}

                        {razorpayEnabled && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMethod("razorpay");
                              setPaymentError(null);
                            }}
                            className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                              selectedMethod === "razorpay"
                                ? "border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs ring-1 ring-blue-500/20"
                                : "border-stone-200 hover:border-stone-300 text-stone-600 bg-white"
                            }`}
                          >
                            <CreditCard className="w-4 h-4 mb-1 text-blue-600" />
                            <span className="text-[11px] font-bold">Razorpay PG</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CASE 1: DIRECT UPI FLOW */}
                  {selectedMethod === "upi" && (
                    <>
                      {/* Dynamic UPI QR Code & Instructions */}
                      <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 text-center space-y-3">
                        <p className="text-xs font-semibold text-stone-700">
                          Scan to pay with Google Pay, PhonePe, Paytm, or any UPI App:
                        </p>

                        <div className="inline-block p-3 bg-white rounded-2xl shadow-md border border-stone-200 mx-auto">
                          <img
                            src={qrCodeUrl}
                            alt="Dynamic UPI QR Code"
                            className="w-44 h-44 sm:w-52 sm:h-52 mx-auto object-contain"
                          />
                          <span className="text-[11px] font-semibold text-stone-500 mt-2 block">
                            Payee: {adminSettings.payeeName}
                          </span>
                        </div>

                        {/* Mobile 1-Tap Payment Link */}
                        <div className="pt-1">
                          <a
                            href={upiIntentUri}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-700 active:scale-98 transition sm:hidden"
                          >
                            <Smartphone className="h-4 w-4" />
                            <span>Tap to Pay in UPI App (₹{amount})</span>
                          </a>
                        </div>

                        {/* Quick Copy UPI & Amount */}
                        <div className="grid grid-cols-2 gap-2 text-left pt-2">
                          <div className="bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-between">
                            <div className="min-w-0 pr-1">
                              <span className="text-[9px] text-stone-400 font-semibold block uppercase">UPI ID</span>
                              <span className="text-xs font-mono font-bold text-stone-800 truncate block">
                                {adminSettings.upiId}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(adminSettings.upiId, "upi")}
                              className="p-1 text-stone-500 hover:text-amber-700 rounded-lg hover:bg-stone-100 transition shrink-0"
                              title="Copy UPI ID"
                            >
                              {copiedUpi ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>

                          <div className="bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-between">
                            <div className="min-w-0 pr-1">
                              <span className="text-[9px] text-stone-400 font-semibold block uppercase">Amount</span>
                              <span className="text-xs font-mono font-bold text-stone-800 truncate block">
                                ₹{amount}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(String(amount), "amount")}
                              className="p-1 text-stone-500 hover:text-amber-700 rounded-lg hover:bg-stone-100 transition shrink-0"
                              title="Copy Amount"
                            >
                              {copiedAmount ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* UTR Input Form */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-stone-800">
                          Enter UPI Reference / UTR Number after payment:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 423847291038"
                          value={utrNumber}
                          onChange={(e) => {
                            setUtrNumber(e.target.value);
                            if (paymentError) setPaymentError(null);
                          }}
                          className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-mono focus:border-amber-600 focus:outline-none"
                        />
                        <p className="text-[10px] text-stone-500">
                          Found in your payment app under &quot;UPI Ref No.&quot; or &quot;UTR&quot;.
                        </p>

                        {paymentError && (
                          <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 flex items-start gap-2 text-xs text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{paymentError}</span>
                          </div>
                        )}

                        <button
                          onClick={handleConfirmAndPublish}
                          disabled={paymentSubmitting}
                          className="w-full rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 py-3 text-xs font-bold text-white shadow-gold hover:from-amber-700 hover:to-amber-800 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                        >
                          <span>{paymentSubmitting ? "Verifying & Publishing..." : "Confirm Payment & Go Live"}</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}

                  {/* CASE 2: PHONEPE GATEWAY FLOW */}
                  {selectedMethod === "phonepe" && (
                    <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5 space-y-4 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-purple-950">
                          PhonePe Secure Payment Gateway
                        </h4>
                        <p className="text-xs text-purple-800/80 mt-1 max-w-xs mx-auto">
                          Instant checkout using Credit Cards, Debit Cards, Net Banking, UPI, and PhonePe Wallet.
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-purple-100 text-left space-y-1 text-xs">
                        <div className="flex justify-between text-stone-600">
                          <span>Payable Amount:</span>
                          <span className="font-bold text-stone-900">₹{amount}</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>Gateway Protection:</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 inline" /> 256-Bit Encrypted
                          </span>
                        </div>
                      </div>

                      {paymentError && (
                        <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs text-red-700">
                          {paymentError}
                        </div>
                      )}

                      <button
                        onClick={handleConfirmAndPublish}
                        disabled={paymentSubmitting}
                        className="w-full rounded-2xl bg-purple-700 hover:bg-purple-800 py-3 text-xs font-bold text-white shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4 text-yellow-300" />
                        <span>{paymentSubmitting ? "Connecting to PhonePe..." : `Pay ₹${amount} via PhonePe`}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* CASE 3: RAZORPAY GATEWAY FLOW */}
                  {selectedMethod === "razorpay" && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 space-y-4 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-blue-950">
                          Razorpay Instant Gateway
                        </h4>
                        <p className="text-xs text-blue-800/80 mt-1 max-w-xs mx-auto">
                          Accepts all Indian and International Visa, MasterCard, RuPay cards, UPI, and Net Banking.
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-blue-100 text-left space-y-1 text-xs">
                        <div className="flex justify-between text-stone-600">
                          <span>Payable Amount:</span>
                          <span className="font-bold text-stone-900">₹{amount}</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>Instant Verification:</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 inline" /> Auto-activated
                          </span>
                        </div>
                      </div>

                      {paymentError && (
                        <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs text-red-700">
                          {paymentError}
                        </div>
                      )}

                      <button
                        onClick={handleConfirmAndPublish}
                        disabled={paymentSubmitting}
                        className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4 text-yellow-300" />
                        <span>{paymentSubmitting ? "Connecting to Razorpay..." : `Pay ₹${amount} via Razorpay`}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: CELEBRATION & LIVE SHARING */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-5 text-center py-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-600 mx-auto border border-amber-500/20 shadow-inner">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div>
                <h4 className="font-serif text-2xl font-bold text-stone-900">
                  Congratulations! Your Invitation is Live!
                </h4>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Guests can now view your celebration invitation, respond to RSVPs, and view event locations.
                </p>
              </div>

              {/* Shareable Link Box */}
              <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200 text-left space-y-2">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                  Public Invitation Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={liveUrl}
                    className="w-full bg-white rounded-xl border border-stone-200 px-3 py-2 text-xs font-mono text-stone-800 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(liveUrl, "link")}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-700 transition shrink-0"
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedLink ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`You are cordially invited to ${invitation.title}! View the formal invitation and details here: ${liveUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-xs font-bold text-white shadow hover:bg-emerald-700 transition active:scale-95"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share via WhatsApp</span>
                </a>

                <a
                  href={`/i/${invitation.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white py-3 px-4 text-xs font-bold text-stone-800 hover:bg-stone-50 transition active:scale-95"
                >
                  <ExternalLink className="h-4 w-4 text-stone-600" />
                  <span>Open Live Page</span>
                </a>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <Link
                  href="/dashboard/invitations"
                  onClick={onClose}
                  className="inline-block text-xs font-bold text-amber-700 hover:text-amber-900"
                >
                  Go to RSVP & Invitations Dashboard →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Security Badge */}
        {step !== 3 && (
          <div className="border-t border-stone-100 bg-stone-50/80 px-6 py-3 flex items-center justify-between text-[11px] text-stone-500 shrink-0">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Direct Bank Settlement via UPI</span>
            </div>
            <span>No recurring subscription required</span>
          </div>
        )}
      </div>
    </div>
  );
}
