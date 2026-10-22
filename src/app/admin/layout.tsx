"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Palette, 
  PlusCircle, 
  Settings, 
  LayoutDashboard, 
  ArrowLeft,
  Lock,
  LogOut,
  Sparkles
} from "lucide-react";
import { getAdminSettings } from "@/lib/supabase/storage";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("invitestudio_admin_authenticated");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = getAdminSettings();
    const targetPin = settings.adminPin || "admin123";

    if (pinInput.trim() === targetPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem("invitestudio_admin_authenticated", "true");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("invitestudio_admin_authenticated");
    setPinInput("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-white">
        Loading admin console...
      </div>
    );
  }

  // Admin PIN Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mx-auto mb-4 border border-amber-500/20">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">Admin Portal Access</h2>
          <p className="text-xs text-stone-400 mt-2 mb-6">
            Enter your admin PIN to manage registered users, UPI payment records, and template pricing.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Admin PIN (Default: admin123)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full rounded-2xl bg-stone-950 border border-stone-800 px-4 py-3 text-center text-sm font-mono text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2">
                  Incorrect PIN. Please try again or check your admin configuration.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-amber-600 py-3 text-xs font-bold text-white shadow-gold hover:bg-amber-500 transition active:scale-95"
            >
              Unlock Admin Console
            </button>

            <div className="pt-4 border-t border-stone-800">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Main Website</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Users & Accounts", icon: Users },
    { href: "/admin/payments", label: "UPI Payments", icon: CreditCard },
    { href: "/admin/templates", label: "Design Pricing", icon: Palette },
    { href: "/admin/templates/new", label: "Add Custom Design", icon: PlusCircle },
    { href: "/admin/settings", label: "UPI & Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 border-r border-stone-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-800">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-stone-950 font-bold shadow">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-serif text-base font-bold text-white block leading-tight">
                  Invite<span className="text-amber-500">Studio</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact
                ? pathname === link.href
                : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-amber-600 text-white shadow-md"
                      : "text-stone-400 hover:bg-stone-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer CTAs */}
        <div className="pt-6 border-t border-stone-800 space-y-2 mt-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Public Site</span>
          </Link>

          <button
            onClick={handleLogoutAdmin}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 rounded-xl transition text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Lock Admin Console</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
