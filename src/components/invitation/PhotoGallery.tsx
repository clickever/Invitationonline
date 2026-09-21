"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { InvitationImage } from "@/lib/types";

interface PhotoGalleryProps {
  images: InvitationImage[];
  themeColor?: string;
}

export default function PhotoGallery({ images, themeColor = "#D4AF37" }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4" style={{ color: themeColor }} />
        <h4 className="font-serif text-sm font-bold text-stone-900 tracking-wide uppercase">
          Moments & Memories
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {images.map((img, idx) => (
          <button
            key={img.id || idx}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-stone-100 border border-stone-200/60 shadow-sm focus:outline-none"
          >
            <img
              src={img.url}
              alt={img.caption || `Photo ${idx + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left">
                <p className="text-[10px] text-white truncate font-medium">{img.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={() => setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="max-h-[80vh] max-w-3xl overflow-hidden rounded-2xl text-center">
            <img
              src={images[selectedIndex].url}
              alt={images[selectedIndex].caption || "Gallery image"}
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-xl"
            />
            {images[selectedIndex].caption && (
              <p className="mt-2 text-sm text-stone-300 font-medium">
                {images[selectedIndex].caption}
              </p>
            )}
          </div>

          <button
            onClick={() => setSelectedIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
