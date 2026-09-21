"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, HelpCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { MockPaymentProvider } from "@/lib/payments/mock";

export default function PricingPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("INR");
  const [upgrading, setUpgrading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpgradeMock = async (plan: string, amount: number) => {
    setUpgrading(true);
    try {
      const provider = new MockPaymentProvider();
      const order = await provider.createOrder({
        planId: "single_invite",
        amount,
        currency,
        userEmail: "demo@invitestudio.app",
        userName: "Celebration Host",
      });

      const verified = await provider.verifyPayment({
        orderId: order.orderId,
        paymentId: `pay_${Date.now()}`,
      });

      if (verified.success) {
        setSuccessMessage(`🎉 Success! Upgraded to ${plan}. All premium features are unlocked.`);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3.5 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>Investment in Memories</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
            Transparent, Simple Pricing
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Create free invitations or upgrade to a watermark-free luxury experience with music, galleries, and custom URLs.
          </p>

          {/* Currency Toggle */}
          <div className="inline-flex items-center rounded-2xl bg-white p-1 border border-stone-200 shadow-sm mt-4">
            <button
              onClick={() => setCurrency("INR")}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                currency === "INR" ? "bg-stone-900 text-white shadow" : "text-stone-600"
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                currency === "USD" ? "bg-stone-900 text-white shadow" : "text-stone-600"
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="max-w-xl mx-auto mb-8 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center text-xs font-semibold text-emerald-900 animate-in fade-in">
            {successMessage}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {/* Free Tier */}
          <div className="rounded-3xl bg-white p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase text-stone-600">
                Free Tier
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-serif text-stone-900">
                  {currency === "INR" ? "₹0" : "$0"}
                </span>
                <span className="text-xs text-stone-500">/ forever</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Ideal for trying out the visual editor and small parties.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>5 Free Templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Visual Invitation Editor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Public Mobile Web Page</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Up to 50 RSVPs</span>
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
              Start Free
            </Link>
          </div>

          {/* Single Premium Invitation */}
          <div className="rounded-3xl bg-stone-900 text-white p-8 border-2 border-amber-500 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow">
              Most Popular
            </div>

            <div>
              <span className="rounded-full bg-amber-500/20 text-amber-400 px-3 py-1 text-[10px] font-bold uppercase border border-amber-500/30">
                Single Event Pass
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-serif text-white">
                  {currency === "INR" ? "₹999" : "$12"}
                </span>
                <span className="text-xs text-stone-400">/ per event</span>
              </div>
              <p className="text-xs text-stone-400 mt-2">
                White-label luxury digital invitation for your wedding or special day.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-stone-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-white">No Watermark (100% White Label)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>All 15+ Premium Templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Unlimited Guest RSVPs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Background Music & Photo Gallery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Custom URL & QR Code</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgradeMock("Single Premium Invitation", currency === "INR" ? 999 : 12)}
              disabled={upgrading}
              className="mt-8 block w-full rounded-2xl bg-amber-500 py-3.5 text-center text-xs font-bold text-stone-950 shadow-gold hover:bg-amber-400 transition"
            >
              {upgrading ? "Processing..." : "Unlock Premium Invitation"}
            </button>
          </div>

          {/* Annual Pro Host */}
          <div className="rounded-3xl bg-white p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase text-stone-600">
                Event Planner Pass
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-serif text-stone-900">
                  {currency === "INR" ? "₹3,999" : "$49"}
                </span>
                <span className="text-xs text-stone-500">/ year</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                For wedding planners, photographers, and frequent party hosts.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Premium Invitations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Zero Watermarks on all invites</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Unlimited RSVPs with CSV Exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Custom Domain Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Priority Concierge Support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgradeMock("Annual Pro Host Pass", currency === "INR" ? 3999 : 49)}
              disabled={upgrading}
              className="mt-8 block w-full rounded-2xl border border-stone-300 py-3 text-center text-xs font-bold text-stone-800 hover:bg-stone-50 transition"
            >
              {upgrading ? "Processing..." : "Get Annual Pro"}
            </button>
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
