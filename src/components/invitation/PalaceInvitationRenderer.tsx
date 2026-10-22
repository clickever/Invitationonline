"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  MapPin, 
  Sparkles, 
  Phone, 
  Volume2, 
  VolumeX, 
  Check, 
  RotateCcw
} from "lucide-react";
import { CanvasElement, Invitation, VenueEventItem, ContactItem } from "@/lib/types";
import CountdownTimer from "./CountdownTimer";

interface PalaceInvitationRendererProps {
  invitation: Invitation;
}

// 4 Palace Royal Color Palettes
export const PALACE_THEMES = {
  burgundy: {
    name: "Royal Burgundy Velvet",
    deep: "#5B0018",
    primary: "#800020",
    medium: "#A3344A",
    light: "#C7586E",
    tint: "#F8ECF0",
    wash: "#FDF2F5",
    gold: "#D4A76A",
    goldBright: "#E8C891",
    goldDim: "#B8935A",
    bgTile: "#F5EDE6",
    bgCard: "rgba(255, 250, 245, 0.92)",
    textMain: "#2A0A14",
    textMuted: "#6B4555",
    fontSerif: "'Cormorant Garamond', Georgia, serif",
    fontScript: "'Great Vibes', cursive",
    fontSans: "'Jost', system-ui, sans-serif",
  },
  emerald: {
    name: "Imperial Emerald & Gold",
    deep: "#09221B",
    primary: "#0F382C",
    medium: "#1A5644",
    light: "#2D7D64",
    tint: "#EBF5F0",
    wash: "#F2F9F5",
    gold: "#D4AF37",
    goldBright: "#F3E0A2",
    goldDim: "#A88828",
    bgTile: "#F3F7F4",
    bgCard: "rgba(250, 255, 252, 0.92)",
    textMain: "#0D2019",
    textMuted: "#39584D",
    fontSerif: "'Cormorant Garamond', Georgia, serif",
    fontScript: "'Great Vibes', cursive",
    fontSans: "'Jost', system-ui, sans-serif",
  },
  rosegold: {
    name: "Ivory Silk & Rose Gold",
    deep: "#3D1E26",
    primary: "#6A2D3C",
    medium: "#944458",
    light: "#C06E82",
    tint: "#FAF0F3",
    wash: "#FDF5F7",
    gold: "#D48B8A",
    goldBright: "#F4CDCC",
    goldDim: "#AC6564",
    bgTile: "#FAF4F3",
    bgCard: "rgba(255, 250, 250, 0.92)",
    textMain: "#280F16",
    textMuted: "#69444D",
    fontSerif: "'Cormorant Garamond', Georgia, serif",
    fontScript: "'Great Vibes', cursive",
    fontSans: "'Jost', system-ui, sans-serif",
  },
  sapphire: {
    name: "Midnight Sapphire & Gold",
    deep: "#091228",
    primary: "#0F1F44",
    medium: "#203B75",
    light: "#3E63AC",
    tint: "#EDF2FB",
    wash: "#F4F7FD",
    gold: "#E5A93C",
    goldBright: "#F8D986",
    goldDim: "#B28020",
    bgTile: "#F2F4F9",
    bgCard: "rgba(248, 250, 255, 0.92)",
    textMain: "#0B1226",
    textMuted: "#435275",
    fontSerif: "'Cormorant Garamond', Georgia, serif",
    fontScript: "'Great Vibes', cursive",
    fontSans: "'Jost', system-ui, sans-serif",
  },
};

