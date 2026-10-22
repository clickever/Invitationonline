"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { getAdminSettings } from "@/lib/supabase/storage";

function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const settings = getAdminSettings();
    const correctPassword = settings.adminPin || "Nithin@fxodigital";

    if (password.trim() === correctPassword) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("invitestudio_admin_authenticated", "true");
      }
      router.push("/admin");
    } else {
      setErrorMsg("Incorrect admin password. Access denied.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Brand & Badge */}
        <div className="text-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mx-auto border border-amber-500/20 shadow-inner">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              Invite<span className="text-amber-500">Studio</span> Admin
            </h1>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
              Restricted Portal
            </span>
          </div>
          <p className="text-xs text-stone-400">
            Sign in with your master administrator credentials to access payments, users, and pricing.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="rounded-xl bg-red-950/60 border border-red-800 p-3 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Admin Master Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-stone-500" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full rounded-2xl bg-stone-950 border border-stone-800 py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-amber-600 py-3 text-xs font-bold text-white shadow-gold hover:bg-amber-500 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Admin Console"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-stone-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-950 flex items-center justify-center text-xs text-stone-500">Loading admin login...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
