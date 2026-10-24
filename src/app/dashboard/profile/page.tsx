"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Sparkles, CheckCircle2, Shield } from "lucide-react";
import { getCurrentUser, setCurrentUser } from "@/lib/supabase/storage";
import { UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (u) {
      setUser(u);
      setFullName(u.fullName);
      setEmail(u.email);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      fullName,
      email,
    };
    setCurrentUser(updated);
    setUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Profile & Preferences</h1>
        <p className="text-xs text-stone-500">Manage your creator profile and account details.</p>
      </div>

      {saved && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      {/* Account Info Form */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || "User")}`}
            alt="Avatar"
            className="h-16 w-16 rounded-full object-cover shadow-sm border border-stone-200"
          />
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">{fullName || "Host Name"}</h3>
            <p className="text-xs text-stone-500">{email}</p>
            <span className="inline-block mt-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-800">
              Creator Account
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-stone-800 transition"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Security Info */}
      <div className="rounded-3xl bg-white p-6 border border-stone-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">Database & Security</h4>
            <p className="text-[11px] text-stone-500">
              Secured with Supabase Row Level Security (RLS) and encrypted data stores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
