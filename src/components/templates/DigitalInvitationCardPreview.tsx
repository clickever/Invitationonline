"use client";

import React from "react";
import { Template } from "@/lib/types";

interface DigitalInvitationCardPreviewProps {
  template: Template;
  className?: string;
  showBadge?: boolean;
}

export default function DigitalInvitationCardPreview({
  template,
  className = "",
  showBadge = true,
}: DigitalInvitationCardPreviewProps) {
  const id = template.id;

  // Render specific bespoke invitation card designs matching actual templates
  const renderCardContent = () => {
    switch (id) {
      // 1. ROYAL BURGUNDY VELVET PALACE WEDDING
      case "wedding-palace-burgundy":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#4A0012] via-[#630018] to-[#2B000A] text-[#F5EDE6] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            {/* Background Texture & Soft Shimmer */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,167,106,0.18),transparent_70%)] pointer-events-none" />
            
            {/* Arched Gold Foil Border */}
            <div className="absolute inset-2.5 rounded-t-[100px] rounded-b-2xl border-2 border-[#D4A76A]/70 pointer-events-none flex items-center justify-center">
              <div className="absolute inset-1 rounded-t-[94px] rounded-b-xl border border-[#D4A76A]/30" />
            </div>

            {/* Top Auspicious Symbol */}
            <div className="relative z-10 pt-3">
              <div className="text-xl text-[#F6E27A] font-serif leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                ॐ
              </div>
              <p className="text-[7px] uppercase tracking-[0.25em] text-[#E8C89B] font-semibold mt-1">
                SHANMUGHAN FAMILY
              </p>
              <p className="text-[6px] uppercase tracking-[0.18em] text-[#CDB396] mt-0.5">
                CORDIALLY INVITES YOU
              </p>
            </div>

            {/* Couple Names in Romantic Calligraphy */}
            <div className="relative z-10 my-auto py-1">
              <span className="block text-[6.5px] uppercase tracking-[0.2em] text-[#D4A76A] mb-0.5">
                TO CELEBRATE THE WEDDING OF
              </span>
              <h4 
                className="text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#F6E27A] to-[#E5BE62] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-normal leading-tight"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Ananya & Arjun
              </h4>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4A76A] to-transparent mx-auto my-1" />
              <p className="text-[6.5px] uppercase tracking-[0.18em] text-[#F0DBC4] font-medium">
                SUNDAY, 28 DECEMBER 2026
              </p>
              <p className="text-[6px] tracking-wider text-[#D4A76A]/90">
                MUHURTHAM: 10:30 AM
              </p>
            </div>

            {/* Venue & Royal Wax Seal */}
            <div className="relative z-10 pb-2 flex flex-col items-center">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#E8C89B]">
                THE GRAND PALACE • KOVALAM
              </p>

              {/* 3D Gold & Burgundy Wax Seal Stamp */}
              <div className="mt-2 relative flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#630018] via-[#850021] to-[#3D000F] shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] border-2 border-[#D4A76A]/90 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full border border-[#D4A76A]/50 flex items-center justify-center">
                    <span 
                      className="text-[9px] text-[#F6E27A] font-bold tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      A & A
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // 2. IMPERIAL EMERALD & GOLD HERITAGE WEDDING
      case "wedding-palace-emerald":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#03231A] via-[#05382A] to-[#01140E] text-[#E8F3EE] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.16),transparent_70%)] pointer-events-none" />
            
            {/* Heritage Temple Arch Border */}
            <div className="absolute inset-2.5 rounded-t-[100px] rounded-b-2xl border-2 border-[#E5C158]/70 pointer-events-none flex items-center justify-center">
              <div className="absolute inset-1 rounded-t-[94px] rounded-b-xl border border-[#E5C158]/30" />
            </div>

            <div className="relative z-10 pt-3">
              <div className="text-xl text-[#F6E27A] font-serif leading-none">
                ✦
              </div>
              <p className="text-[7px] uppercase tracking-[0.22em] text-[#D8EADB] font-semibold mt-1">
                HERITAGE WEDDING
              </p>
              <p className="text-[6px] uppercase tracking-[0.16em] text-[#A6CDB0] mt-0.5">
                IN THE GRACE OF THE ALMIGHTY
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <span className="block text-[6.5px] uppercase tracking-[0.2em] text-[#E5C158] mb-0.5">
                SOLICIT YOUR BLESSINGS FOR
              </span>
              <h4 
                className="text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF9D2] via-[#E5C158] to-[#CAA135] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-normal leading-tight"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Kavya & Siddharth
              </h4>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#E5C158] to-transparent mx-auto my-1" />
              <p className="text-[6.5px] uppercase tracking-[0.18em] text-[#E8F3EE] font-medium">
                14 FEBRUARY 2027 • 9:15 AM
              </p>
              <p className="text-[6px] tracking-wider text-[#E5C158]/90">
                SACRED MUHURTHAM
              </p>
            </div>

            <div className="relative z-10 pb-2 flex flex-col items-center">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#D8EADB]">
                HERITAGE AUDITORIUM • CHENNAI
              </p>
              <div className="mt-2 w-9 h-9 rounded-full bg-gradient-to-tr from-[#05382A] via-[#084D3A] to-[#021F16] shadow-[0_4px_10px_rgba(0,0,0,0.6)] border-2 border-[#E5C158] flex items-center justify-center">
                <span className="text-[9px] text-[#F6E27A] font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                  K & S
                </span>
              </div>
            </div>
          </div>
        );

      // 3. IVORY SILK & ROSE GOLD ROYALE WEDDING
      case "wedding-palace-rosegold":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#FDFBF9] via-[#FAF3EC] to-[#F3E6D8] text-[#3D2C2E] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(197,131,123,0.12),transparent_70%)] pointer-events-none" />
            
            {/* Rose Gold Double Arch Frame */}
            <div className="absolute inset-2.5 rounded-t-[100px] rounded-b-2xl border-2 border-[#C5837B]/60 pointer-events-none">
              <div className="absolute inset-1 rounded-t-[94px] rounded-b-xl border border-[#C5837B]/25" />
            </div>

            <div className="relative z-10 pt-3">
              <div className="text-xl text-[#B96A62] font-serif leading-none">
                ❦
              </div>
              <p className="text-[7px] uppercase tracking-[0.22em] text-[#7A5055] font-semibold mt-1">
                ROYALE CELEBRATION
              </p>
              <p className="text-[6px] uppercase tracking-[0.16em] text-[#9E7378] mt-0.5">
                TOGETHER WITH THEIR FAMILIES
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <span className="block text-[6.5px] uppercase tracking-[0.2em] text-[#B96A62] mb-0.5">
                INVITE YOU TO SHARE THEIR JOY
              </span>
              <h4 
                className="text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#8E444E] via-[#B96A62] to-[#6E2E38] font-normal leading-tight drop-shadow-sm"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Meera & Rohan
              </h4>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C5837B] to-transparent mx-auto my-1" />
              <p className="text-[6.5px] uppercase tracking-[0.18em] text-[#4A3236] font-medium">
                22 NOVEMBER 2026 • 5:00 PM
              </p>
              <p className="text-[6px] tracking-wider text-[#8E444E]/90">
                SUNSET VOWS & RECEPTION
              </p>
            </div>

            <div className="relative z-10 pb-2 flex flex-col items-center">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#7A5055]">
                THE ROSEWOOD RESORT • UDAIPUR
              </p>
              <div className="mt-2 w-9 h-9 rounded-full bg-gradient-to-tr from-[#B96A62] via-[#D8938C] to-[#8E444E] shadow-[0_4px_10px_rgba(185,106,98,0.4)] border-2 border-white flex items-center justify-center">
                <span className="text-[9px] text-white font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                  M & R
                </span>
              </div>
            </div>
          </div>
        );

      // 4. MIDNIGHT SAPPHIRE & CELESTIAL GOLD PALACE WEDDING
      case "wedding-palace-sapphire":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#051326] via-[#091D3A] to-[#020A16] text-[#E0EBF7] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.18),transparent_70%)] pointer-events-none" />
            
            {/* Celestial Gold Arch */}
            <div className="absolute inset-2.5 rounded-t-[100px] rounded-b-2xl border-2 border-[#D4AF37]/70 pointer-events-none">
              <div className="absolute inset-1 rounded-t-[94px] rounded-b-xl border border-[#D4AF37]/30" />
            </div>

            <div className="relative z-10 pt-3">
              <div className="text-xl text-[#F6E27A] font-serif leading-none">
                ✨
              </div>
              <p className="text-[7px] uppercase tracking-[0.22em] text-[#CADDF2] font-semibold mt-1">
                UNDER A CANOPY OF STARS
              </p>
              <p className="text-[6px] uppercase tracking-[0.16em] text-[#8CA9CE] mt-0.5">
                WE INVITE YOU TO CELEBRATE
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <span className="block text-[6.5px] uppercase tracking-[0.2em] text-[#D4AF37] mb-0.5">
                THE WEDDING OF
              </span>
              <h4 
                className="text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CE] via-[#F6E27A] to-[#D4AF37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-normal leading-tight"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Tara & Dev
              </h4>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-1" />
              <p className="text-[6.5px] uppercase tracking-[0.18em] text-[#E0EBF7] font-medium">
                31 DECEMBER 2026 • 7:00 PM
              </p>
              <p className="text-[6px] tracking-wider text-[#D4AF37]">
                NEW YEAR&apos;S EVE GALA
              </p>
            </div>

            <div className="relative z-10 pb-2 flex flex-col items-center">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#CADDF2]">
                CELESTIAL PALACE • JAIPUR
              </p>
              <div className="mt-2 w-9 h-9 rounded-full bg-gradient-to-tr from-[#091D3A] via-[#12315E] to-[#051326] shadow-[0_4px_10px_rgba(0,0,0,0.6)] border-2 border-[#D4AF37] flex items-center justify-center">
                <span className="text-[9px] text-[#F6E27A] font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                  T & D
                </span>
              </div>
            </div>
          </div>
        );

      // 5. ROYAL GOLD & IVORY REGAL WEDDING
      case "wedding-001":
        return (
          <div className="relative w-full h-full bg-[#FAF7F2] text-[#2C241D] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            {/* Gold Filigree Double Border */}
            <div className="absolute inset-3 border-2 border-[#C5A059] rounded-xl pointer-events-none">
              <div className="absolute inset-1 border border-[#C5A059]/40" />
              {/* Corner Accents */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#A27B32]" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#A27B32]" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#A27B32]" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#A27B32]" />
            </div>

            <div className="relative z-10 pt-4">
              <div className="text-base text-[#C5A059] font-serif">♔</div>
              <p className="text-[6.5px] uppercase tracking-[0.25em] text-[#8C6D38] font-bold mt-1">
                ROYAL WEDDING INVITATION
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#7A6958] mb-1">
                THE HONOR OF YOUR PRESENCE IS REQUESTED
              </p>
              <h4 
                className="text-xl sm:text-2xl text-[#2C241D] font-bold tracking-tight uppercase"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Aditi & Vikram
              </h4>
              <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-1.5" />
              <p className="text-[7px] uppercase tracking-[0.2em] text-[#8C6D38] font-semibold">
                SATURDAY, 18 OCTOBER 2026
              </p>
              <p className="text-[6px] tracking-wider text-[#6B5A49] mt-0.5">
                CEREMONY AT 4:00 PM
              </p>
            </div>

            <div className="relative z-10 pb-3">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#544332] font-semibold">
                THE LEELA PALACE • BENGALURU
              </p>
              <p className="text-[5.5px] uppercase tracking-[0.15em] text-[#8C6D38] mt-0.5">
                DINNER & DANCING TO FOLLOW
              </p>
            </div>
          </div>
        );

      // 6. BLUSH ROSE GARDEN WEDDING (Replaces the brown tote bag!)
      case "wedding-002":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#FFF5F6] via-[#FDF0F2] to-[#FAE4E7] text-[#4A2D33] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            {/* Delicate Botanical Ring Background */}
            <div className="absolute inset-3 border border-[#D99B9B]/60 rounded-2xl pointer-events-none">
              <div className="absolute inset-1 border border-[#D99B9B]/20 rounded-xl" />
            </div>

            <div className="relative z-10 pt-4">
              <div className="text-xl text-[#C9727B] font-serif leading-none">
                🌸
              </div>
              <p className="text-[7px] uppercase tracking-[0.24em] text-[#A65B65] font-semibold mt-1">
                GARDEN WEDDING
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <span className="block text-[6.5px] uppercase tracking-[0.2em] text-[#8F4853] mb-0.5">
                TOGETHER WITH THEIR FAMILIES
              </span>
              <h4 
                className="text-2xl sm:text-3xl text-[#9E3D4B] font-normal leading-tight drop-shadow-sm"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Priya & Aditya
              </h4>
              <div className="w-14 h-[1px] bg-[#D99B9B] mx-auto my-1.5" />
              <p className="text-[6.5px] uppercase tracking-[0.18em] text-[#4A2D33] font-medium">
                JANUARY 15, 2027 • 4:30 PM
              </p>
              <p className="text-[6px] tracking-wider text-[#A65B65]">
                RECEPTION UNDER THE WILLOWS
              </p>
            </div>

            <div className="relative z-10 pb-3">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#733E46] font-semibold">
                THE BOTANICAL GARDENS • OOTY
              </p>
            </div>
          </div>
        );

      // 7. MODERN MONOGRAM MINIMALIST
      case "wedding-003":
        return (
          <div className="relative w-full h-full bg-[#FAF9F7] text-[#1A1A1A] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            <div className="absolute inset-3 border border-[#E5E0D8] pointer-events-none" />

            <div className="relative z-10 pt-4">
              <div 
                className="text-3xl font-light tracking-widest text-stone-800"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                S & K
              </div>
            </div>

            <div className="relative z-10 my-auto py-1">
              <p className="text-[6px] uppercase tracking-[0.3em] text-stone-400 mb-1">
                PLEASE JOIN US FOR THE WEDDING OF
              </p>
              <h4 
                className="text-lg sm:text-xl text-stone-900 font-medium tracking-[0.2em] uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Sneha & Karan
              </h4>
              <div className="w-8 h-[1px] bg-stone-300 mx-auto my-2" />
              <p className="text-[6.5px] uppercase tracking-[0.2em] text-stone-700">
                12 SEPTEMBER 2026
              </p>
            </div>

            <div className="relative z-10 pb-3">
              <p className="text-[6px] uppercase tracking-[0.25em] text-stone-500">
                ALILA DIWA • GOA
              </p>
            </div>
          </div>
        );

      // 8. TERRACOTTA & PAMPAS SUNSET
      case "wedding-004":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#FBF5F0] to-[#F4E3D7] text-[#4A2E20] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            <div className="absolute inset-3 rounded-t-[80px] rounded-b-lg border-2 border-[#C0704E]/50 pointer-events-none" />
            
            <div className="relative z-10 pt-4">
              <div className="text-xl text-[#C0704E] font-serif">☀️</div>
              <p className="text-[6.5px] uppercase tracking-[0.22em] text-[#9E5233] font-semibold mt-1">
                BOHEMIAN SUNSET WEDDING
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#7A503C] mb-0.5">
                JOIN US UNDER THE SUNSET
              </p>
              <h4 
                className="text-2xl text-[#A84F2B] font-normal leading-tight"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Maya & Neil
              </h4>
              <div className="w-12 h-[1px] bg-[#C0704E] mx-auto my-1.5" />
              <p className="text-[6.5px] uppercase tracking-[0.18em] text-[#4A2E20] font-medium">
                NOVEMBER 08, 2026
              </p>
            </div>

            <div className="relative z-10 pb-3">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#9E5233]">
                SAMODE PALACE • JAIPUR
              </p>
            </div>
          </div>
        );

      // 9. MAHARAJA SILK CRIMSON & GOLD
      case "wedding-005":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#5C0615] via-[#7A0B1E] to-[#3B020B] text-[#FBEED7] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            <div className="absolute inset-2.5 border-2 border-[#D4AF37]/80 rounded-lg pointer-events-none">
              <div className="absolute inset-1 border border-[#D4AF37]/40" />
            </div>

            <div className="relative z-10 pt-3">
              <div className="text-xl text-[#F6E27A] font-serif">॥ श्री गणेशाय नमः ॥</div>
              <p className="text-[6.5px] uppercase tracking-[0.2em] text-[#E0C070] mt-1 font-semibold">
                ROYAL MAHA VIVAH
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <h4 
                className="text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CE] via-[#F6E27A] to-[#D4AF37]"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Pooja & Rajesh
              </h4>
              <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto my-1.5" />
              <p className="text-[6.5px] uppercase tracking-[0.2em] text-[#FBEED7]">
                05 DECEMBER 2026 • 11:15 AM
              </p>
            </div>

            <div className="relative z-10 pb-3">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#E0C070]">
                CITY PALACE • UDAIPUR
              </p>
            </div>
          </div>
        );

      // 10. ENGAGEMENT - CELESTIAL STARRY NIGHT RING
      case "engagement-001":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#0B1528] via-[#102445] to-[#060D1A] text-[#E3EEFC] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            <div className="absolute inset-3 rounded-2xl border border-[#94B8E8]/50 pointer-events-none" />

            <div className="relative z-10 pt-4">
              <div className="text-xl text-[#E8C15A]">💍</div>
              <p className="text-[7px] uppercase tracking-[0.25em] text-[#94B8E8] font-bold mt-1">
                SHE SAID YES!
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#B0CCF0] mb-0.5">
                CELEBRATE THE ENGAGEMENT OF
              </p>
              <h4 
                className="text-2xl text-[#F6E27A]"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Sameer & Riya
              </h4>
              <div className="w-12 h-[1px] bg-[#E8C15A] mx-auto my-1.5" />
              <p className="text-[6.5px] uppercase tracking-[0.18em] text-[#E3EEFC]">
                SATURDAY, OCTOBER 24, 2026
              </p>
            </div>

            <div className="relative z-10 pb-3">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#94B8E8]">
                ROOFTOP LOUNGE • MUMBAI
              </p>
            </div>
          </div>
        );

      // 11. BIRTHDAY - 1ST BIRTHDAY PASTEL
      case "birthday-001":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#FFF9F2] via-[#FFF2E6] to-[#FFE8E8] text-[#523B33] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-[#F3B89B] pointer-events-none" />

            <div className="relative z-10 pt-4">
              <div className="text-2xl">🎈</div>
              <p className="text-[7px] uppercase tracking-[0.2em] text-[#D8765A] font-extrabold mt-1">
                OUR LITTLE STAR IS TURNING
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <div 
                className="text-4xl text-[#E06D53] font-bold leading-none drop-shadow-sm"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                ONE!
              </div>
              <h4 
                className="text-2xl text-[#8E4B3E] mt-1"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Aarav&apos;s 1st Birthday
              </h4>
              <p className="text-[6.5px] uppercase tracking-[0.15em] text-[#523B33] font-semibold mt-1">
                SUNDAY, 15 NOVEMBER • 4:00 PM
              </p>
            </div>

            <div className="relative z-10 pb-3">
              <p className="text-[6px] uppercase tracking-[0.18em] text-[#D8765A] font-bold">
                SUNSHINE CLUBHOUSE • BENGALURU
              </p>
            </div>
          </div>
        );

      // 12. HOUSEWARMING - WARM HEARTH & NEW BEGINNINGS
      case "housewarming-001":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#FAF7F2] to-[#F1E8DC] text-[#3A2E24] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            <div className="absolute inset-3 rounded-xl border-2 border-[#B89762]/60 pointer-events-none">
              <div className="absolute inset-1 border border-[#B89762]/20" />
            </div>

            <div className="relative z-10 pt-4">
              <div className="text-2xl text-[#B89762]">🏡</div>
              <p className="text-[7px] uppercase tracking-[0.24em] text-[#8C6D38] font-bold mt-1">
                GRIHA PRAVESH & POOJA
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#695544] mb-0.5">
                PLEASE BLESS OUR NEW HOME
              </p>
              <h4 
                className="text-xl sm:text-2xl text-[#3A2E24] font-bold uppercase"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Sharma Family
              </h4>
              <div className="w-12 h-[1px] bg-[#B89762] mx-auto my-1.5" />
              <p className="text-[6.5px] uppercase tracking-[0.18em] text-[#8C6D38] font-semibold">
                SUNDAY, 10 JANUARY 2027
              </p>
              <p className="text-[6px] tracking-wider text-[#574436]">
                POOJA: 9:00 AM • LUNCH TO FOLLOW
              </p>
            </div>

            <div className="relative z-10 pb-3">
              <p className="text-[6px] uppercase tracking-[0.18em] text-[#695544]">
                VILLA 42, PALM MEADOWS • KOCHI
              </p>
            </div>
          </div>
        );

      // 13. BABY SHOWER
      case "baby-shower-001":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#F4F9F4] via-[#EBF3EB] to-[#DEECE0] text-[#2D3E30] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            <div className="absolute inset-3 rounded-2xl border border-[#7FA384]/70 pointer-events-none" />

            <div className="relative z-10 pt-4">
              <div className="text-xl text-[#587D5D]">🌿 🍼</div>
              <p className="text-[7px] uppercase tracking-[0.22em] text-[#4F7354] font-bold mt-1">
                A SWEET BABY IS ON THE WAY
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <h4 
                className="text-2xl text-[#2F5234]"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Baby Shower
              </h4>
              <p className="text-[6.5px] uppercase tracking-[0.2em] text-[#587D5D] mt-0.5">
                IN HONOR OF RADHIKA
              </p>
              <div className="w-10 h-[1px] bg-[#7FA384] mx-auto my-1.5" />
              <p className="text-[6.5px] uppercase tracking-[0.18em] text-[#2D3E30] font-semibold">
                OCTOBER 12, 2026 • 3:30 PM
              </p>
            </div>

            <div className="relative z-10 pb-3">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#4F7354]">
                THE GREENHOUSE CAFÉ • HYDERABAD
              </p>
            </div>
          </div>
        );

      // 14. 50TH ANNIVERSARY
      case "anniversary-001":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-[#1C1711] via-[#2A2218] to-[#120E0A] text-[#F7EBD2] p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none">
            <div className="absolute inset-3 border-2 border-[#E5C158]/80 rounded-xl pointer-events-none" />

            <div className="relative z-10 pt-4">
              <div className="text-xl text-[#F6E27A]">50</div>
              <p className="text-[7px] uppercase tracking-[0.24em] text-[#E5C158] font-bold mt-0.5">
                GOLDEN ANNIVERSARY
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <h4 
                className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CE] via-[#F6E27A] to-[#E5C158]"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Ramesh & Sunita
              </h4>
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#D8C7A5] mt-0.5">
                CELEBRATING 50 YEARS OF LOVE
              </p>
              <div className="w-14 h-[1px] bg-[#E5C158] mx-auto my-1.5" />
              <p className="text-[6.5px] uppercase tracking-[0.18em] text-[#F7EBD2]">
                DECEMBER 20, 2026 • 7:00 PM
              </p>
            </div>

            <div className="relative z-10 pb-3">
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#E5C158]">
                TAJ WEST END • BENGALURU
              </p>
            </div>
          </div>
        );

      // DEFAULT DYNAMIC INVITATION CARD (For any other template or admin created custom designs)
      default: {
        const bg = template.background?.value || template.themeColors?.background || "#FAF7F2";
        const isDark = bg.startsWith("#0") || bg.startsWith("#1") || bg.startsWith("#2") || bg.startsWith("#3") || bg.startsWith("#4") || bg.startsWith("#5");
        const textColor = isDark ? "#FFFFFF" : "#1A1A1A";
        const accent = template.themeColors?.accent || "#D4AF37";

        return (
          <div 
            className="relative w-full h-full p-4 flex flex-col justify-between items-center text-center overflow-hidden select-none"
            style={{ backgroundColor: bg, color: textColor }}
          >
            {/* Elegant Inner Frame */}
            <div 
              className="absolute inset-3 rounded-xl pointer-events-none" 
              style={{ border: `1.5px solid ${accent}60` }}
            />

            <div className="relative z-10 pt-4">
              <div className="text-lg leading-none" style={{ color: accent }}>
                {template.category === "wedding" ? "💍" : template.category === "birthday" ? "🎂" : template.category === "housewarming" ? "🏡" : "✨"}
              </div>
              <p className="text-[7px] uppercase tracking-[0.24em] font-bold mt-1" style={{ color: accent }}>
                {template.category.replace("_", " ")} INVITATION
              </p>
            </div>

            <div className="relative z-10 my-auto py-1">
              <p className="text-[6px] uppercase tracking-[0.2em] opacity-75 mb-0.5">
                CORDIALLY INVITED TO CELEBRATE
              </p>
              <h4 
                className="text-xl sm:text-2xl font-bold leading-tight"
                style={{ 
                  fontFamily: template.fontSettings?.heading ? `'${template.fontSettings.heading}', serif` : "'Playfair Display', serif",
                  color: textColor
                }}
              >
                {template.name.replace(/Wedding|Birthday|Anniversary|Baby Shower|Housewarming/gi, "").trim() || "Celebration"}
              </h4>
              <div className="w-12 h-[1px] mx-auto my-1.5" style={{ backgroundColor: accent }} />
              <p className="text-[6.5px] uppercase tracking-[0.18em] opacity-90 font-medium">
                SAVE THE DATE • 2026
              </p>
            </div>

            <div className="relative z-10 pb-3">
              <p className="text-[6px] uppercase tracking-[0.2em] font-semibold" style={{ color: accent }}>
                DIGITAL EVENT INVITATION
              </p>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {renderCardContent()}

      {/* Realistic Paper Stationery Surface Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />

      {/* Digital Invitation Card Preview Watermark / Tag */}
      {showBadge && (
        <div className="absolute bottom-2 right-2 z-20 pointer-events-none">
          <span className="rounded-md bg-stone-950/60 backdrop-blur-md px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-amber-200/90 border border-amber-400/20">
            Card Preview
          </span>
        </div>
      )}
    </div>
  );
}
