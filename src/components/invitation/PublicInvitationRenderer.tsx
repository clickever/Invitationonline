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
    <div 
      className="min-h-screen py-4 sm:py-10 px-0 sm:px-4 flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 20%, ${themeColor}33 0%, #12131a 50%, #090a0f 100%)`
      }}
    >
      {/* Background Music Player */}
      {invitation.settings?.enableMusic && (
        <MusicPlayer musicUrl={invitation.settings.musicUrl} themeColor={themeColor} />
      )}

      {/* Main Invitation Card Stage */}
      <div 
        className="w-full max-w-md mx-auto relative rounded-none sm:rounded-[36px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-all border border-white/10"
        style={{
          boxShadow: `0 20px 50px -10px ${themeColor}33, 0 0 0 1px ${themeColor}22`
        }}
      >
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
          <div className="relative z-10 my-auto py-6 space-y-4 text-center flex flex-col items-center">
            {contentElements.map(renderElement)}
          </div>

          {/* Our Story / Warm Welcome Note */}
          {(invitation.settings?.storyText || invitation.description) && (
            <div className="relative z-10 my-4 mx-2 p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-stone-200/80 shadow-xs text-center space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800" style={{ color: themeColor }}>
                {invitation.settings?.storyTitle || "A Note From The Hosts"}
              </span>
              <p className="font-serif italic text-xs text-stone-700 leading-relaxed max-w-xs mx-auto">
                &quot;{invitation.settings?.storyText || invitation.description}&quot;
              </p>
            </div>
          )}

          {/* Event Schedule / Program Timeline */}
          {invitation.settings?.schedule && invitation.settings.schedule.length > 0 && (
            <div className="relative z-10 my-4 mx-2 p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="h-[1px] w-6 bg-stone-300" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-700" style={{ color: themeColor }}>
                  Order of Events
                </span>
                <span className="h-[1px] w-6 bg-stone-300" />
              </div>
              <div className="space-y-3">
                {invitation.settings.schedule.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-left">
                    <span 
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono shrink-0 shadow-xs"
                      style={{ backgroundColor: `${themeColor}22`, color: themeColor }}
                    >
                      {item.time}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 truncate">{item.title}</div>
                      {item.description && (
                        <div className="text-[11px] text-stone-500 leading-snug">{item.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dress Code Pill */}
          {invitation.settings?.dressCode && (
            <div className="relative z-10 my-2 mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-white/80 backdrop-blur-xs border border-stone-200 shadow-xs text-xs text-stone-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Dress Code:</span>
              <span className="font-semibold text-stone-800">{invitation.settings.dressCode}</span>
            </div>
          )}

          {/* Host WhatsApp Connect CTA */}
          <div className="relative z-10 my-3 flex justify-center px-4">
            <a
              href={`https://wa.me/${invitation.settings?.contactPhone ? invitation.settings.contactPhone.replace(/\D/g, "") : ""}?text=${encodeURIComponent(
                `Hello! I received your invitation for "${invitation.title}" and would love to connect!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs rounded-full py-2.5 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-2 transition active:scale-95"
            >
              <MessageCircle className="h-4 w-4 fill-emerald-600 text-white" />
              <span>Connect with Host on WhatsApp</span>
            </a>
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
