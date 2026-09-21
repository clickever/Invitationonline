"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { DEFAULT_DEMO_USER, setCurrentUser } from "@/lib/supabase/storage";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
        if (data.user) {
          setCurrentUser({
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split("@")[0],
            plan: "free",
            createdAt: data.user.created_at,
          });
        }
      } else {
        // Local Demo fallback
        setCurrentUser({
          id: "usr_custom_1",
          email: email || "user@example.com",
          fullName: email ? email.split("@")[0] : "Creator Host",
          plan: "free",
          createdAt: new Date().toISOString(),
        });
      }

      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setCurrentUser(DEFAULT_DEMO_USER);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-stone-200/80 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-stone-900 shadow">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
              Invite<span className="text-amber-700">Studio</span>
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Welcome Back</h2>
          <p className="text-xs text-stone-500">Sign in to manage your invitations and guest RSVPs.</p>
        </div>

        {/* Quick Demo Access Button */}
        <div className="rounded-2xl bg-amber-50/70 p-3.5 border border-amber-200/80 text-center">
          <p className="text-[11px] font-semibold text-amber-900 mb-2">
            💡 Quick Demo Mode (No signup required)
          </p>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-700 transition"
          >
            Sign in as Demo Host (Instant Access)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-stone-200" />
          <span className="text-[10px] uppercase font-bold text-stone-400">Or email</span>
          <div className="h-[1px] flex-1 bg-stone-200" />
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
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-stone-900 py-3 text-xs font-bold text-white shadow hover:bg-stone-800 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In to Studio"}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-amber-700 hover:text-amber-900">
            Sign up free
          </Link>
        </div>
      </div>
    </div>
  );
}
