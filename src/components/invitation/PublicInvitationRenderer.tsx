"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  MapPin, 
  Share2, 
  Sparkles,
  Calendar,
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
import PalaceInvitationRenderer from "./PalaceInvitationRenderer";

interface PublicInvitationRendererProps {
  invitation: Invitation;
  isModal?: boolean;
}

export default function PublicInvitationRenderer({ invitation, isModal = false }: PublicInvitationRendererProps) {
  // If this invitation is a Palace royal luxury template, render the PalaceInvitationRenderer
  const isPalaceTemplate = 
    invitation.templateId?.startsWith("wedding-palace") ||
    invitation.settings?.layoutStyle === "palace" ||
    invitation.title?.toLowerCase().includes("palace");

  if (isPalaceTemplate) {
    return <PalaceInvitationRenderer invitation={invitation} />;
  }

  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [scale, setScale] = useState(0.36);

  const themeColor = invitation.settings?.themeColor || "#D4AF37";
  const publicUrl = typeof window !== "undefined" ? window.location.href : `https://invitationonline-seven.vercel.app/i/${invitation.slug}`;

  // Responsive scale calculation to fit screen without clipping
  useEffect(() => {
    const updateScale = () => {
      if (typeof window !== "undefined") {
        const w = window.innerWidth;
        if (w < 480) {
          // Mobile viewport: leaves 20px margins on sides
          const fit = Number(((w - 24) / 1080).toFixed(2));
          setScale(Math.max(0.28, Math.min(fit, 0.42)));
        } else if (w < 768) {
          setScale(0.38);
        } else {
          setScale(0.44);
        }
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const scaledWidth = Math.round(1080 * scale);
  const scaledHeight = Math.round(1920 * scale);

  // Exact Pixel-Perfect Canvas Element Renderer matching Editor CanvasStage
  const renderCanvasElement = (el: CanvasElement) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${el.x}px`,
      top: `${el.y}px`,
      width: `${el.width}px`,
      height: `${el.height}px`,
      zIndex: el.zIndex || 2,
      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
      userSelect: "none",
    };

    if (el.type === "text") {
      return (
        <div
          key={el.id}
          style={{
            ...style,
            fontFamily: el.fontFamily || "Inter",
            fontSize: `${el.fontSize || 24}px`,
            fontWeight: el.fontWeight || "400",
            fontStyle: el.fontStyle || "normal",
            color: el.color || "#2D261E",
            textAlign: el.textAlign || "center",
            letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
            lineHeight: el.lineHeight || 1.3,
            textTransform: el.textTransform || "none",
            display: "flex",
            alignItems: "center",
            justifyContent:
              el.textAlign === "left"
                ? "flex-start"
                : el.textAlign === "right"
                ? "flex-end"
                : "center",
          }}
        >
          {el.text}
        </div>
      );
    }

    if (el.type === "shape") {
      if (el.shapeType === "line") {
        return (
          <div
            key={el.id}
            style={{
              ...style,
              height: `${el.strokeWidth || 2}px`,
              backgroundColor: el.strokeColor || themeColor,
            }}
          />
        );
      }
      if (el.shapeType === "arch") {
        return (
          <div
            key={el.id}
            style={{
              ...style,
              borderTopLeftRadius: "500px",
              borderTopRightRadius: "500px",
              border: `${el.strokeWidth || 2}px solid ${el.strokeColor || themeColor}`,
              backgroundColor: el.fillColor || "transparent",
            }}
          />
        );
      }
      return (
        <div
          key={el.id}
          style={{
            ...style,
            border: `${el.strokeWidth || 2}px solid ${el.strokeColor || themeColor}`,
            backgroundColor: el.fillColor || "transparent",
            borderRadius: "16px",
          }}
        />
      );
    }

    if (el.type === "divider") {
      return (
        <div key={el.id} style={style} className="flex items-center justify-center gap-4">
          <div className="h-[2px] flex-1" style={{ backgroundColor: el.strokeColor || themeColor }} />
          <span className="text-xl" style={{ color: el.strokeColor || themeColor }}>✦</span>
          <div className="h-[2px] flex-1" style={{ backgroundColor: el.strokeColor || themeColor }} />
        </div>
      );
    }

    if (el.type === "countdown") {
      if (!invitation.settings?.enableCountdown) return null;
      return (
        <div key={el.id} style={style} className="transform scale-[1.3] origin-center flex items-center justify-center">
          <CountdownTimer targetDate={invitation.eventDate} themeColor={themeColor} />
        </div>
      );
    }

    if (el.type === "button") {
      return (
        <div key={el.id} style={style}>
          <button
            type="button"
            onClick={() => {
              if (el.actionType === "map" || el.buttonText?.toLowerCase().includes("map")) {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${invitation.venueName}, ${invitation.venueAddress}`
                  )}`,
                  "_blank"
                );
              } else {
                setRsvpModalOpen(true);
              }
            }}
            className="w-full h-full rounded-full font-bold shadow-md flex items-center justify-center cursor-pointer transition active:scale-95"
            style={{
              backgroundColor: el.buttonBg || themeColor,
              color: el.buttonColor || "#FFFFFF",
              fontSize: "22px",
              border: el.strokeColor ? `2px solid ${el.strokeColor}` : undefined,
            }}
          >
            {el.buttonText || "RSVP NOW"}
          </button>
        </div>
      );
    }

    if (el.type === "image") {
      return (
        <div key={el.id} style={style} className="overflow-hidden">
          <img
            src={el.src || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"}
            alt="Canvas graphic"
            className="w-full h-full object-cover"
            style={{
              borderRadius: el.borderRadius !== undefined ? `${el.borderRadius}px` : "16px",
              opacity: el.opacity ?? 1,
            }}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      className={`${isModal ? "py-2 px-0" : "min-h-screen py-4 sm:py-8 px-2 sm:px-4"} flex flex-col items-center justify-start relative overflow-x-hidden`}
      style={{
        background: isModal ? "transparent" : `radial-gradient(circle at 50% 15%, ${themeColor}22 0%, #16171f 50%, #0c0d12 100%)`
      }}
    >
      {/* Background Music Player */}
      {invitation.settings?.enableMusic && (
        <MusicPlayer musicUrl={invitation.settings.musicUrl} themeColor={themeColor} />
      )}

      {/* Main Physical Sizing Container matching CanvasStage */}
      <div 
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          position: "relative",
          flexShrink: 0,
        }}
        className="shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] rounded-2xl sm:rounded-[36px] overflow-hidden bg-white mx-auto my-2 border border-white/10"
      >
        {/* Virtual 1080 x 1920 Canvas Stage Scaled to Match Screen */}
        <div
          style={{
            width: "1080px",
            height: "1920px",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: invitation.background?.value || "#FDFBF7",
            backgroundImage: invitation.background?.imageUrl ? `url("${invitation.background.imageUrl}")` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="overflow-hidden"
        >
          {/* Background Image Opacity Overlay Layer */}
          {invitation.background?.imageUrl && (
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundColor: invitation.background?.imageOverlay || "#FFFFFF",
                opacity: 1 - (invitation.background?.imageOpacity ?? 0.35),
              }}
            />
          )}

          {/* All Canvas Elements Rendered Exactly in Position */}
          {(invitation.elements || []).map(renderCanvasElement)}
        </div>
      </div>

      {/* Guest Action Bar below Invitation Card */}
      <div className="w-full max-w-md mx-auto px-2 mt-4 mb-2">
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-stone-950/90 backdrop-blur-md p-2 shadow-2xl border border-stone-800">
          <button
            onClick={() => setRsvpModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold text-stone-900 shadow-md transition active:scale-95 hover:opacity-95"
            style={{ backgroundColor: themeColor }}
          >
            <Heart className="h-4 w-4 fill-stone-900" />
            <span>RSVP Response</span>
          </button>

          {(invitation.venueName || invitation.venueAddress) && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${invitation.venueName || ""}, ${invitation.venueAddress || ""}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl bg-stone-800/90 p-3 text-white hover:bg-stone-800 transition"
              title="Get Directions"
            >
              <MapPin className="h-4 w-4 text-stone-300" />
            </a>
          )}

          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center justify-center rounded-xl bg-stone-800/90 p-3 text-white hover:bg-stone-800 transition"
            title="Share Invitation"
          >
            <Share2 className="h-4 w-4 text-stone-300" />
          </button>
        </div>
      </div>

      {/* Optional Interactive Guest Hub Widgets (Below Card) */}
      <div className="w-full max-w-md mx-auto px-2 space-y-4 pb-12">
        {/* Map Widget */}
        {invitation.settings?.enableMap && (invitation.venueName || invitation.venueAddress) && (
          <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-800/60 bg-stone-900/60 p-4">
            <div className="flex items-center gap-2 mb-2 text-stone-300 text-xs font-bold">
              <MapPin className="h-4 w-4 text-amber-500" />
              <span>Event Venue & Directions</span>
            </div>
            <LocationMap
              venueName={invitation.venueName}
              venueAddress={invitation.venueAddress}
              themeColor={themeColor}
            />
          </div>
        )}

        {/* 1-Tap Add to Calendar */}
        {invitation.settings?.enableCalendar && (
          <div className="flex justify-center pt-1">
            <AddToCalendar invitation={invitation} themeColor={themeColor} />
          </div>
        )}

        {/* Photo Gallery */}
        {invitation.settings?.enableGallery && invitation.images && invitation.images.length > 0 && (
          <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-800/60 bg-stone-900/60 p-4">
            <PhotoGallery images={invitation.images} themeColor={themeColor} />
          </div>
        )}

        {/* Watermark for Free Tier */}
        <div className="pt-2">
          <Watermark
            isPremium={invitation.isPremium}
            isHidden={invitation.settings?.isWatermarkHidden}
          />
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
