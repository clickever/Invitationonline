"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { Invitation } from "@/lib/types";
import { getInvitationBySlug } from "@/lib/supabase/storage";
import PublicInvitationRenderer from "@/components/invitation/PublicInvitationRenderer";

export default function PublicInvitationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchInvite = async () => {
      setLoading(true);
      try {
        const item = await getInvitationBySlug(slug);
        setInvitation(item);
      } catch (err) {
        console.error("Error fetching invitation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 text-amber-500 animate-spin mb-4" />
        <p className="text-sm font-semibold text-stone-300">Loading celebration...</p>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-xl border border-stone-200/70">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900 mb-2">
            Invitation Not Found
          </h1>
          <p className="text-sm text-stone-600 mb-6 leading-relaxed">
            The celebration invitation you are looking for may have expired, changed its link, or is currently unpublished.
          </p>
          <div className="space-y-2">
            <Link
              href="/templates"
              className="w-full inline-flex items-center justify-center rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow hover:bg-amber-700 transition"
            >
              Explore Digital Templates
            </Link>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center rounded-xl border border-stone-200 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <PublicInvitationRenderer invitation={invitation} />;
}
