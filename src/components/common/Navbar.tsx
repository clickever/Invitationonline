"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Menu, 
  X, 
  PlusCircle, 
  LayoutDashboard, 
  LogOut, 
  User, 
  Layers,
  ChevronDown 
} from "lucide-react";
import { getCurrentUser, setCurrentUser } from "@/lib/supabase/storage";
import { UserProfile } from "@/lib/types";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleSignOut = () => {
    setCurrentUser(null);
    setUser(null);
    setUserDropdownOpen(false);
    window.location.href = "/";
  };

  // Hide full marketing navbar inside the visual editor to maximize canvas viewport
  const isEditorPage = pathname?.startsWith("/editor");
  const isPublicInvitePage = pathname?.startsWith("/i/");

  if (isEditorPage || isPublicInvitePage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-900/10 bg-[#FCFAF8]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-18">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 text-stone-900 shadow-gold group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
              Invite<span className="text-amber-700">Studio</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              SaaS
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/templates"
            className={`text-sm font-medium transition-colors hover:text-amber-700 ${
              pathname?.startsWith("/templates") ? "text-amber-700 font-semibold" : "text-stone-600"
            }`}
          >
            Templates
          </Link>
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors py-2">
              <span>Categories</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="absolute left-0 top-full hidden w-56 rounded-2xl bg-white p-2 shadow-xl border border-stone-100 group-hover:block transition-all">
              <Link
                href="/templates?category=wedding"
                className="flex items-center px-3 py-2 text-xs font-medium text-stone-700 rounded-xl hover:bg-amber-50 hover:text-amber-800"
              >
                💍 Weddings (5)
              </Link>
              <Link
                href="/templates?category=engagement"
                className="flex items-center px-3 py-2 text-xs font-medium text-stone-700 rounded-xl hover:bg-amber-50 hover:text-amber-800"
              >
                💎 Engagements (3)
              </Link>
              <Link
                href="/templates?category=birthday"
                className="flex items-center px-3 py-2 text-xs font-medium text-stone-700 rounded-xl hover:bg-amber-50 hover:text-amber-800"
              >
                🎂 Birthdays (4)
              </Link>
              <Link
                href="/templates?category=anniversary"
                className="flex items-center px-3 py-2 text-xs font-medium text-stone-700 rounded-xl hover:bg-amber-50 hover:text-amber-800"
              >
                ✨ Anniversaries (1)
              </Link>
              <Link
                href="/templates?category=baby_shower"
                className="flex items-center px-3 py-2 text-xs font-medium text-stone-700 rounded-xl hover:bg-amber-50 hover:text-amber-800"
              >
                🍼 Baby Showers (1)
              </Link>
              <Link
                href="/templates?category=housewarming"
                className="flex items-center px-3 py-2 text-xs font-medium text-stone-700 rounded-xl hover:bg-amber-50 hover:text-amber-800"
              >
                🏡 Housewarmings (1)
              </Link>
            </div>
          </div>
          <Link
            href="/pricing"
            className={`text-sm font-medium transition-colors hover:text-amber-700 ${
              pathname === "/pricing" ? "text-amber-700 font-semibold" : "text-stone-600"
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-amber-700 ${
              pathname?.startsWith("/dashboard") ? "text-amber-700 font-semibold" : "text-stone-600"
            }`}
          >
            Dashboard
          </Link>
        </nav>

        {/* Action CTAs & Profile */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-amber-50 shadow hover:bg-stone-800 transition-all active:scale-95"
          >
            <PlusCircle className="h-4 w-4 text-amber-400" />
            <span>Create Invitation</span>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-amber-200 bg-white p-1 pr-3 hover:border-amber-400 transition"
              >
                <img
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"}
                  alt={user.fullName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-stone-800 max-w-[100px] truncate">
                  {user.fullName.split(" ")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white p-2 shadow-2xl border border-stone-100 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-900 truncate">{user.fullName}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 rounded-xl hover:bg-stone-50"
                  >
                    <LayoutDashboard className="h-4 w-4 text-amber-600" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/invitations"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 rounded-xl hover:bg-stone-50"
                  >
                    <Layers className="h-4 w-4 text-amber-600" />
                    <span>My Invitations</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 rounded-xl hover:bg-stone-50"
                  >
                    <User className="h-4 w-4 text-amber-600" />
                    <span>Profile & Plan</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 rounded-xl hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-sm font-semibold text-stone-700 hover:text-stone-900 hover:bg-amber-50 transition"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/templates"
            className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-amber-50"
          >
            Create
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-amber-700 rounded-lg hover:bg-amber-50"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-amber-900/10 bg-[#FCFAF8] px-4 py-6 space-y-4">
          <div className="space-y-1">
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-stone-800 rounded-lg hover:bg-amber-50"
            >
              Browse All Templates
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-stone-800 rounded-lg hover:bg-amber-50"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-stone-800 rounded-lg hover:bg-amber-50"
            >
              My Dashboard
            </Link>
          </div>

          <div className="pt-4 border-t border-stone-200">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={user.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"}
                    alt={user.fullName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-stone-900">{user.fullName}</div>
                    <div className="text-xs text-stone-500">{user.email}</div>
                  </div>
                </div>
                <Link
                  href="/dashboard/invitations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-stone-700 rounded-lg hover:bg-amber-50"
                >
                  My Invitations
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center rounded-xl border border-stone-200 bg-white py-2.5 text-sm font-semibold text-stone-700"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center rounded-xl bg-amber-600 py-2.5 text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
