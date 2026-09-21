"use client";

import React, { useState, useRef } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  musicUrl?: string;
  themeColor?: string;
}

export default function MusicPlayer({ musicUrl, themeColor = "#D4AF37" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Royalty-free acoustic wedding/celebration melody fallback
  const sampleAudioUrl = musicUrl || "https://actions.google.com/sounds/v1/ambiences/outdoor_garden_breeze.ogg";

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio playback blocked by autoplay policy:", err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <audio ref={audioRef} src={sampleAudioUrl} loop preload="auto" />
      <button
        onClick={togglePlay}
        className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold backdrop-blur-md shadow-lg border transition-all ${
          isPlaying
            ? "bg-white/90 text-stone-900 border-amber-400 scale-105"
            : "bg-black/40 text-white border-white/20 hover:bg-black/60"
        }`}
      >
        {isPlaying ? (
          <>
            <Volume2 className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            <span>Music On</span>
          </>
        ) : (
          <>
            <VolumeX className="h-3.5 w-3.5 text-stone-300" />
            <span>Play Music</span>
          </>
        )}
      </button>
    </div>
  );
}
