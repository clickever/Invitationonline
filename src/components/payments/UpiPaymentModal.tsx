"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { Invitation, PaymentRecord } from "@/lib/types";
import { 
  getAdminSettings, 
  createUpiPayment, 
  getCurrentUser, 
  getTemplatePricingOverrides 
} from "@/lib/supabase/storage";

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: Invitation;
  onSuccess: (payment: PaymentRecord) => void;
}

export default function UpiPaymentModal({
  isOpen,
  onClose,
  invitation,
  onSuccess,
}: UpiPaymentModalProps) {
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [adminSettings, setAdminSettings] = useState({
    upiId: "invitestudio@upi",
    payeeName: "InviteStudio Payments",
    defaultPublicationPrice: 1100,
  });
  const [amount, setAmount] = useState(1100);

  useEffect(() => {
    if (isOpen) {
      const settings = getAdminSettings();
      setAdminSettings({
        upiId: settings.upiId || "invitestudio@upi",
        payeeName: settings.payeeName || "InviteStudio Payments",
        defaultPublicationPrice: settings.defaultPublicationPrice || 1100,
      });

      const overrides = getTemplatePricingOverrides();
      const customPrice = overrides[invitation.templateId];
      if (customPrice !== undefined) {
        setAmount(customPrice);
      } else {
        setAmount(settings.defaultPublicationPrice || 1100);
      }
    }
  }, [isOpen, invitation.templateId]);

  if (!isOpen) return null;

  const user = getCurrentUser();
  const transactionNote = `InviteStudio - ${invitation.title.slice(0, 25)}`;
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(adminSettings.upiId)}&pn=${encodeURIComponent(adminSettings.payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiIntentUri)}`;

  const copyToClipboard = (text: string, type: "upi" | "amount") => {
    navigator.clipboard.writeText(text);
    if (type === "upi") {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleConfirmPayment = async () => {
    setError(null);
    if (!utrNumber.trim()) {
      setError("Please enter the 12-digit UTR or Transaction ID from your payment app.");
      return;
    }

    if (utrNumber.trim().length < 6) {
      setError("Please enter a valid Transaction / UTR reference number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payment = await createUpiPayment({
        userId: user?.id || "anonymous_user",
        userEmail: user?.email || "guest@invitestudio.app",
        invitationId: invitation.id,
        invitationTitle: invitation.title,
        invitationSlug: invitation.slug,
        amount,
        upiId: adminSettings.upiId,
        utrNumber: utrNumber.trim(),
        status: "completed", // Instantly provisionally unlock publication
      });

      onSuccess(payment);
    } catch (err) {
      console.error("Payment confirmation error:", err);
      setError("An error occurred recording your payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/20 backdrop-blur-sm px-3 py-0.5 text-[11px] font-bold text-amber-200 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Instant UPI Publication</span>
            </div>
            <h3 className="font-serif text-2xl font-bold">Publish & Go Live</h3>
            <p className="text-xs text-amber-100/90">
              One-time publication pass for <strong className="text-white underline">{invitation.title}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Price Banner */}
          <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-600 block">Single Publication Fee</span>
              <span className="text-xs text-stone-500">Includes lifetime hosting & unlimited RSVPs</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold font-serif text-amber-950">
                ₹{amount.toLocaleString("en-IN")}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Zero Fees
              </span>
            </div>
          </div>

          {/* QR Code and UPI details */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-center space-y-4">
            <p className="text-xs font-semibold text-stone-700">
              Scan with Google Pay, PhonePe, Paytm, or any UPI App:
            </p>

            {/* Dynamic QR Code */}
            <div className="inline-block p-3 bg-white rounded-2xl shadow-md border border-stone-200 mx-auto">
              <img
                src={qrCodeUrl}
                alt="Dynamic UPI QR Code"
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
              />
              <span className="text-[11px] font-semibold text-stone-500 mt-2 block">
                Payee: {adminSettings.payeeName}
              </span>
            </div>

            {/* Mobile 1-Tap Deep Link */}
            <div className="pt-2">
              <a
                href={upiIntentUri}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-700 active:scale-98 transition sm:hidden"
              >
                <Smartphone className="h-4 w-4" />
                <span>Tap to Pay in UPI App (₹{amount})</span>
              </a>
            </div>

            {/* Copy UPI Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-left">
              <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] text-stone-400 font-semibold block uppercase">UPI ID</span>
                  <span className="text-xs font-mono font-bold text-stone-800 truncate block">
                    {adminSettings.upiId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(adminSettings.upiId, "upi")}
                  className="p-1.5 text-stone-500 hover:text-amber-700 rounded-lg hover:bg-stone-100 transition shrink-0"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] text-stone-400 font-semibold block uppercase">Amount</span>
                  <span className="text-xs font-mono font-bold text-stone-800 truncate block">
                    ₹{amount}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(String(amount), "amount")}
                  className="p-1.5 text-stone-500 hover:text-amber-700 rounded-lg hover:bg-stone-100 transition shrink-0"
                  title="Copy Amount"
                >
                  {copiedAmount ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* UTR Input Form */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-800">
              Enter 12-digit UPI Reference / UTR Number after payment:
            </label>
            <input
              type="text"
              placeholder="e.g. 423847291038"
              value={utrNumber}
              onChange={(e) => {
                setUtrNumber(e.target.value);
                if (error) setError(null);
              }}
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm font-mono focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 shadow-xs"
            />
            <p className="text-[11px] text-stone-500">
              Found in your payment app&apos;s transaction details under &quot;UPI Ref No.&quot; or &quot;UTR&quot;.
            </p>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 bg-stone-50 p-4 px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Secure Direct UPI Settlement</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-700 hover:to-amber-800 transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Confirm & Publish Live"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