export default function PalaceInvitationRenderer({ invitation }: PalaceInvitationRendererProps) {
  // Determine variant (burgundy, emerald, rosegold, sapphire)
  const variantKey = (invitation.settings?.palaceVariant ||
    (invitation.templateId?.includes("emerald") ? "emerald" :
     invitation.templateId?.includes("rosegold") ? "rosegold" :
     invitation.templateId?.includes("sapphire") ? "sapphire" : "burgundy")
  ) as keyof typeof PALACE_THEMES;

  const t = PALACE_THEMES[variantKey] || PALACE_THEMES.burgundy;

  // Envelope loader state
  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // RSVP Form state
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpAttending, setRsvpAttending] = useState<"Will Attend" | "Cannot Attend">("Will Attend");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Fallback defaults from invitation data
  const s = invitation.settings || ({} as any);

  // Helper to extract element texts if not explicitly set in settings
  const getElText = (key: string, fallback: string = ""): string => {
    const el = (invitation.elements || []).find((e) => e.fieldKey === key || e.id === key);
    return el?.text || fallback;
  };

  const getElImg = (key: string, fallback: string = ""): string => {
    const el = (invitation.elements || []).find((e) => e.fieldKey === key || e.id === key || e.type === "image");
    return el?.src || fallback;
  };

  // Content configuration
  const auspiciousSymbol = s.symbol || "ॐ";
  const familyName = s.familyHostName || getElText("family_name", "Shanmughan Family");
  const couple1Bride = getElText("bride_name", "Varsha");
  const couple1Groom = getElText("groom_name", "Ajeesh");
  const couple1Parents = s.storyTitle || "Daughter of Mr. Girish & Mrs. Kanjana Girish";
  const couple1Photo = getElImg("couple_photo_1", "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80");

  const isDualCouple = s.isDualCouple !== undefined ? s.isDualCouple : (invitation.templateId?.includes("palace") && !!s.couple2BrideName);
  const couple2Bride = s.couple2BrideName || "Aiswarya";
  const couple2Groom = s.couple2GroomName || "Akheesh";
  const couple2Parents = s.couple2Parents || "Daughter of Mr. Sajeev & Mrs. Neena Sajeev";
  const couple2Photo = s.couple2Photo || "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=700&q=80";

  const ceremonyTitle = s.ceremonyName || "Thaalikettu";
  const ceremonyDate = invitation.eventDate ? new Date(invitation.eventDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "November 1st, 2026";
  const ceremonyTime = s.ceremonyTime || invitation.eventTime || "8:15 AM — 9:15 AM";
  const ceremonyTemple = s.ceremonyVenue || invitation.venueName || "Guruvayoor Sreekrishnan Temple";
  const ceremonyLocation = s.ceremonyLocation || invitation.venueAddress || "Guruvayoor, Kerala";
  const ceremonyMapUrl = s.ceremonyMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ceremonyTemple}, ${ceremonyLocation}`)}`;

  const receptionTitle = s.receptionName || "An Evening of Joy";
  const receptionDate = s.receptionDate || "November 9th, 2026";
  const receptionTime = s.receptionTime || "5:00 PM — 9:00 PM";
  const receptionAuditorium = s.receptionVenue || "Golden Palace Auditorium";
  const receptionAddress = s.receptionAddress || "Convention Center, Choondal, Thrissur–Kunnamkulam Road";
  const receptionMapUrl = s.receptionMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${receptionAuditorium}, ${receptionAddress}`)}`;

  const invitationNote = s.storyText || invitation.description || "With immense joy, we invite you to join us in celebrating these beautiful beginnings. Your presence and blessings will make these celebrations even more special and memorable.";
  const hostSignoff = invitation.hostNames || s.familyHostName || "Shanmughan & Lalitha Shanmughan";
  const hostFamilySub = "Abhilash, Aparna, Gautam & Our Little Princess";

  // Venues List
  const defaultVenues: VenueEventItem[] = [
    {
      id: "v1",
      tag: `Sacred Ceremony · ${couple1Groom} & ${couple1Bride}`,
      dateBadge: "Nov 1",
      name: ceremonyTemple,
      timeAndPlace: `${ceremonyTime}\n${ceremonyLocation}`,
      mapUrl: ceremonyMapUrl,
    },
    ...(isDualCouple ? [{
      id: "v2",
      tag: `Sacred Ceremony · ${couple2Groom} & ${couple2Bride}`,
      dateBadge: "Nov 8",
      name: s.couple2CeremonyVenue || "Valiyalukkal Devi Temple",
      timeAndPlace: `${s.couple2CeremonyTime || "9:00 AM — 9:30 AM"}\n${s.couple2CeremonyLocation || "Kanimangalam, Kerala"}`,
      mapUrl: s.couple2CeremonyMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Valiyalukkal Devi Temple, Kanimangalam, Kerala")}`,
    }] : []),
    {
      id: "v3",
      tag: isDualCouple ? "Grand Reception · Both Couples" : `Grand Reception · ${couple1Groom} & ${couple1Bride}`,
      dateBadge: "Nov 9",
      name: receptionAuditorium,
      timeAndPlace: `${receptionAddress}\n${receptionTime}`,
      mapUrl: receptionMapUrl,
    },
  ];

  const venueList = s.venueEvents && s.venueEvents.length > 0 ? s.venueEvents : defaultVenues;

  // Gallery Photos
  const defaultGallery = [
    couple1Photo,
    couple2Photo,
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=700&q=80",
  ];
  const galleryImages = invitation.images && invitation.images.length > 0 
    ? invitation.images.map((img) => img.url) 
    : defaultGallery;

  // Direct Contacts
  const defaultContacts: ContactItem[] = [
    { id: "c1", label: "Call or WhatsApp", phone: s.contactPhone || "+91 6282 342 270" },
    { id: "c2", label: "Call or WhatsApp", phone: s.whatsappPhone || "+91 9496 278 238" },
    { id: "c3", label: "Family Hotline", phone: "+91 9447 308 050" },
  ];
  const contactList = s.contacts && s.contacts.length > 0 ? s.contacts : defaultContacts;

  // Toggle Audio
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    if (audioRef.current && !isPlayingMusic) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    setRsvpSubmitting(true);
    setTimeout(() => {
      setRsvpSubmitting(false);
      setRsvpSubmitted(true);
    }, 900);
  };

  return (
    <div 
      className="min-h-screen py-0 sm:py-8 flex flex-col items-center justify-start relative select-none font-sans"
      style={{
        backgroundColor: t.deep,
        color: t.textMain,
        backgroundImage: `radial-gradient(ellipse at 50% 15%, ${t.medium}44 0%, ${t.deep} 60%)`,
      }}
    >
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={s.musicUrl || "https://assets.mixkit.co/music/preview/mixkit-wedding-waltz-piano-music-244.mp3"}
        loop
        preload="auto"
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ENVELOPE OPENING LOADER (Tap To Open)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ${
          isOpened ? "opacity-0 pointer-events-none scale-105" : "opacity-100 pointer-events-auto"
        }`}
        style={{
          backgroundColor: t.deep,
          backgroundImage: `radial-gradient(circle at 50% 35%, ${t.medium}66 0%, ${t.deep} 75%)`,
        }}
      >
        <div className="w-full max-w-[420px] px-6 flex flex-col items-center justify-center relative">
          {/* Floating Envelope Composition */}
          <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center mb-8">
            {/* Envelope Back Flap (Vector SVG) */}
            <svg 
              viewBox="0 0 340 260" 
              className="absolute inset-0 w-full h-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.55)]"
            >
              <polygon points="10,240 170,110 330,240" fill={t.deep} stroke={t.gold} strokeWidth="1" />
              <polygon points="10,20 170,130 330,20" fill={t.primary} stroke={t.gold} strokeWidth="1" />
              <rect x="10" y="20" width="320" height="220" rx="6" fill={t.deep} stroke={t.gold} strokeWidth="1.2" opacity="0.95" />
            </svg>

            {/* Invitation Card Peeking From Pocket */}
            <div 
              className={`absolute w-[78%] bg-white rounded-lg p-5 text-center shadow-xl border border-stone-200 transition-all duration-1000 ${
                isOpened ? "-translate-y-24 scale-105 opacity-0" : "translate-y-[-10px] scale-100"
              }`}
              style={{
                boxShadow: `0 -10px 25px rgba(0,0,0,0.18), 0 0 0 1px ${t.gold}44`,
              }}
            >
              <p 
                className="text-[9px] tracking-[0.3em] uppercase font-semibold mb-2"
                style={{ color: t.medium }}
              >
                TOGETHER WITH THEIR FAMILIES
              </p>
              <p className="font-serif text-lg tracking-wider font-normal leading-tight uppercase" style={{ color: t.textMain }}>
                {couple1Groom} <span className="font-serif italic font-normal text-base" style={{ color: t.medium }}>&</span> {couple1Bride}
              </p>
              {isDualCouple && (
                <>
                  <p className="text-[11px] font-serif italic text-stone-500 my-0.5">and</p>
                  <p className="font-serif text-lg tracking-wider font-normal leading-tight uppercase" style={{ color: t.textMain }}>
                    {couple2Groom} <span className="font-serif italic font-normal text-base" style={{ color: t.medium }}>&</span> {couple2Bride}
                  </p>
                </>
              )}
              <div className="w-12 h-[1px] mx-auto my-2" style={{ backgroundColor: t.gold }} />
              <p className="text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: t.medium }}>
                {ceremonyDate}
              </p>
            </div>

            {/* Envelope Pocket Front & Triangular Flap */}
            <svg 
              viewBox="0 0 340 260" 
              className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md z-10"
            >
              <polygon points="10,240 170,120 330,240" fill={t.primary} opacity="0.95" stroke={t.gold} strokeWidth="1" />
              <polygon points="10,20 10,240 170,135" fill={t.deep} opacity="0.9" />
              <polygon points="330,20 330,240 170,135" fill={t.deep} opacity="0.9" />
            </svg>

            {/* 3D Wax Seal Badge */}
            <div 
              className="absolute z-20 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${t.goldBright} 0%, ${t.gold} 50%, ${t.goldDim} 100%)`,
                bottom: "22%",
                border: "2px solid rgba(255,255,255,0.4)",
              }}
              onClick={handleOpenEnvelope}
            >
              <div className="w-10 h-10 rounded-full border border-amber-900/30 flex items-center justify-center text-amber-950 font-serif font-bold text-xs">
                ✦
              </div>
            </div>
          </div>

          {/* TAP TO OPEN Button with Breathing Ring */}
          <div className="relative flex items-center justify-center mt-2">
            <div 
              className="absolute -inset-3 rounded-full animate-ping opacity-30"
              style={{ backgroundColor: t.gold }}
            />
            <button
              onClick={handleOpenEnvelope}
              className="relative px-8 py-3.5 rounded-full text-[11px] font-bold tracking-[0.3em] uppercase text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 border border-white/20"
              style={{
                backgroundColor: t.primary,
                boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${t.gold}44`,
              }}
            >
              <span>Tap to Open</span>
              <span className="text-amber-300">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MAIN LUXURY MOBILE STAGE CONTAINER (max-width: 430px)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main 
        id="palace-app"
        className="w-full max-w-[430px] min-h-screen relative overflow-x-hidden shadow-[0_0_100px_rgba(0,0,0,0.85)] border-0 sm:border sm:border-white/10"
        style={{
          backgroundColor: t.bgTile,
          color: t.textMain,
        }}
      >
        {/* Floating Replay / Reset Envelope Control */}
        {isOpened && (
          <button
            onClick={() => setIsOpened(false)}
            className="fixed bottom-4 left-4 z-40 bg-stone-900/80 hover:bg-stone-900 text-white/80 hover:text-white p-2.5 rounded-full backdrop-blur-md shadow-lg border border-white/10 transition active:scale-95"
            title="Replay Envelope Unsealing"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* ═════════════════════════════════════════════════════════════
            1. HERO SECTION — Royal Family Announcement
        ═════════════════════════════════════════════════════════════ */}
        <section 
          className="relative min-h-[92vh] sm:min-h-[820px] flex flex-col justify-between p-6 sm:p-8 text-center overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, ${t.medium}15 0%, transparent 70%)`,
          }}
        >
          {/* Top Bar: Date & Floating Music Waves Button */}
          <div className="relative z-10 flex items-center justify-between pt-2">
            <div className="w-9" />
            <span 
              className="text-[10px] tracking-[0.35em] uppercase font-semibold"
              style={{ color: t.textMuted }}
            >
              {ceremonyDate.toUpperCase()}
            </span>
            <button
              onClick={toggleMusic}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 border backdrop-blur-sm relative ${
                isPlayingMusic ? "shadow-[0_0_14px_rgba(212,167,106,0.6)]" : ""
              }`}
              style={{
                backgroundColor: "rgba(255,255,255,0.45)",
                borderColor: t.medium,
                color: t.primary,
              }}
              title={isPlayingMusic ? "Mute Background Music" : "Play Background Music"}
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Golden Sparkles Floating Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-[18%] left-[14%] w-1.5 h-1.5 rounded-full bg-amber-300 opacity-80 blur-[0.5px] animate-pulse" />
            <div className="absolute top-[34%] right-[16%] w-2 h-2 rounded-full bg-amber-400 opacity-70 blur-[0.5px] animate-ping" />
            <div className="absolute top-[52%] left-[20%] w-1.5 h-1.5 rounded-full bg-amber-200 opacity-60 animate-bounce" />
            <div className="absolute top-[70%] right-[22%] w-2 h-2 rounded-full bg-amber-300 opacity-75 blur-[0.5px] animate-pulse" />
          </div>

          {/* Hero Core Content */}
          <div className="relative z-10 my-auto py-6 flex flex-col items-center">
            {/* Auspicious Symbol (ॐ / Cross / Crescent / Monogram) */}
            <div 
              className="text-3xl font-serif mb-2 transition-transform hover:scale-110 drop-shadow-sm"
              style={{ color: t.medium }}
            >
              {auspiciousSymbol}
            </div>

            {/* Cordial Welcome Eyebrow */}
            <p 
              className="text-[10px] tracking-[0.38em] uppercase font-medium mb-3"
              style={{ color: t.textMuted }}
            >
              You Are Cordially Invited
            </p>

            {/* Ornamental Flourish Divider */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-[1px]" style={{ backgroundColor: t.medium, opacity: 0.6 }} />
              <span className="text-xs" style={{ color: t.medium }}>❦</span>
              <span className="w-10 h-[1px]" style={{ backgroundColor: t.medium, opacity: 0.6 }} />
            </div>

            {/* Family Header */}
            <p 
              className="text-[11px] tracking-[0.32em] uppercase font-bold mb-6"
              style={{ color: t.primary }}
            >
              {familyName}
            </p>

            {/* Couples Names Block */}
            <div className="space-y-4 my-2">
              {/* Couple 1 */}
              <div>
                <h1 
                  className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-wider leading-none"
                  style={{ color: t.textMain }}
                >
                  {couple1Groom}
                </h1>
                <div 
                  className="font-serif italic text-2xl my-0.5 leading-none"
                  style={{ color: t.medium }}
                >
                  &
                </div>
                <h1 
                  className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-wider leading-none"
                  style={{ color: t.textMain }}
                >
                  {couple1Bride}
                </h1>
              </div>

              {/* Dual Wedding Separator & Couple 2 */}
              {isDualCouple && (
                <>
                  <div className="flex items-center justify-center gap-2 py-1">
                    <span className="w-12 h-[1px]" style={{ backgroundColor: t.gold, opacity: 0.5 }} />
                    <span className="text-xs italic font-serif text-stone-500">and</span>
                    <span className="w-12 h-[1px]" style={{ backgroundColor: t.gold, opacity: 0.5 }} />
                  </div>

                  <div>
                    <h2 
                      className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-wider leading-none"
                      style={{ color: t.textMain }}
                    >
                      {couple2Groom}
                    </h2>
                    <div 
                      className="font-serif italic text-2xl my-0.5 leading-none"
                      style={{ color: t.medium }}
                    >
                      &
                    </div>
                    <h2 
                      className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-wider leading-none"
                      style={{ color: t.textMain }}
                    >
                      {couple2Bride}
                    </h2>
                  </div>
                </>
              )}
            </div>

            {/* Date & Destination */}
            <div className="mt-6 space-y-1">
              <p 
                className="text-[11px] tracking-[0.24em] uppercase font-bold"
                style={{ color: t.textMain }}
              >
                {ceremonyDate}
              </p>
              <p 
                className="text-[10px] tracking-[0.2em] uppercase font-medium"
                style={{ color: t.textMuted }}
              >
                {ceremonyLocation}
              </p>
            </div>
          </div>

          {/* Bottom Live Countdown Bar & Maps Anchor */}
          <div 
            className="relative z-10 pt-4 border-t"
            style={{ borderColor: `${t.medium}26` }}
          >
            <div className="mb-3">
              <CountdownTimer targetDate={invitation.eventDate || "2026-11-01T09:00:00.000Z"} themeColor={t.primary} />
            </div>

            <a
              href={ceremonyMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.24em] uppercase font-semibold hover:underline"
              style={{ color: t.medium }}
            >
              <MapPin className="w-3 h-3" />
              <span>{ceremonyTemple}</span>
            </a>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SPIRAL BINDING DIVIDER (SVG Vector Coils)
        ═════════════════════════════════════════════════════════════ */}
        <SpiralBindingDivider themeColor={t.gold} />

        {/* ═════════════════════════════════════════════════════════════
            2. INVITATION / PINNED HOST NOTE
        ═════════════════════════════════════════════════════════════ */}
        <section className="py-12 px-6 text-center relative">
          <p 
            className="text-[10px] tracking-[0.35em] uppercase font-semibold mb-1"
            style={{ color: t.medium }}
          >
            Dear Friends & Family
          </p>
          <h2 
            className="font-serif italic text-2xl mb-6"
            style={{ color: t.primary }}
          >
            You&apos;re Invited
          </h2>

          {/* Slanted Pinned Card */}
          <div 
            className="relative mx-auto max-w-[340px] p-6 rounded-lg shadow-xl -rotate-1 transition-transform hover:rotate-0"
            style={{
              backgroundColor: "#FDF8F3",
              border: `1px solid ${t.gold}66`,
              boxShadow: `0 12px 35px rgba(91,0,24,0.08), inset 0 0 0 1px ${t.medium}22`,
            }}
          >
            {/* Top Pin Emblem */}
            <div 
              className="w-3 h-3 rounded-full mx-auto -mt-2 mb-4 border border-amber-900/30 shadow-sm"
              style={{ backgroundColor: t.gold }}
            />

            <p className="font-serif text-sm leading-relaxed text-stone-800 font-normal mb-6">
              &quot;{invitationNote}&quot;
            </p>

            <div className="space-y-1">
              <span className="font-serif italic text-xl block" style={{ color: t.medium }}>
                With Love,
              </span>
              <p className="font-serif font-bold text-sm text-stone-900 leading-tight">
                {hostSignoff}
              </p>
              <p className="font-serif italic text-xs text-stone-500">
                {hostFamilySub}
              </p>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SPIRAL BINDING DIVIDER
        ═════════════════════════════════════════════════════════════ */}
        <SpiralBindingDivider themeColor={t.gold} />

        {/* ═════════════════════════════════════════════════════════════
            3. COUPLE 1 — ARCHED PORTRAIT & SACRED CEREMONY
        ═════════════════════════════════════════════════════════════ */}
        <section className="py-12 px-6 text-center relative">
          <span 
            className="text-[10px] tracking-[0.38em] uppercase font-bold mb-2 block"
            style={{ color: t.medium }}
          >
            {isDualCouple ? "Couple One" : "The Blessed Couple"}
          </span>

          {/* Arched Photo Frame with Wax Seal Medallion */}
          <div 
            className="relative mx-auto w-[230px] aspect-[3/4] p-2 rounded-t-full shadow-2xl transition-all duration-500 hover:-translate-y-1 mb-8"
            style={{
              background: `linear-gradient(180deg, #FDF8F3 0%, ${t.bgTile} 100%)`,
              border: `1.5px solid ${t.gold}`,
              boxShadow: `0 14px 40px rgba(91,0,24,0.12), inset 0 0 0 1px ${t.medium}22`,
            }}
          >
            <div className="w-full h-full rounded-t-full overflow-hidden">
              <img
                src={couple1Photo}
                alt={`${couple1Groom} & ${couple1Bride}`}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Wax Seal Medallion on Arch Base */}
            <div 
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${t.goldBright} 0%, ${t.gold} 60%, ${t.goldDim} 100%)`,
              }}
            >
              <Heart className="w-4 h-4 fill-amber-950 text-amber-950" />
            </div>
          </div>

          {/* Names */}
          <div className="mb-4">
            <h3 className="font-serif text-3xl font-light uppercase tracking-wider text-stone-900 leading-tight">
              {couple1Groom}
            </h3>
            <span className="font-serif italic text-2xl block -my-1" style={{ color: t.medium }}>
              &
            </span>
            <h3 className="font-serif text-3xl font-light uppercase tracking-wider text-stone-900 leading-tight">
              {couple1Bride}
            </h3>
          </div>

          {/* Parents */}
          <div className="mb-6">
            <p className="text-[9px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: t.medium }}>
              Daughter of
            </p>
            <p className="font-serif text-sm text-stone-700">{couple1Parents}</p>
          </div>

          {/* Sacred Ceremony Card (Thaalikettu) */}
          <div 
            className="relative mx-auto max-w-[340px] p-6 rounded-2xl text-center backdrop-blur-md shadow-lg border"
            style={{
              backgroundColor: t.bgCard,
              borderColor: `${t.medium}33`,
              boxShadow: `0 8px 30px rgba(91,0,24,0.06), inset 0 0 0 1px ${t.gold}44`,
            }}
          >
            {/* Top Accent Strip */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{
                background: `linear-gradient(90deg, ${t.goldDim}, ${t.primary}, ${t.goldBright}, ${t.primary}, ${t.goldDim})`,
              }}
            />

            <div 
              className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center border"
              style={{
                backgroundColor: `${t.medium}15`,
                borderColor: `${t.gold}66`,
                color: t.primary,
              }}
            >
              <Heart className="w-4 h-4 fill-current" />
            </div>

            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: t.medium }}>
              Sacred Ceremony
            </p>
            <h4 className="font-serif italic text-2xl font-normal mb-1" style={{ color: t.primary }}>
              {ceremonyTitle}
            </h4>
            <p className="font-serif text-lg text-stone-900 font-medium mb-0.5">{ceremonyDate}</p>
            <p className="text-[11px] tracking-widest font-mono text-stone-500 mb-4">{ceremonyTime}</p>

            <div className="mb-5">
              <strong className="font-serif text-base text-stone-900 block">{ceremonyTemple}</strong>
              <span className="text-xs text-stone-600 block">{ceremonyLocation}</span>
            </div>

            <a
              href={ceremonyMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold text-white shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundColor: t.primary }}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            (OPTIONAL) 4. COUPLE 2 — ARCHED PORTRAIT & CEREMONY
        ═════════════════════════════════════════════════════════════ */}
        {isDualCouple && (
          <>
            <SpiralBindingDivider themeColor={t.gold} />

            <section className="py-12 px-6 text-center relative">
              <span 
                className="text-[10px] tracking-[0.38em] uppercase font-bold mb-2 block"
                style={{ color: t.medium }}
              >
                Couple Two
              </span>

              {/* Arched Photo Frame with Wax Seal */}
              <div 
                className="relative mx-auto w-[230px] aspect-[3/4] p-2 rounded-t-full shadow-2xl transition-all duration-500 hover:-translate-y-1 mb-8"
                style={{
                  background: `linear-gradient(180deg, #FDF8F3 0%, ${t.bgTile} 100%)`,
                  border: `1.5px solid ${t.gold}`,
                  boxShadow: `0 14px 40px rgba(91,0,24,0.12), inset 0 0 0 1px ${t.medium}22`,
                }}
              >
                <div className="w-full h-full rounded-t-full overflow-hidden">
                  <img
                    src={couple2Photo}
                    alt={`${couple2Groom} & ${couple2Bride}`}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                </div>

                <div 
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, #FFFFFF 0%, #E8E5DF 60%, #C4BFAF 100%)`,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-amber-800" />
                </div>
              </div>

              {/* Names */}
              <div className="mb-4">
                <h3 className="font-serif text-3xl font-light uppercase tracking-wider text-stone-900 leading-tight">
                  {couple2Groom}
                </h3>
                <span className="font-serif italic text-2xl block -my-1" style={{ color: t.medium }}>
                  &
                </span>
                <h3 className="font-serif text-3xl font-light uppercase tracking-wider text-stone-900 leading-tight">
                  {couple2Bride}
                </h3>
              </div>

              {/* Parents */}
              <div className="mb-6">
                <p className="text-[9px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: t.medium }}>
                  Daughter of
                </p>
                <p className="font-serif text-sm text-stone-700">{couple2Parents}</p>
              </div>

              {/* Ceremony Card */}
              <div 
                className="relative mx-auto max-w-[340px] p-6 rounded-2xl text-center backdrop-blur-md shadow-lg border"
                style={{
                  backgroundColor: t.bgCard,
                  borderColor: `${t.medium}33`,
                  boxShadow: `0 8px 30px rgba(91,0,24,0.06), inset 0 0 0 1px ${t.gold}44`,
                }}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{
                    background: `linear-gradient(90deg, ${t.goldDim}, ${t.primary}, ${t.goldBright}, ${t.primary}, ${t.goldDim})`,
                  }}
                />

                <div 
                  className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center border"
                  style={{
                    backgroundColor: `${t.medium}15`,
                    borderColor: `${t.gold}66`,
                    color: t.primary,
                  }}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </div>

                <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: t.medium }}>
                  Sacred Ceremony
                </p>
                <h4 className="font-serif italic text-2xl font-normal mb-1" style={{ color: t.primary }}>
                  {s.couple2CeremonyName || "Thaalikettu"}
                </h4>
                <p className="font-serif text-lg text-stone-900 font-medium mb-0.5">{s.couple2CeremonyDate || "November 8th, 2026"}</p>
                <p className="text-[11px] tracking-widest font-mono text-stone-500 mb-4">{s.couple2CeremonyTime || "9:00 AM — 9:30 AM"}</p>

                <div className="mb-5">
                  <strong className="font-serif text-base text-stone-900 block">{s.couple2CeremonyVenue || "Valiyalukkal Devi Temple"}</strong>
                  <span className="text-xs text-stone-600 block">{s.couple2CeremonyLocation || "Kanimangalam, Kerala"}</span>
                </div>

                <a
                  href={s.couple2CeremonyMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Valiyalukkal Devi Temple, Kanimangalam, Kerala")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold text-white shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ backgroundColor: t.primary }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </section>
          </>
        )}

        {/* ═════════════════════════════════════════════════════════════
            SPIRAL BINDING DIVIDER
        ═════════════════════════════════════════════════════════════ */}
        <SpiralBindingDivider themeColor={t.gold} />

        {/* ═════════════════════════════════════════════════════════════
            5. GRAND VELVET RECEPTION SECTION
        ═════════════════════════════════════════════════════════════ */}
        <section 
          className="py-14 px-6 text-center relative overflow-hidden text-white"
          style={{
            backgroundColor: t.deep,
            backgroundImage: `radial-gradient(ellipse at 50% 35%, ${t.medium}66 0%, transparent 75%)`,
          }}
        >
          <span 
            className="text-[10px] tracking-[0.38em] uppercase font-bold mb-1 block"
            style={{ color: t.goldDim }}
          >
            Together In Celebration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light mb-1" style={{ color: t.goldBright }}>
            Reception
          </h2>
          <span className="font-serif italic text-2xl block mb-6" style={{ color: t.gold }}>
            {receptionTitle}
          </span>

          <div 
            className="w-16 h-[1.5px] mx-auto mb-8"
            style={{ background: `linear-gradient(90deg, transparent, ${t.gold}, transparent)` }}
          />

          {/* Couple Names Headline */}
          <div className="space-y-2 mb-8">
            <p className="font-serif text-xl sm:text-2xl tracking-widest uppercase font-light text-white">
              {couple1Groom} <span className="font-serif italic lowercase text-lg" style={{ color: t.goldBright }}>&</span> {couple1Bride}
            </p>
            {isDualCouple && (
              <>
                <div className="flex items-center justify-center gap-3 opacity-60">
                  <span className="w-8 h-[1px] bg-amber-200" />
                  <span className="text-[10px] text-amber-200">❖</span>
                  <span className="w-8 h-[1px] bg-amber-200" />
                </div>
                <p className="font-serif text-xl sm:text-2xl tracking-widest uppercase font-light text-white">
                  {couple2Groom} <span className="font-serif italic lowercase text-lg" style={{ color: t.goldBright }}>&</span> {couple2Bride}
                </p>
              </>
            )}
          </div>

          {/* Big Date & Time */}
          <p className="font-serif text-3xl sm:text-4xl font-light text-white mb-1">
            {receptionDate}
          </p>
          <p className="text-[11px] tracking-[0.2em] uppercase font-medium mb-6" style={{ color: t.gold }}>
            {receptionTime}
          </p>

          {/* Venue & Maps Button */}
          <div className="mb-8">
            <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide mb-1" style={{ color: t.goldBright }}>
              {receptionAuditorium}
            </h3>
            <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
              {receptionAddress}
            </p>
          </div>

          <a
            href={receptionMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-[10px] tracking-[0.22em] uppercase font-bold transition-all duration-300 hover:scale-105 active:scale-95 border"
            style={{
              color: t.goldBright,
              borderColor: `${t.gold}88`,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </a>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SPIRAL BINDING DIVIDER
        ═════════════════════════════════════════════════════════════ */}
        <SpiralBindingDivider themeColor={t.gold} />

        {/* ═════════════════════════════════════════════════════════════
            6. SAVE THE DATES / WEDDING VENUES
        ═════════════════════════════════════════════════════════════ */}
        <section className="py-12 px-6 text-center relative">
          <span 
            className="text-[10px] tracking-[0.38em] uppercase font-bold mb-1 block"
            style={{ color: t.medium }}
          >
            Save The Dates
          </span>
          <h2 className="font-serif text-3xl font-light text-stone-900 mb-6">
            Wedding Venues
          </h2>

          <div className="space-y-4">
            {venueList.map((venue) => (
              <div
                key={venue.id}
                className="rounded-2xl p-4 text-center backdrop-blur-sm border shadow-sm transition-all hover:shadow-md"
                style={{
                  backgroundColor: t.bgCard,
                  borderColor: `${t.medium}26`,
                }}
              >
                {/* Header Tag with Script Date */}
                <div 
                  className="flex items-center justify-between p-3 rounded-xl mb-3 border border-dashed"
                  style={{
                    backgroundColor: `${t.medium}0D`,
                    borderColor: `${t.gold}66`,
                  }}
                >
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-700">
                    {venue.tag}
                  </span>
                  <span className="font-serif italic text-lg font-bold" style={{ color: t.primary }}>
                    {venue.dateBadge}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-medium text-stone-900 mb-1">
                  {venue.name}
                </h3>
                <p className="text-xs text-stone-600 whitespace-pre-line leading-relaxed mb-4">
                  {venue.timeAndPlace}
                </p>

                {venue.mapUrl && (
                  <a
                    href={venue.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold text-white shadow transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{ backgroundColor: t.primary }}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Open in Google Maps</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SPIRAL BINDING DIVIDER
        ═════════════════════════════════════════════════════════════ */}
        <SpiralBindingDivider themeColor={t.gold} />

        {/* ═════════════════════════════════════════════════════════════
            7. "OUR STORY THROUGH THE LENS" INFINITE CAROUSEL
        ═════════════════════════════════════════════════════════════ */}
        <section 
          className="py-12 px-0 text-center relative overflow-hidden"
          style={{ backgroundColor: t.wash }}
        >
          <span 
            className="text-[10px] tracking-[0.38em] uppercase font-bold mb-1 block"
            style={{ color: t.medium }}
          >
            Captured Moments
          </span>
          <h2 className="font-serif text-3xl font-light text-stone-900 mb-1">
            Our Story
          </h2>
          <span className="font-serif italic text-xl block mb-6" style={{ color: t.medium }}>
            Through the lens
          </span>

          {/* Continuous Auto-Scrolling Track with Gradient Mask */}
          <div className="relative w-full overflow-hidden mask-gradient py-2">
            <div className="flex gap-3 w-max animate-[scrollTrack_28s_linear_infinite] hover:[animation-play-state:paused]">
              {/* Duplicate set for seamless continuous loop */}
              {[...galleryImages, ...galleryImages].map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  className="w-[200px] h-[280px] rounded-xl overflow-hidden shrink-0 shadow-md border border-stone-200/80 group"
                >
                  <img
                    src={imgUrl}
                    alt="Celebration moment"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SPIRAL BINDING DIVIDER
        ═════════════════════════════════════════════════════════════ */}
        <SpiralBindingDivider themeColor={t.gold} />

        {/* ═════════════════════════════════════════════════════════════
            8. INTERACTIVE RSVP FORM & DIRECT CONTACTS
        ═════════════════════════════════════════════════════════════ */}
        <section className="py-12 px-6 relative">
          <div className="text-center mb-6">
            <span 
              className="text-[10px] tracking-[0.38em] uppercase font-bold mb-1 block"
              style={{ color: t.medium }}
            >
              Confirm Attendance
            </span>
            <h2 className="font-serif text-3xl font-light text-stone-900 mb-1">
              RSVP
            </h2>
            <span className="font-serif italic text-xl block" style={{ color: t.medium }}>
              Please respond
            </span>
          </div>

          {/* Form */}
          {!rsvpSubmitted ? (
            <form onSubmit={handleRsvpSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase font-bold block mb-1" style={{ color: t.medium }}>
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  className="w-full bg-transparent border-b py-2 text-base font-serif focus:outline-none transition-colors"
                  style={{ borderColor: `${t.medium}44`, color: t.textMain }}
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase font-bold block mb-1" style={{ color: t.medium }}>
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={rsvpGuests}
                  onChange={(e) => setRsvpGuests(e.target.value)}
                  className="w-full bg-transparent border-b py-2 text-base font-serif focus:outline-none transition-colors"
                  style={{ borderColor: `${t.medium}44`, color: t.textMain }}
                />
              </div>

              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold block mb-2" style={{ color: t.medium }}>
                  Will you be attending?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpAttending("Will Attend")}
                    className={`p-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                      rsvpAttending === "Will Attend" ? "text-white shadow-md" : "text-stone-700 bg-white/60"
                    }`}
                    style={{
                      backgroundColor: rsvpAttending === "Will Attend" ? t.primary : undefined,
                      borderColor: rsvpAttending === "Will Attend" ? t.primary : `${t.medium}33`,
                    }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Will Attend</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRsvpAttending("Cannot Attend")}
                    className={`p-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                      rsvpAttending === "Cannot Attend" ? "text-white shadow-md" : "text-stone-700 bg-white/60"
                    }`}
                    style={{
                      backgroundColor: rsvpAttending === "Cannot Attend" ? t.primary : undefined,
                      borderColor: rsvpAttending === "Cannot Attend" ? t.primary : `${t.medium}33`,
                    }}
                  >
                    <span>Cannot Attend</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase font-bold block mb-1" style={{ color: t.medium }}>
                  Wishes For The Newlyweds
                </label>
                <textarea
                  rows={2}
                  placeholder="Share your blessings and heartfelt wishes..."
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  className="w-full bg-transparent border-b py-2 text-base font-serif focus:outline-none transition-colors resize-none"
                  style={{ borderColor: `${t.medium}44`, color: t.textMain }}
                />
              </div>

              <button
                type="submit"
                disabled={rsvpSubmitting}
                className="w-full py-4 rounded-xl text-xs font-bold tracking-[0.28em] uppercase text-white shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: t.primary }}
              >
                {rsvpSubmitting ? (
                  <span>Submitting RSVP...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm RSVP</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div 
              className="p-8 rounded-2xl text-center space-y-3 border animate-in fade-in"
              style={{
                backgroundColor: t.wash,
                borderColor: `${t.medium}33`,
              }}
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white text-lg font-bold shadow-md"
                style={{ backgroundColor: t.primary }}
              >
                ✓
              </div>
              <h3 className="font-serif italic text-2xl font-bold" style={{ color: t.primary }}>
                Thank you!
              </h3>
              <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                Your RSVP response has been received with warm gratitude. We look forward to celebrating together!
              </p>
              <button
                onClick={() => setRsvpSubmitted(false)}
                className="text-[10px] tracking-wider uppercase font-bold underline pt-2 block mx-auto"
                style={{ color: t.medium }}
              >
                Submit another response
              </button>
            </div>
          )}

          {/* Direct Host Hotlines */}
          <div className="mt-10 pt-6 border-t" style={{ borderColor: `${t.medium}22` }}>
            <span 
              className="text-[10px] tracking-[0.26em] uppercase font-bold text-center block mb-4"
              style={{ color: t.medium }}
            >
              Or Reach Us Directly
            </span>

            <div className="space-y-2.5">
              {contactList.map((contact) => (
                <a
                  key={contact.id}
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 p-3 rounded-full backdrop-blur-md shadow-xs border transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: t.bgCard,
                    borderColor: `${t.medium}33`,
                  }}
                >
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${t.medium}15`,
                      borderColor: `${t.gold}66`,
                      color: t.primary,
                    }}
                  >
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold font-mono tracking-wide text-stone-900">
                      {contact.phone}
                    </p>
                    <p className="text-[10px] tracking-wider uppercase text-stone-500">
                      {contact.label}
                    </p>
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase text-white shrink-0"
                    style={{ backgroundColor: t.primary }}
                  >
                    Call
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SPIRAL BINDING DIVIDER
        ═════════════════════════════════════════════════════════════ */}
        <SpiralBindingDivider themeColor={t.gold} />

        {/* ═════════════════════════════════════════════════════════════
            9. FOOTER
        ═════════════════════════════════════════════════════════════ */}
        <footer 
          className="py-12 px-6 text-center text-white relative overflow-hidden"
          style={{
            backgroundColor: t.deep,
            backgroundImage: `radial-gradient(ellipse at 50% 50%, ${t.medium}44 0%, transparent 70%)`,
          }}
        >
          <p className="font-serif italic text-2xl font-light mb-1" style={{ color: t.goldBright }}>
            {couple1Groom} & {couple1Bride}
          </p>
          {isDualCouple && (
            <p className="font-serif italic text-2xl font-light mb-2" style={{ color: t.goldBright }}>
              {couple2Groom} & {couple2Bride}
            </p>
          )}

          <div 
            className="w-10 h-[1px] mx-auto my-3"
            style={{ background: `linear-gradient(90deg, transparent, ${t.gold}, transparent)` }}
          />

          <p className="text-[10px] tracking-[0.28em] uppercase font-medium" style={{ color: t.goldDim }}>
            {ceremonyDate}
          </p>

          <p className="text-[9px] tracking-[0.16em] uppercase text-white/40 mt-6">
            Handcrafted with love
          </p>
        </footer>
      </main>

      {/* Global CSS for Infinite Carousel Scrolling */}
      <style jsx global>{`
        @keyframes scrollTrack {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%);
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponent: Realistic Silver/Gold Spiral Coil Binding Divider
// ─────────────────────────────────────────────────────────────────────────────
function SpiralBindingDivider({ themeColor }: { themeColor: string }) {
  return (
    <div className="w-full h-11 flex items-center justify-center my-1 pointer-events-none select-none overflow-hidden">
      <svg 
        viewBox="0 0 420 36" 
        className="w-full h-9 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="spiralCoilGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="35%" stopColor={themeColor} />
            <stop offset="70%" stopColor="#6E502B" />
            <stop offset="100%" stopColor="#2E1C0A" />
          </linearGradient>
          <filter id="coilShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Coil Holes & Rings Row */}
        {Array.from({ length: 21 }).map((_, i) => {
          const x = 12 + i * 19.5;
          return (
            <g key={i} filter="url(#coilShadow)">
              {/* Paper Hole Punch */}
              <ellipse cx={x} cy="18" rx="3.5" ry="5.5" fill="#1C1815" opacity="0.35" />
              {/* Wire Coil Loop */}
              <path
                d={`M ${x - 3} 6 C ${x - 2} 0, ${x + 6} 0, ${x + 7} 6 L ${x + 4} 30 C ${x + 3} 36, ${x - 5} 36, ${x - 4} 30 Z`}
                fill="url(#spiralCoilGrad)"
                stroke={themeColor}
                strokeWidth="0.5"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
