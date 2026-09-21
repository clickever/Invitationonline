"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreditCard, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/storage";
import { MockPaymentProvider } from "@/lib/payments/mock";

export default function BillingPage() {
  const user = getCurrentUser();
  const [upgraded, setUpgraded] = useState(false);

  const handleMockUpgrade = async () => {
    const provider = new MockPaymentProvider();
    const order = await provider.createOrder({
      planId: "pro_pass",
      amount: 49,
      currency: "USD",
      userEmail: user?.email || "demo@invitestudio.app",
      userName: user?.fullName || "Sarah Jenkins",
    });
    const verified = await provider.verifyPayment({
      orderId: order.orderId,
      paymentId: `pay_${Date.now()}`,
    });
    if (verified.success) {
      setUpgraded(true);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Billing & Subscriptions</h1>
        <p className="text-xs text-stone-500">Manage your subscription, invoices, and invitation upgrades.</p>
      </div>

      {/* Current Plan Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase text-stone-700">
            Current Tier
          </span>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            {upgraded ? "Annual Event Planner Pro" : `${user?.plan || "Free"} Starter`}
          </h3>
          <p className="text-xs text-stone-500 max-w-md leading-relaxed">
            {upgraded
              ? "All premium templates unlocked. Watermarks removed. Unlimited guest RSVPs."
              : "Basic access to templates. Public invitation links with standard branding."}
          </p>
        </div>

        {!upgraded && (
          <button
            onClick={handleMockUpgrade}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-xs font-bold text-white shadow-gold hover:bg-amber-700 transition shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>Upgrade to Pro ($49/yr)</span>
          </button>
        )}
      </div>

      {/* Payment History / Invoices */}
      <div className="rounded-3xl bg-white p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-serif text-base font-bold text-stone-900">Payment Transactions</h3>
          <span className="text-[10px] uppercase font-bold text-stone-400">Razorpay / Mock Architecture</span>
        </div>

        <div className="divide-y divide-stone-100">
          <div className="py-3 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-stone-900">InviteStudio Starter Activation</p>
              <p className="text-[10px] text-stone-400">Sep 20, 2026</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-stone-900">$0.00</span>
              <span className="block text-[10px] text-emerald-600 font-semibold">Active</span>
            </div>
          </div>
          {upgraded && (
            <div className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-stone-900">Pro Event Planner Annual Pass</p>
                <p className="text-[10px] text-stone-400">Just now</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-stone-900">$49.00</span>
                <span className="block text-[10px] text-emerald-600 font-semibold">Completed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
