"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Calendar, 
  MapPin, 
  Share2, 
  Smartphone, 
  CheckCircle2, 
  Music, 
  Layers, 
  QrCode, 
  Users, 
  Eye, 
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { getAllTemplates, CATEGORIES } from "@/lib/templates";
import { Template } from "@/lib/types";

export default function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const templates = getAllTemplates();
  const filteredTemplates = selectedCategory === "all"
    ? templates.slice(0, 6)
    : templates.filter((t) => t.category === selectedCategory).slice(0, 6);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "How do guests receive and open their invitation?",
      a: "Each invitation generates a unique, mobile-optimized public web link (e.g., invitestudio.app/i/ananya-arjun-wedding). You can send this link via WhatsApp, SMS, or email, or download your custom QR code to print on welcome cards.",
    },
    {
      q: "Can I track RSVPs and guest counts in real-time?",
      a: "Yes! Every guest response is immediately recorded in your personal Creator Dashboard. You can see who accepted, tentative guests, total headcount, dietary notes, and export the entire list to Excel/CSV with one click.",
    },
    {
      q: "Does the invitation play background music and show venue maps?",
      a: "Yes! You can enable ambient celebration music, integrate a live countdown timer, and include a 1-tap Google Maps button for effortless guest navigation.",
    },
    {
      q: "What is the difference between Free and Premium invitations?",
      a: "Free invitations allow you to design, publish, and collect up to 50 RSVPs with a discreet 'Made with InviteStudio' watermark. Premium invitations remove watermarks, unlock custom URL slugs, photo galleries, background music, and unlimited RSVPs.",
    },
    {
      q: "Can I customize the fonts, colors, and layout?",
      a: "Absolutely. Our mobile-first visual studio gives you full control over typography (royal serif, elegant calligraphy, modern sans), colors, decorative flourishes, borders, and interactive components.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-stone-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-amber-900/10">
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-60">
          <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-yellow-100/60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/80 px-3.5 py-1 text-xs font-semibold text-amber-900 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Modern Digital Invitation Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.12]">
                Create Digital Invitations that{" "}
                <span className="italic font-normal text-amber-700">Mesmerize</span> Your Guests.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Choose from hand-crafted wedding, engagement, and celebration templates. Customize in our visual studio, track live RSVPs, and share effortlessly via WhatsApp or QR code.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/templates"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-7 py-3.5 text-sm font-bold text-white shadow-gold hover:bg-amber-700 transition active:scale-95"
                >
                  <span>Browse 15+ Templates</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/i/ananya-and-arjun-wedding"
                  target="_blank"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white/80 backdrop-blur-sm px-6 py-3.5 text-sm font-bold text-stone-800 hover:bg-stone-50 transition"
                >
                  <Eye className="h-4 w-4 text-amber-700" />
                  <span>View Live Sample Invite</span>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500">
                <div className="flex -space-x-2">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="User"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="User"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="User"
                  />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-900 ring-2 ring-white">
                    +12k
                  </div>
                </div>
                <div>
                  <span className="font-bold text-stone-800">4.9/5 Rating</span> from over 12,000 celebration hosts
                </div>
              </div>
            </div>

            {/* Right Interactive Mobile Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Phone Bezel */}
                <div className="relative rounded-[40px] border-8 border-stone-900 bg-stone-900 p-2 shadow-2xl overflow-hidden ring-1 ring-amber-500/20">
                  {/* Speaker Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 h-4 w-28 rounded-full bg-stone-800 z-30" />

                  {/* Invitation Screen Inside */}
                  <div className="relative rounded-[32px] overflow-hidden bg-[#FDFBF7] p-6 text-center shadow-inner min-h-[580px] flex flex-col justify-between border border-amber-900/10">
                    <div className="mt-4">
                      <span className="font-serif text-amber-700 tracking-widest text-xs uppercase font-bold">
                        Together With Their Families
                      </span>
                      <h3 className="font-serif text-3xl font-bold text-stone-900 mt-3">
                        Ananya & Arjun
                      </h3>
                      <p className="text-xs text-stone-500 italic mt-1 font-serif">
                        request the honor of your presence
                      </p>
                    </div>

                    {/* Middle Badge */}
                    <div className="my-auto py-3 space-y-3">
                      <div className="inline-block rounded-2xl bg-amber-100/80 px-4 py-2 text-xs font-bold text-amber-900 border border-amber-200">
                        SATURDAY • 24 OCTOBER 2026
                      </div>
                      <p className="text-xs font-semibold text-stone-800">The Grand Oberoi Palace</p>
                      <p className="text-[10px] text-stone-500">Lake Palace Road, Udaipur</p>

                      {/* Mock Countdown */}
                      <div className="grid grid-cols-4 gap-1.5 max-w-[220px] mx-auto pt-2">
                        {["34d", "12h", "45m", "10s"].map((t) => (
                          <div key={t} className="rounded-lg bg-white p-1 text-[11px] font-mono font-bold text-amber-700 shadow-sm border border-stone-200">
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mock Action */}
                    <div className="space-y-2">
                      <div className="w-full rounded-full bg-amber-600 py-3 text-xs font-bold text-white shadow">
                        RSVP NOW
                      </div>
                      <div className="text-[10px] text-stone-400">Tap to confirm attendance</div>
                    </div>
                  </div>
                </div>

                {/* Floating Interactive Badges */}
                <div className="absolute -bottom-4 -left-6 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-stone-200 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">84 Guests Confirmed</p>
                    <p className="text-[10px] text-stone-500">Real-time RSVP Tracker</p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-6 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-stone-200 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Scan & Open</p>
                    <p className="text-[10px] text-stone-500">Instant QR Code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EVENT CATEGORIES EXPLORATION */}
      <section className="py-16 bg-[#F5EFE6]/50 border-b border-amber-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Celebrations for Every Cherished Moment
            </h2>
            <p className="text-sm text-stone-600">
              Explore bespoke designs crafted specifically for Indian & international traditions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { id: "wedding", label: "Weddings", count: "5 Designs", icon: "💍", href: "/templates?category=wedding" },
              { id: "engagement", label: "Engagements", count: "3 Designs", icon: "💎", href: "/templates?category=engagement" },
              { id: "birthday", label: "Birthdays", count: "4 Designs", icon: "🎂", href: "/templates?category=birthday" },
              { id: "anniversary", label: "Anniversaries", count: "1 Design", icon: "✨", href: "/templates?category=anniversary" },
              { id: "baby_shower", label: "Baby Showers", count: "1 Design", icon: "🍼", href: "/templates?category=baby_shower" },
              { id: "housewarming", label: "Housewarmings", count: "1 Design", icon: "🏡", href: "/templates?category=housewarming" },
            ].map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center shadow-sm border border-stone-200/80 hover:border-amber-400 hover:shadow-gold transition"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-xs font-bold text-stone-900 group-hover:text-amber-800 transition">
                  {cat.label}
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED TEMPLATES SHOWCASE */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Curated Collection</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Handcrafted Template Showcase
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              {["all", "wedding", "engagement", "birthday", "anniversary"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template: Template) => (
              <div
                key={template.id}
                className="group relative rounded-3xl bg-white overflow-hidden shadow-card border border-stone-200/80 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image / Thumbnail Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="rounded-full bg-stone-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {template.category.replace("_", " ")}
                    </span>
                    {template.isPremium && (
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-900 shadow">
                        Premium
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/editor/${template.id}`}
                        className="flex-1 rounded-xl bg-amber-500 py-3 text-center text-xs font-bold text-stone-950 shadow-lg hover:bg-amber-400 transition"
                      >
                        Customize This
                      </Link>
                      <Link
                        href={`/i/ananya-and-arjun-wedding`}
                        target="_blank"
                        className="rounded-xl bg-white/20 backdrop-blur-md p-3 text-white hover:bg-white/40 transition"
                        title="Live Sample"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-stone-900 truncate">
                    {template.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                      {template.elements?.length || 10}+ Editable Elements
                    </span>
                    <Link
                      href={`/editor/${template.id}`}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                    >
                      <span>Edit Design</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-8 py-3.5 text-xs font-bold text-stone-800 shadow-sm hover:bg-stone-50 transition"
            >
              <span>View All 15 Templates</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Streamlined Flow</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">How InviteStudio Works</h2>
            <p className="text-sm text-stone-400">From concept to guest RSVPs in under 3 minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose a Template",
                desc: "Select from our curated designer templates for weddings, birthdays, anniversaries, and parties.",
                icon: Layers,
              },
              {
                step: "02",
                title: "Customize Visually",
                desc: "Use our mobile-first visual studio to edit text, change fonts, tweak colors, and configure special countdown & map widgets.",
                icon: Sparkles,
              },
              {
                step: "03",
                title: "Publish & Track RSVPs",
                desc: "Get an instant shareable link and QR code. Watch real-time guest responses tally directly in your dashboard.",
                icon: Share2,
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative rounded-3xl bg-stone-800/80 p-8 border border-stone-700/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-3xl font-bold text-amber-400">{s.step}</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-700 text-amber-400">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-xs text-stone-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Clear Pricing</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Simple, Transparent Plans
            </h2>
            <p className="text-sm text-stone-600">Start free. Upgrade whenever you need premium exclusivity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 items-stretch">
            {/* Free Tier */}
            <div className="rounded-3xl bg-white p-8 border border-stone-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase text-stone-700">
                  Starter Free
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-serif text-stone-900">$0</span>
                  <span className="text-xs text-stone-500">/ forever</span>
                </div>
                <p className="text-xs text-stone-500 mt-2">Perfect for casual get-togethers and trying the studio.</p>

                <ul className="mt-6 space-y-3 text-xs text-stone-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Access to core template gallery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Visual invitation editor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Public shareable URL</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Up to 50 RSVP responses</span>
                  </li>
                  <li className="flex items-center gap-2 text-stone-400">
                    <span className="h-4 w-4 rounded-full border border-stone-300 flex items-center justify-center text-[10px]">✕</span>
                    <span>Includes InviteStudio watermark</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/templates"
                className="mt-8 block w-full rounded-2xl border border-stone-300 py-3 text-center text-xs font-bold text-stone-800 hover:bg-stone-50 transition"
              >
                Get Started Free
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 p-8 text-white border border-amber-500/40 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow">
                Most Popular
              </div>

              <div>
                <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 text-[10px] font-bold uppercase">
                  Premium Invitation
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-serif text-white">$12</span>
                  <span className="text-xs text-stone-400">/ per celebration (₹999)</span>
                </div>
                <p className="text-xs text-stone-400 mt-2">For weddings, engagements, and unforgettable milestones.</p>

                <ul className="mt-6 space-y-3 text-xs text-stone-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    <span className="font-semibold text-white">Zero Watermark / 100% White Label</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    <span>All 15+ Luxury & Regal Templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    <span>Unlimited Guest RSVPs & Excel Export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    <span>Photo Memories Gallery Lightbox</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    <span>Ambient Background Celebration Music</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    <span>Custom URL Slug & High-Res QR Code</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/templates"
                className="mt-8 block w-full rounded-2xl bg-amber-500 py-3.5 text-center text-xs font-bold text-stone-950 shadow-gold hover:bg-amber-400 transition"
              >
                Create Premium Invitation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-20 bg-[#F5EFE6]/60 border-t border-b border-amber-900/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Got Questions?</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-stone-200/80 overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-stone-900 hover:text-amber-800 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-stone-400 transition-transform ${
                      openFaq === idx ? "rotate-180 text-amber-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HIGH-CONVERTING CTA BANNER */}
      <section className="py-20 bg-[#FCFAF8] text-center">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 p-10 sm:p-16 text-white shadow-2xl">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Ready to Craft Your Celebration?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-amber-100 max-w-xl mx-auto leading-relaxed">
              Join thousands of happy couples and event planners creating bespoke digital experiences today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/templates"
                className="rounded-2xl bg-stone-950 px-8 py-4 text-sm font-bold text-amber-400 shadow-xl hover:bg-stone-900 transition active:scale-95"
              >
                Start Designing Now — It&apos;s Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
