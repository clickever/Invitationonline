"use client";

import React, { useState } from "react";
import { 
  Heart, 
  MapPin, 
  Share2, 
  Calendar, 
  Sparkles, 
  MessageCircle,
  ExternalLink 
} from "lucide-react";
import { CanvasElement, Invitation } from "@/lib/types";
import CountdownTimer from "./CountdownTimer";
import RsvpModal from "./RsvpModal";
import ShareModal from "./ShareModal";
import AddToCalendar from "./AddToCalendar";
import LocationMap from "./LocationMap";
import PhotoGallery from "./PhotoGallery";
import MusicPlayer from "./MusicPlayer";
import Watermark from "./Watermark";

interface PublicInvitationRendererProps {
  invitation: Invitation;
}

export default function PublicInvitationRenderer({ invitation }: PublicInvitationRendererProps) {
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const themeColor = invitation.settings?.themeColor || "#D4AF37";
  const publicUrl = typeof window !== "undefined" ? window.location.href : `https://invitestudio.app/i/${invitation.slug}`;

  // Helper to render individual canvas elements
  const renderElement = (el: CanvasElement) => {
    // Relative scaling from 1080 design width
    const leftPercent = (el.x / (invitation.canvas?.width || 1080)) * 100;
    const topPercent = (el.y / (invitation.canvas?.height || 1920)) * 100;
    const widthPercent = (el.width / (invitation.canvas?.width || 1080)) * 100;

    switch (el.type) {
      case "text":
        return (
          <div
            key={el.id}
            style={{
              fontFamily: el.fontFamily || "inherit",
              fontSize: el.fontSize ? `calc(${el.fontSize}px * 0.45)` : undefined,
              fontWeight: el.fontWeight || "normal",
              fontStyle: el.fontStyle || "normal",
              color: el.color || "inherit",
              textAlign: el.textAlign || "center",
              letterSpacing: el.letterSpacing ? `${el.letterSpacing * 0.45}px` : undefined,
              lineHeight: el.lineHeight || 1.3,
              textTransform: el.textTransform || "none",
            }}
            className="w-full transition-all leading-tight break-words px-4"
          >
            {el.text}
          </div>
        );

      case "shape":
        if (el.shapeType === "line") {
          return (
            <div
              key={el.id}
              className="mx-auto my-2"
              style={{
                width: `${Math.min(el.width * 0.4, 200)}px`,
                height: `${el.strokeWidth || 1}px`,
                backgroundColor: el.strokeColor || themeColor,
              }}
            />
          );
        }
        if (el.shapeType === "arch") {
          return (
            <div
              key={el.id}
              className="absolute inset-4 rounded-t-full border pointer-events-none"
              style={{
                borderColor: el.strokeColor || themeColor,
                borderWidth: `${el.strokeWidth || 1}px`,
                backgroundColor: el.fillColor || "transparent",
              }}
            />
          );
        }
        return (
          <div
            key={el.id}
            className="absolute inset-3 border pointer-events-none rounded-2xl"
            style={{
              borderColor: el.strokeColor || themeColor,
              borderWidth: `${el.strokeWidth || 1}px`,
              backgroundColor: el.fillColor || "transparent",
            }}
          />
        );

      case "divider":
        return (
          <div key={el.id} className="flex items-center justify-center my-2 gap-2">
            <span className="h-[1px] w-12" style={{ backgroundColor: el.strokeColor || themeColor }} />
            <span className="text-xs" style={{ color: el.strokeColor || themeColor }}>✦</span>
            <span className="h-[1px] w-12" style={{ backgroundColor: el.strokeColor || themeColor }} />
          </div>
        );

      case "countdown":
        if (!invitation.settings?.enableCountdown) return null;
        return (
          <div key={el.id} className="my-4 w-full">
            <CountdownTimer targetDate={invitation.eventDate} themeColor={themeColor} />
          </div>
        );

      case "button":
        if (el.actionType === "rsvp") {
          return (
            <div key={el.id} className="my-3 flex justify-center w-full px-4">
              <button
                type="button"
                onClick={() => setRsvpModalOpen(true)}
                className="w-full max-w-xs rounded-full py-3.5 px-6 text-sm font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: el.buttonBg || themeColor,
                  color: el.buttonColor || "#FFFFFF",
                }}
              >
                <Heart className="h-4 w-4 fill-current" />
                <span>{el.buttonText || "RSVP NOW"}</span>
              </button>
            </div>
          );
        }
        if (el.actionType === "map") {
          return (
            <div key={el.id} className="my-2 flex justify-center w-full px-4">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${invitation.venueName}, ${invitation.venueAddress}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-xs rounded-full py-2.5 px-6 text-xs font-bold border transition-colors flex items-center justify-center gap-2 hover:bg-stone-50"
                style={{
                  color: el.buttonColor || "#1E1B18",
                  borderColor: el.strokeColor || themeColor,
                  backgroundColor: el.buttonBg || "transparent",
                }}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{el.buttonText || "VIEW ON MAPS"}</span>
              </a>
            </div>
          );
        }
        return null;

      case "image":
        return (
          <div key={el.id} className="my-3 mx-auto overflow-hidden rounded-2xl max-w-xs shadow-md">
            <img
              src={el.src || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"}
              alt={el.alt || "Invitation image"}
              className="w-full h-auto object-cover"
              style={{ borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Separate background shapes from foreground elements
  const shapeElements = invitation.elements?.filter((el) => el.type === "shape") || [];
  const contentElements = invitation.elements?.filter((el) => el.type !== "shape") || [];

  return (
    <div className="min-h-screen bg-stone-900 py-4 sm:py-10 px-0 sm:px-4 flex flex-col items-center justify-center">
      {/* Background Music Player */}
      {invitation.settings?.enableMusic && (
        <MusicPlayer musicUrl={invitation.settings.musicUrl} themeColor={themeColor} />
      )}

      {/* Main Invitation Card Stage */}
      <div className="w-full max-w-md mx-auto relative rounded-none sm:rounded-[36px] overflow-hidden shadow-2xl transition-all">
        {/* Frame Layer */}
        <div
          className="relative min-h-[92vh] sm:min-h-[850px] p-6 sm:p-8 flex flex-col justify-between"
          style={{
            backgroundColor: invitation.background?.value || "#FDFBF7",
          }}
        >
          {/* Background shapes & ornamental borders */}
          {shapeElements.map(renderElement)}

          {/* Top Decorative Sparkle */}
          <div className="relative z-10 flex justify-center pt-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm shadow-sm"
              style={{ color: themeColor }}
            >
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          {/* Dynamic Content Layers */}
          <div className="relative z-10 my-auto py-6 space-y-3.5 text-center flex flex-col items-center">
            {contentElements.map(renderElement)}
          </div>

          {/* Interactive Venue & Calendar Widget Section */}
          <div className="relative z-10 space-y-3 mt-4">
            {invitation.settings?.enableMap && (invitation.venueName || invitation.venueAddress) && (
              <LocationMap
                venueName={invitation.venueName}
                venueAddress={invitation.venueAddress}
                themeColor={themeColor}
              />
            )}

            {invitation.settings?.enableCalendar && (
              <div className="flex justify-center">
                <AddToCalendar invitation={invitation} themeColor={themeColor} />
              </div>
            )}

            {/* Gallery Section */}
            {invitation.settings?.enableGallery && invitation.images && invitation.images.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-200/60">
                <PhotoGallery images={invitation.images} themeColor={themeColor} />
              </div>
            )}
          </div>

          {/* Watermark for Free Tier */}
          <div className="relative z-10 mt-6">
            <Watermark
              isPremium={invitation.isPremium}
              isHidden={invitation.settings?.isWatermarkHidden}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Floating Action Bar */}
      <div className="sticky bottom-4 z-40 w-full max-w-md px-4 mt-4">
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-stone-950/90 backdrop-blur-md p-2 shadow-2xl border border-stone-800">
          <button
            onClick={() => setRsvpModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold text-stone-900 shadow-md transition active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            <Heart className="h-4 w-4 fill-stone-900" />
            <span>RSVP Response</span>
          </button>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${invitation.venueName}, ${invitation.venueAddress}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl bg-stone-800/80 p-3 text-white hover:bg-stone-800 transition"
            title="Get Directions"
          >
            <MapPin className="h-4 w-4 text-stone-300" />
          </a>

          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center justify-center rounded-xl bg-stone-800/80 p-3 text-white hover:bg-stone-800 transition"
            title="Share Invitation"
          >
            <Share2 className="h-4 w-4 text-stone-300" />
          </button>
        </div>
      </div>

      {/* RSVP Modal */}
      <RsvpModal
        isOpen={rsvpModalOpen}
        onClose={() => setRsvpModalOpen(false)}
        invitationId={invitation.id}
        eventTitle={invitation.title}
        themeColor={themeColor}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={invitation.title}
        shareUrl={publicUrl}
        themeColor={themeColor}
      />
    </div>
  );
}
