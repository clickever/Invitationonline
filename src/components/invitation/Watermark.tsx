"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface WatermarkProps {
  isPremium?: boolean;
  isHidden?: boolean;
}

export default function Watermark({ isPremium, isHidden }: WatermarkProps) {
  if (isPremium || isHidden) {
    return null;
  }

  return (
    <div className="py-6 text-center">
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold text-stone-700 shadow-sm border border-stone-200/80 hover:bg-white hover:text-amber-700 transition"
      >
        <Sparkles className="h-3 w-3 text-amber-600" />
        <span>Created with <strong>InviteStudio</strong> • Create yours free</span>
      </Link>
    </div>
  );
}
