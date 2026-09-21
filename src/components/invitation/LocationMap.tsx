"use client";

import React from "react";
import { MapPin, Navigation } from "lucide-react";

interface LocationMapProps {
  venueName: string;
  venueAddress: string;
  themeColor?: string;
}

export default function LocationMap({
  venueName,
  venueAddress,
  themeColor = "#D4AF37",
}: LocationMapProps) {
  if (!venueName && !venueAddress) return null;

  const searchQuery = encodeURIComponent(`${venueName}, ${venueAddress}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

  return (
    <div className="w-full rounded-2xl bg-white/80 backdrop-blur-md p-4 border border-stone-200/80 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm mt-0.5"
          style={{ backgroundColor: themeColor }}
        >
          <MapPin className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif text-sm font-bold text-stone-900 truncate">{venueName || "Venue Location"}</h4>
          <p className="text-xs text-stone-600 mt-0.5 line-clamp-2 leading-relaxed">{venueAddress}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-end">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold transition hover:opacity-80"
          style={{ color: themeColor }}
        >
          <Navigation className="h-3.5 w-3.5" />
          <span>Open in Google Maps</span>
        </a>
      </div>
    </div>
  );
}
