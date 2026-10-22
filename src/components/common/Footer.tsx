"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer inside editor and public invitation page
  if (pathname?.startsWith("/editor") || pathname?.startsWith("/i/")) {
    return null;
  }

  return (
    <footer className="border-t border-amber-900/10 bg-[#FAF7F2] text-stone-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-stone-900 shadow">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                Invite<span className="text-amber-700">Studio</span>
              </span>
            </Link>
            <p className="text-sm text-stone-600 max-w-sm leading-relaxed">
              The premier digital invitation creation and hosting platform. Crafted with modern elegance, responsive interactivity, real-time RSVPs, and mobile-first design.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
              <span>for unforgettable celebrations worldwide</span>
            </div>
          </div>

          {/* Event Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900/80 mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/templates?category=wedding" className="hover:text-amber-700 transition">
                  Wedding Invitations
                </Link>
              </li>
              <li>
                <Link href="/templates?category=engagement" className="hover:text-amber-700 transition">
                  Engagement & Ring Soirées
                </Link>
              </li>
              <li>
                <Link href="/templates?category=birthday" className="hover:text-amber-700 transition">
                  Birthdays & Milestones
                </Link>
              </li>
              <li>
                <Link href="/templates?category=anniversary" className="hover:text-amber-700 transition">
                  Anniversaries & Jubilees
                </Link>
              </li>
              <li>
                <Link href="/templates?category=baby_shower" className="hover:text-amber-700 transition">
                  Baby Showers
                </Link>
              </li>
              <li>
                <Link href="/templates?category=housewarming" className="hover:text-amber-700 transition">
                  Housewarmings
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900/80 mb-4">
              Product & Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/templates" className="hover:text-amber-700 transition">
                  Template Gallery
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-amber-700 transition">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-700 transition">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/invitations" className="hover:text-amber-700 transition">
                  RSVP Manager
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Tech */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900/80 mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm mb-4">
              <li>
                <Link href="/admin" className="text-amber-800 font-medium hover:text-amber-900 transition flex items-center gap-1.5">
                  <span>🔐 Admin Backend</span>
                </Link>
              </li>
            </ul>
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-950">
              ✨ <strong>Instant UPI Checkout:</strong> Seamless payment via Google Pay, PhonePe, Paytm & dynamic QR code per invitation.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-amber-900/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} InviteStudio SaaS Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
