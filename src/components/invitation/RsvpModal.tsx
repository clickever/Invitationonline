"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { X, CheckCircle2, Heart, Users, Utensils, MessageSquare, Mail, Phone, User } from "lucide-react";
import { submitRsvp } from "@/lib/supabase/storage";

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitationId: string;
  eventTitle: string;
  themeColor?: string;
  onRsvpSuccess?: () => void;
}

export default function RsvpModal({
  isOpen,
  onClose,
  invitationId,
  eventTitle,
  themeColor = "#D4AF37",
  onRsvpSuccess,
}: RsvpModalProps) {
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<"attending" | "not_attending" | "maybe">("attending");
  const [guestsCount, setGuestsCount] = useState(1);
  const [dietaryRequirements, setDietaryRequirements] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);
    try {
      await submitRsvp({
        invitationId,
        guestName: guestName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        attendanceStatus,
        guestsCount,
        dietaryRequirements: dietaryRequirements.trim() || undefined,
        message: message.trim() || undefined,
      });

      if (attendanceStatus === "attending") {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#E6C687", "#2D261E", "#FFB6C1"],
        });
      }

      setSubmitted(true);
      if (onRsvpSuccess) onRsvpSuccess();
    } catch (err) {
      console.error("RSVP submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setGuestName("");
    setEmail("");
    setPhone("");
    setAttendanceStatus("attending");
    setGuestsCount(1);
    setDietaryRequirements("");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-stone-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="relative border-b border-stone-100 bg-stone-50/70 px-6 py-5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">RSVP Response</p>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5 truncate">{eventTitle}</h2>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                style={{ color: themeColor }}
              >
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                {attendanceStatus === "attending" ? "We Can't Wait to See You!" : "Thank You for Responding"}
              </h3>
              <p className="text-sm text-stone-600 max-w-xs mx-auto leading-relaxed">
                {attendanceStatus === "attending"
                  ? `Your confirmation for ${guestsCount} guest${guestsCount > 1 ? "s" : ""} has been registered with the host.`
                  : "Your response has been saved. We'll miss your presence!"}
              </p>
              <button
                onClick={handleReset}
                className="mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow"
                style={{ backgroundColor: themeColor }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Attendance Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Will You Attend?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "attending", label: "Joyfully Accept", icon: "✨" },
                    { id: "maybe", label: "Tentative", icon: "⏳" },
                    { id: "not_attending", label: "Regretfully Decline", icon: "💌" },
                  ].map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => setAttendanceStatus(option.id as any)}
                      className={`flex flex-col items-center justify-center rounded-2xl p-3 border text-center transition-all ${
                        attendanceStatus === option.id
                          ? "border-amber-500 bg-amber-50/60 font-semibold text-amber-900 shadow-sm"
                          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-xs mt-1 leading-tight">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ananya Patel"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Count */}
              {attendanceStatus === "attending" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Number of Guests Attending
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setGuestsCount(num)}
                        className={`flex-1 rounded-xl py-2 text-sm font-semibold border transition ${
                          guestsCount === num
                            ? "border-amber-500 bg-amber-500 text-white"
                            : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary Requirements */}
              {attendanceStatus === "attending" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dietary Requirements (Optional)
                  </label>
                  <div className="relative">
                    <Utensils className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="e.g., Vegetarian, Vegan, Gluten-free, Nut allergy"
                      value={dietaryRequirements}
                      onChange={(e) => setDietaryRequirements(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Message to Host */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Wishes or Note to the Host
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <textarea
                    rows={2}
                    placeholder="Share your heartfelt wishes or a note..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 py-2 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !guestName.trim()}
                className="w-full rounded-2xl py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-98 disabled:opacity-50 mt-2"
                style={{ backgroundColor: themeColor }}
              >
                {isSubmitting ? "Submitting..." : "Send RSVP Confirmation"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
