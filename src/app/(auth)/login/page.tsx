"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { loginUser } from "@/lib/supabase/storage";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/dashboard";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured() && supabase && identifier.includes("@")) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
      }

      // Local persistent authentication
      const result = loginUser(identifier, password);
      if (!result.success) {
        setErrorMsg(result.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push(redirect);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stone-200/80 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 text-stone-900 shadow">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
              Invite<span className="text-amber-700">Studio</span>
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-stone-900 pt-1">Welcome Back</h2>
          <p className="text-xs text-stone-500">Sign in with your email or mobile number to access your invitations.</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address or Mobile Number *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                required
                placeholder="name@example.com or 9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-stone-900 py-3 text-xs font-bold text-white shadow-gold hover:bg-stone-800 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Signing in..." : "Sign In to Studio"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500">
          Don&apos;t have an account yet?{" "}
          <Link href={`/register${redirect !== "/dashboard" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="font-bold text-amber-700 hover:text-amber-900">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-xs text-stone-500">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
