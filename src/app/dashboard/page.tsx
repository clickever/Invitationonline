"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Layers, 
  Send, 
  FileEdit, 
  Heart, 
  PlusCircle, 
  ArrowRight, 
  Eye, 
  Share2, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Users, 
  Sparkles 
} from "lucide-react";
import { 
  getAllUserInvitations, 
  getDashboardStats, 
  deleteInvitation, 
  getCurrentUser 
} from "@/lib/supabase/storage";
import { Invitation } from "@/lib/types";
import ShareModal from "@/components/invitation/ShareModal";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalInvitations: 0,
    draftInvitations: 0,
    publishedInvitations: 0,
    totalRsvps: 0,
    totalGuestsAttending: 0,
  });
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeShareInvite, setActiveShareInvite] = useState<Invitation | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        router.push("/login?redirect=/dashboard");
        return;
      }
      const [s, list] = await Promise.all([
        getDashboardStats(user.id),
        getAllUserInvitations(user.id),
      ]);
      setStats(s);
      setInvitations(list);
    } catch (err) {
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteInvitation(id);
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
            <Sparkles className="h-3 w-3" />
            <span>Celebration Command Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Welcome to Your Studio
          </h1>
          <p className="text-xs text-stone-500 max-w-lg">
            Monitor real-time guest attendance, manage draft stationery, and publish digital invitations.
          </p>
        </div>

        <Link
          href="/templates"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-xs font-bold text-white shadow-gold hover:bg-amber-700 transition active:scale-95 shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Invitation</span>
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            label: "Total Invitations",
            value: stats.totalInvitations,
            icon: Layers,
            desc: "All creations",
            color: "text-amber-700",
            bg: "bg-amber-50",
          },
          {
            label: "Published",
            value: stats.publishedInvitations,
            icon: Send,
            desc: "Live & shareable",
            color: "text-emerald-700",
            bg: "bg-emerald-50",
          },
          {
            label: "Drafts",
            value: stats.draftInvitations,
            icon: FileEdit,
            desc: "In progress",
            color: "text-stone-700",
            bg: "bg-stone-100",
          },
          {
            label: "RSVP Responses",
            value: stats.totalRsvps,
            icon: Heart,
            desc: `${stats.totalGuestsAttending} guests attending`,
            color: "text-rose-700",
            bg: "bg-rose-50",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-3xl bg-white p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                  {loading ? "..." : item.value}
                </span>
                <p className="text-[11px] text-stone-400 mt-1">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invitations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">Your Invitations</h2>
            <p className="text-xs text-stone-500">Edit designs, preview, share, and track guest lists.</p>
          </div>
          <Link
            href="/dashboard/invitations"
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-12 text-center text-xs text-stone-400">
            Loading invitations...
          </div>
        ) : invitations.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-stone-200/80 max-w-md mx-auto">
            <Layers className="h-10 w-10 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-800">No invitations created yet</h3>
            <p className="text-xs text-stone-500 mt-1 mb-6 leading-relaxed">
              Select one of our luxury templates to start designing your first invitation.
            </p>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-xs font-bold text-white shadow hover:bg-amber-700 transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Browse 15+ Templates</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((invite) => (
              <div
                key={invite.id}
                className="rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-amber-400 transition"
              >
                {/* Visual Preview Header */}
                <div
                  className="relative h-44 p-4 flex flex-col justify-between border-b border-stone-100"
                  style={{
                    backgroundColor: invite.background?.value || "#FAF7F2",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        invite.isPublished
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-stone-200/80 text-stone-700"
                      }`}
                    >
                      {invite.isPublished ? "Published" : "Draft"}
                    </span>

                    {invite.isPremium && (
                      <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase text-stone-900 shadow">
                        Premium
                      </span>
                    )}
                  </div>

                  <div className="text-center my-auto px-4">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-amber-800/80">
                      {invite.eventType}
                    </p>
                    <h3 className="font-serif text-lg font-bold text-stone-900 truncate mt-1">
                      {invite.title}
                    </h3>
                  </div>

                  <div className="text-[10px] text-stone-500 flex items-center justify-between">
                    <span>{invite.venueName || "Venue not set"}</span>
                    <span>{invite.viewsCount || 0} views</span>
                  </div>
                </div>

                {/* Card Body & Actions */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>Template: <strong className="text-stone-700">{invite.templateId || "Custom"}</strong></span>
                  </div>

                  {/* Buttons Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                    <Link
                      href={`/editor/${invite.id}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-900 py-2 text-xs font-bold text-white hover:bg-stone-800 transition"
                    >
                      <FileEdit className="h-3.5 w-3.5 text-amber-400" />
                      <span>Edit</span>
                    </Link>

                    <Link
                      href={`/i/${invite.slug}`}
                      target="_blank"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setActiveShareInvite(invite)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share & QR</span>
                    </button>

                    <button
                      onClick={() => handleDelete(invite.id, invite.title)}
                      className="p-1.5 text-stone-400 hover:text-red-600 transition"
                      title="Delete Invitation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {activeShareInvite && (
        <ShareModal
          isOpen={Boolean(activeShareInvite)}
          onClose={() => setActiveShareInvite(null)}
          title={activeShareInvite.title}
          shareUrl={
            typeof window !== "undefined"
              ? `${window.location.origin}/i/${activeShareInvite.slug}`
              : `/i/${activeShareInvite.slug}`
          }
          themeColor={activeShareInvite.settings?.themeColor}
        />
      )}
    </div>
  );
}
