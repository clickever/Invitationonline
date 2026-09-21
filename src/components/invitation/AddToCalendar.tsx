"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, Download, ExternalLink } from "lucide-react";
import { Invitation } from "@/lib/types";
import { createGoogleCalendarUrl, downloadIcsFile } from "@/lib/utils";

interface AddToCalendarProps {
  invitation: Invitation;
  themeColor?: string;
}

export default function AddToCalendar({ invitation, themeColor = "#D4AF37" }: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const googleUrl = createGoogleCalendarUrl(invitation);

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300/80 bg-white/90 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-stone-800 shadow-sm hover:bg-stone-50 transition"
      >
        <Calendar className="h-4 w-4 text-amber-600" />
        <span>Add to Calendar</span>
        <ChevronDown className="h-3 w-3 text-stone-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto bottom-full mb-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-stone-100 z-30 animate-in fade-in slide-in-from-bottom-2">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-stone-700 rounded-xl hover:bg-amber-50 hover:text-amber-800"
          >
            <span>Google Calendar</span>
            <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
          </a>
          <button
            onClick={() => {
              downloadIcsFile(invitation);
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-stone-700 rounded-xl hover:bg-amber-50 hover:text-amber-800"
          >
            <span>Apple / Outlook (.ics)</span>
            <Download className="h-3.5 w-3.5 text-stone-400" />
          </button>
        </div>
      )}
    </div>
  );
}
