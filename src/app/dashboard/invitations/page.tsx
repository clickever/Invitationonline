"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileEdit, 
  Eye, 
  Share2, 
  Trash2, 
  PlusCircle, 
  Users, 
  Search, 
  Download, 
  X, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Utensils
} from "lucide-react";
import { 
  getAllUserInvitations, 
  deleteInvitation, 
  getRsvpsForInvitation, 
  getCurrentUser,
  deleteRsvp 
} from "@/lib/supabase/storage";
import { Invitation, RsvpSubmission } from "@/lib/types";
import ShareModal from "@/components/invitation/ShareModal";

export default function MyInvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeShareInvite, setActiveShareInvite] = useState<Invitation | null>(null);

  // RSVP Management Modal State
  const [activeRsvpInvite, setActiveRsvpInvite] = useState<Invitation | null>(null);
  const [rsvpList, setRsvpList] = useState<RsvpSubmission[]>([]);
  const [loadingRsvps, setLoadingRsvps] = useState(false);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      const list = await getAllUserInvitations(user?.id);
      setInvitations(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteInvitation(id);
      loadInvitations();
    }
  };

  const handleOpenRsvps = async (invite: Invitation) => {
    setActiveRsvpInvite(invite);
    setLoadingRsvps(true);
    try {
      const rsvps = await getRsvpsForInvitation(invite.id);
      setRsvpList(rsvps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRsvps(false);
    }
  };

  const handleDeleteRsvp = async (rsvpId: string) => {
    if (confirm("Delete this RSVP entry?")) {
      await deleteRsvp(rsvpId);
      if (activeRsvpInvite) {
        const updated = await getRsvpsForInvitation(activeRsvpInvite.id);
        setRsvpList(updated);
      }
    }
  };

  const handleExportCsv = () => {
    if (!activeRsvpInvite || rsvpList.length === 0) return;

    const headers = ["Guest Name", "Status", "Guest Count", "Email", "Phone", "Dietary", "Message", "Submitted At"];
    const rows = rsvpList.map((r) => [
      `"${r.guestName.replace(/"/g, '""')}"`,
      r.attendanceStatus,
      r.guestsCount || 1,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `"${(r.phone || "").replace(/"/g, '""')}"`,
      `"${(r.dietaryRequirements || "").replace(/"/g, '""')}"`,
      `"${(r.message || "").replace(/"/g, '""')}"`,
      r.createdAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeRsvpInvite.slug}-rsvps.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = invitations.filter((i) => {
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "published" && i.isPublished) ||
      (filterStatus === "draft" && !i.isPublished);

    const matchesSearch =
      !searchQuery.trim() ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.eventType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">My Invitations</h1>
          <p className="text-xs text-stone-500">Manage all your drafts, published links, and guest lists.</p>
        </div>
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-xs font-bold text-white shadow-gold hover:bg-amber-700 transition"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Invitation</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search your invitations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-200 py-2 pl-9 pr-3 text-xs focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold w-full sm:w-auto">
          {[
            { id: "all", label: "All" },
            { id: "published", label: "Published" },
            { id: "draft", label: "Drafts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition ${
                filterStatus === tab.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invitations Grid */}
      {loading ? (
        <div className="rounded-3xl bg-white p-12 text-center text-xs text-stone-400">
          Loading invitations...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-stone-200/80 max-w-md mx-auto">
          <h3 className="font-serif text-lg font-bold text-stone-800">No invitations found</h3>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            Try adjusting your search criteria or create a new invitation design.
          </p>
          <Link
            href="/templates"
            className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow"
          >
            Create from Template
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((invite) => (
            <div
              key={invite.id}
              className="rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-amber-400 transition"
            >
              {/* Card Header Preview */}
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

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Template: <strong className="text-stone-700">{invite.templateId || "Custom"}</strong></span>
                  <button
                    onClick={() => handleOpenRsvps(invite)}
                    className="flex items-center gap-1 font-bold text-rose-600 hover:text-rose-800"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>View RSVPs</span>
                  </button>
                </div>

                {/* Buttons Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                  <Link
                    href={`/editor/${invite.id}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-900 py-2 text-xs font-bold text-white hover:bg-stone-800 transition"
                  >
                    <FileEdit className="h-3.5 w-3.5 text-amber-400" />
                    <span>Edit Studio</span>
                  </Link>

                  <Link
                    href={`/i/${invite.slug}`}
                    target="_blank"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Live Page</span>
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

      {/* RSVP Management Modal */}
      {activeRsvpInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-stone-100 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50 px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Guest Responses
                </p>
                <h3 className="font-serif text-xl font-bold text-stone-900 truncate">
                  {activeRsvpInvite.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {rsvpList.length > 0 && (
                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-800 hover:bg-stone-50"
                  >
                    <Download className="h-3.5 w-3.5 text-stone-500" />
                    <span>Export CSV</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveRsvpInvite(null)}
                  className="rounded-full p-1.5 text-stone-400 hover:bg-stone-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {loadingRsvps ? (
                <div className="text-center py-10 text-xs text-stone-400">Loading guest list...</div>
              ) : rsvpList.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <Users className="h-10 w-10 mx-auto mb-2 text-stone-300" />
                  <p className="font-serif text-base font-bold text-stone-700">No RSVPs recorded yet</p>
                  <p className="text-xs text-stone-500 mt-1">
                    Share your invitation link with guests to start collecting confirmations!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                    <span>
                      Total Confirmed Guests:{" "}
                      <strong className="text-stone-900">
                        {rsvpList
                          .filter((r) => r.attendanceStatus === "attending")
                          .reduce((sum, r) => sum + (r.guestsCount || 1), 0)}
                      </strong>
                    </span>
                    <span>{rsvpList.length} total responses</span>
                  </div>

                  {rsvpList.map((rsvp) => (
                    <div
                      key={rsvp.id}
                      className="rounded-2xl border border-stone-200 p-4 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{rsvp.guestName}</h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                              rsvp.attendanceStatus === "attending"
                                ? "bg-emerald-100 text-emerald-800"
                                : rsvp.attendanceStatus === "maybe"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-stone-200 text-stone-700"
                            }`}
                          >
                            {rsvp.attendanceStatus}
                          </span>
                          {rsvp.attendanceStatus === "attending" && (
                            <span className="text-xs font-semibold text-stone-600">
                              ({rsvp.guestsCount || 1} guest{rsvp.guestsCount > 1 ? "s" : ""})
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                          {rsvp.email && <span>Email: {rsvp.email}</span>}
                          {rsvp.phone && <span>Phone: {rsvp.phone}</span>}
                          {rsvp.dietaryRequirements && (
                            <span className="flex items-center gap-1 text-amber-800">
                              <Utensils className="h-3 w-3" />
                              {rsvp.dietaryRequirements}
                            </span>
                          )}
                        </div>

                        {rsvp.message && (
                          <p className="text-xs italic text-stone-600 pt-1">
                            &ldquo;{rsvp.message}&rdquo;
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteRsvp(rsvp.id)}
                        className="p-1 text-stone-400 hover:text-red-600 self-end sm:self-center"
                        title="Delete RSVP"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
