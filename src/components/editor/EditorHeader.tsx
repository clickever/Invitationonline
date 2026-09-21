"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Save, 
  Send, 
  Smartphone, 
  Monitor,
  CheckCircle2,
  Sparkles,
  Share2
} from "lucide-react";

interface EditorHeaderProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  isPublished: boolean;
  onSave: () => void;
  onPublish: () => void;
  onPreview: () => void;
  onShare: () => void;
  isSaving?: boolean;
  lastSavedAt?: Date | null;
}

export default function EditorHeader({
  title,
  onTitleChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomChange,
  isPublished,
  onSave,
  onPublish,
  onPreview,
  onShare,
  isSaving,
  lastSavedAt,
}: EditorHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <header className="h-16 border-b border-stone-200 bg-white px-4 flex items-center justify-between z-30 shrink-0">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/dashboard/invitations"
          className="rounded-xl p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="h-6 w-[1px] bg-stone-200" />

        <div className="flex items-center gap-2 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
              className="font-serif text-base font-bold text-stone-900 border-b border-amber-500 focus:outline-none px-1"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-left font-serif text-base font-bold text-stone-900 truncate hover:text-amber-700 transition"
              title="Click to rename invitation"
            >
              {title || "Untitled Invitation"}
            </button>
          )}

          {isPublished && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" />
              Published
            </span>
          )}
        </div>
      </div>

      {/* Center: History & Zoom Controls */}
      <div className="hidden lg:flex items-center gap-2 bg-stone-100/80 p-1 rounded-2xl border border-stone-200">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-xl p-1.5 text-stone-600 hover:bg-white hover:text-stone-900 transition disabled:opacity-30"
          title="Undo (Ctrl/Cmd+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="rounded-xl p-1.5 text-stone-600 hover:bg-white hover:text-stone-900 transition disabled:opacity-30"
          title="Redo (Ctrl/Cmd+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-stone-300 mx-1" />

        <button
          onClick={() => onZoomChange(Math.max(0.3, Number((zoom - 0.1).toFixed(2))))}
          className="rounded-xl p-1.5 text-stone-600 hover:bg-white hover:text-stone-900 transition"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        <span className="text-xs font-mono font-medium text-stone-700 px-1 w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => onZoomChange(Math.min(1.2, Number((zoom + 0.1).toFixed(2))))}
          className="rounded-xl p-1.5 text-stone-600 hover:bg-white hover:text-stone-900 transition"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Save Draft */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
        >
          <Save className="h-3.5 w-3.5" />
          <span>{isSaving ? "Saving..." : "Save Draft"}</span>
        </button>

        {/* Preview Button */}
        <button
          onClick={onPreview}
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition"
        >
          <Eye className="h-3.5 w-3.5 text-amber-700" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        {/* Share Button (if published) */}
        {isPublished && (
          <button
            onClick={onShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 transition"
            title="Share Link & QR"
          >
            <Share2 className="h-3.5 w-3.5 text-stone-600" />
            <span className="hidden md:inline">Share</span>
          </button>
        )}

        {/* Publish Button */}
        <button
          onClick={onPublish}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700 active:scale-95 transition"
        >
          <Send className="h-3.5 w-3.5" />
          <span>{isPublished ? "Update Published" : "Publish Invite"}</span>
        </button>
      </div>
    </header>
  );
}
