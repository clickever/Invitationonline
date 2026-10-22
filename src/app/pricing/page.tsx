"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, HelpCircle, ShieldCheck, ArrowRight } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3.5 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>Simple Pay-As-You-Publish Pricing</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
            No Subscriptions. Pay Once Per Invitation.
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Create free invitations or publish premium designs for a flat <strong>₹1,100</strong> per invitation page. Instant 1-tap activation via UPI QR, Google Pay, PhonePe, or Paytm.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto mb-16">
          {/* Free Starter */}
          <div className="rounded-3xl bg-white p-8 border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase text-stone-600">
                  Starter / Free
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  3 Free Designs
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-serif text-stone-900">
                  ₹0
                </span>
                <span className="text-xs text-stone-500">/ forever</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Ideal for trying out the visual editor and publishing with our 3 flagship free designs.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>3 Flagship Free Templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Full Visual Canvas Editor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Interactive RSVP & Guest Attendance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Live Mobile Web Page</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Countdown & Google Maps Integration</span>
                </li>
              </ul>
            </div>

            <Link
              href="/templates?tier=free"
              className="mt-8 block w-full rounded-2xl border border-stone-300 py-3.5 text-center text-xs font-bold text-stone-800 hover:bg-stone-50 transition"
            >
              Browse Free Templates
            </Link>
          </div>

          {/* Single Publication Pass */}
          <div className="rounded-3xl bg-stone-900 text-white p-8 border-2 border-amber-500 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow">
              Pay Per Publication
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 text-amber-400 px-3 py-1 text-[10px] font-bold uppercase border border-amber-500/30">
                  Single Event Pass
                </span>
                <span className="text-[11px] text-amber-300 font-medium">No Subscription</span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-serif text-white">
                  ₹1,100
                </span>
                <span className="text-xs text-stone-400">/ published invitation</span>
              </div>
              <p className="text-xs text-stone-300 mt-2">
                Single upfront payment per published page. Keep your custom celebration page live forever.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-stone-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-white">All Luxury & Custom Templates Unlocked</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Event Timeline Schedule & Our Story Section</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Direct WhatsApp Host Inquiry Button</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Custom URL Slug & Dynamic UPI Payment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Unlimited Guest RSVPs with Instant Export</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Dynamic QR Code for Physical Print & Digital Share</span>
                </li>
              </ul>
            </div>

            <Link
              href="/templates"
              className="mt-8 block w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 py-3.5 text-center text-xs font-bold text-stone-950 shadow-gold hover:from-amber-400 hover:to-yellow-300 transition active:scale-95"
            >
              Choose Template & Publish (₹1,100)
            </Link>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="rounded-3xl bg-white p-8 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-stone-900">
                100% Satisfaction Guarantee
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Full refund within 7 days if you or your guests aren&apos;t delighted with your invitation.
              </p>
            </div>
          </div>
          <Link
            href="/templates"
            className="rounded-2xl bg-stone-900 px-6 py-3 text-xs font-bold text-white shrink-0 hover:bg-stone-800"
          >
            Explore Templates First
          </Link>
        </div>
      </div>
    </div>
  );
}
