"use client";

import React, { useState } from "react";
import { X, Smartphone, Monitor, Send, Sparkles } from "lucide-react";
import { Invitation } from "@/lib/types";
import PublicInvitationRenderer from "../invitation/PublicInvitationRenderer";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: Invitation;
  onPublish: () => void;
}

export default function PreviewModal({
  isOpen,
  onClose,
  invitation,
  onPublish,
}: PreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-950 text-white animate-in fade-in">
      {/* Top Preview Bar */}
      <div className="h-16 border-b border-stone-800 bg-stone-900 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-stone-950 font-bold">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold truncate max-w-[200px] sm:max-w-md">
              {invitation.title} (Live Preview)
            </h3>
            <p className="text-[10px] text-stone-400">Interactive guest experience</p>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="hidden sm:flex items-center bg-stone-800 p-1 rounded-xl border border-stone-700">
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              deviceMode === "mobile" ? "bg-amber-600 text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              deviceMode === "desktop" ? "bg-amber-600 text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>Center Stage</span>
          </button>
        </div>

        {/* Right: Publish & Close */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onPublish();
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-amber-500 transition"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Publish Now</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-stone-800 p-2 text-stone-400 hover:bg-stone-700 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto bg-stone-900 flex justify-center items-start p-0 sm:p-6">
        <div
          className={`w-full transition-all ${
            deviceMode === "mobile"
              ? "max-w-md my-0 sm:my-4 rounded-none sm:rounded-[38px] overflow-hidden shadow-2xl border-0 sm:border-8 sm:border-stone-800"
              : "max-w-2xl my-4 rounded-3xl overflow-hidden shadow-2xl"
          }`}
        >
          <PublicInvitationRenderer invitation={invitation} isModal={true} />
        </div>
      </div>
    </div>
  );
}
