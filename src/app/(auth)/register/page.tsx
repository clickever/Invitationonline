"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { registerUser } from "@/lib/supabase/storage";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/dashboard/invitations";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (mobileNumber.trim().length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone: mobileNumber },
          },
        });
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
      }

      // Local persistent registration
      const result = registerUser(fullName, email, password, mobileNumber);
      if (!result.success) {
        setErrorMsg(result.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push(redirect);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stone-200/80 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 text-stone-900 shadow">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
              Invite<span className="text-amber-700">Studio</span>
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-stone-900 pt-1">Create Account</h2>
          <p className="text-xs text-stone-500">Sign up with your email to start creating beautiful digital invitations.</p>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number (10 digits) *</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password (min 6 characters) *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="password"
                required
                minLength={6}
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
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500">
          Already have an account?{" "}
          <Link href={`/login${redirect !== "/dashboard/invitations" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="font-bold text-amber-700 hover:text-amber-900">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-xs text-stone-500">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
