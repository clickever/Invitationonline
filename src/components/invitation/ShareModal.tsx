"use client";

import React, { useState } from "react";
import { X, Copy, Check, Share2, MessageCircle, QrCode } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareUrl: string;
  themeColor?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  shareUrl,
  themeColor = "#D4AF37",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `You're cordially invited: ${title}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  const whatsappMessage = encodeURIComponent(
    `You are cordially invited to celebrate with us!\n\n*${title}*\n\nView the interactive invitation and RSVP here:\n${shareUrl}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  // Quick reliable QR generator URL
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    shareUrl
  )}&bgcolor=FCFAF8&color=1E1B18`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-stone-100">
        {/* Header */}
        <div className="relative border-b border-stone-100 bg-stone-50/70 px-6 py-5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Share Invitation</p>
          <h2 className="font-serif text-xl font-bold text-stone-900 mt-0.5 truncate">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {showQr ? (
            <div className="text-center py-2 space-y-4">
              <div className="inline-block p-4 rounded-3xl bg-amber-50/70 border border-amber-200/70 shadow-inner">
                <img
                  src={qrApiUrl}
                  alt="Invitation QR Code"
                  className="h-52 w-52 rounded-xl object-contain mx-auto"
                />
              </div>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Scan with any smartphone camera to immediately open this invitation.
              </p>
              <button
                onClick={() => setShowQr(false)}
                className="text-xs font-semibold text-stone-700 underline hover:text-stone-900"
              >
                ← Back to share options
              </button>
            </div>
          ) : (
            <>
              {/* Copy URL Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Public Invitation Link
                </label>
                <div className="flex items-center rounded-2xl border border-stone-200 bg-stone-50/70 p-1.5 focus-within:border-amber-500">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full bg-transparent px-3 text-xs text-stone-700 focus:outline-none truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-sm transition"
                    style={{ backgroundColor: themeColor }}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Quick Action Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-center hover:bg-emerald-50 transition"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm mb-1.5">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-900">WhatsApp</span>
                </a>

                {/* QR Code */}
                <button
                  onClick={() => setShowQr(true)}
                  className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 p-3.5 text-center hover:bg-stone-100 transition"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 text-white shadow-sm mb-1.5">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-stone-800">QR Code</span>
                </button>

                {/* Native Web Share */}
                <button
                  onClick={handleNativeShare}
                  className="flex flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 text-center hover:bg-amber-50 transition"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm mb-1.5"
                    style={{ backgroundColor: themeColor }}
                  >
                    <Share2 className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-stone-800">More...</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
