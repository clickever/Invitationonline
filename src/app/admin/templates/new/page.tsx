"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  PlusCircle, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Palette 
} from "lucide-react";
import { saveCustomTemplate } from "@/lib/supabase/storage";
import { EventCategory, Template } from "@/lib/types";

export default function NewCustomTemplatePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<EventCategory>("wedding");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80");
  const [bgColor, setBgColor] = useState("#FDFBF7");
  const [primaryColor, setPrimaryColor] = useState("#D4AF37");
  const [price, setPrice] = useState<number>(1100);
  const [tags, setTags] = useState("luxury, custom, elegant");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const presetThumbnails = [
    { label: "Regal Wedding", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" },
    { label: "Rose Garden", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" },
    { label: "Starry Night", url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80" },
    { label: "Emerald Gala", url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80" },
    { label: "Art Deco 50th", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80" },
    { label: "Neon Cyber", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" },
    { label: "Sweet Baby", url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80" },
    { label: "Warm Home", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const templateId = `custom-${category}-${Date.now()}`;

    const newTemplate: Template = {
      id: templateId,
      category,
      name: name.trim(),
      description: description.trim() || `Exclusive custom ${category} invitation design.`,
      isPremium: price > 0,
      price: price,
      thumbnailUrl,
      canvas: { width: 1080, height: 1920 },
      background: { type: "color", value: bgColor },
      themeColors: {
        primary: primaryColor,
        secondary: "#6B7280",
        accent: "#F3F4F6",
        background: bgColor,
        text: bgColor === "#0B132B" || bgColor === "#0A051B" || bgColor === "#121316" || bgColor === "#580A18" ? "#FFFFFF" : "#1F2937",
      },
      fontSettings: {
        heading: "Playfair Display",
        body: "Inter",
      },
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      elements: [
        {
          id: "border_frame",
          type: "shape",
          shapeType: "rectangle",
          x: 54,
          y: 54,
          width: 972,
          height: 1812,
          strokeColor: primaryColor,
          strokeWidth: 2,
          fillColor: "transparent",
          zIndex: 1,
        },
        {
          id: "title",
          type: "text",
          text: name.toUpperCase(),
          fontSize: 26,
          fontFamily: "Inter",
          fontWeight: "600",
          letterSpacing: 4,
          color: primaryColor,
          textAlign: "center",
          x: 140,
          y: 280,
          width: 800,
          height: 40,
          editable: true,
          zIndex: 2,
        },
        {
          id: "celebration_names",
          type: "text",
          text: "Honored Host & Guest of Honor",
          fontSize: 70,
          fontFamily: "Playfair Display",
          fontWeight: "700",
          color: primaryColor,
          textAlign: "center",
          x: 90,
          y: 380,
          width: 900,
          height: 100,
          editable: true,
          fieldKey: "couple_names",
          zIndex: 2,
        },
        {
          id: "event_date",
          type: "text",
          text: "SATURDAY, DECEMBER 12, 2026",
          fontSize: 28,
          fontFamily: "Inter",
          fontWeight: "600",
          letterSpacing: 3,
          color: primaryColor,
          textAlign: "center",
          x: 140,
          y: 540,
          width: 800,
          height: 40,
          editable: true,
          fieldKey: "event_date",
          zIndex: 2,
        },
        {
          id: "venue_name",
          type: "text",
          text: "The Grand Horizon Ballroom",
          fontSize: 32,
          fontFamily: "Playfair Display",
          color: primaryColor,
          textAlign: "center",
          x: 140,
          y: 640,
          width: 800,
          height: 50,
          editable: true,
          fieldKey: "venue_name",
          zIndex: 2,
        },
        {
          id: "countdown_widget",
          type: "countdown",
          x: 190,
          y: 820,
          width: 700,
          height: 120,
          color: primaryColor,
          zIndex: 2,
        },
        {
          id: "rsvp_cta_button",
          type: "button",
          buttonText: "RSVP ATTENDANCE",
          actionType: "rsvp",
          buttonStyle: "solid",
          buttonBg: primaryColor,
          buttonColor: "#FFFFFF",
          x: 340,
          y: 1040,
          width: 400,
          height: 65,
          borderRadius: 8,
          zIndex: 2,
        },
      ],
    };

    saveCustomTemplate(newTemplate);
    setSuccess(true);
    setTimeout(() => {
      router.push("/admin/templates");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/templates"
          className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Add Custom Design</h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Create a custom invitation design for any celebration category.
          </p>
        </div>
      </div>

      {success && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="h-4 w-4" />
          <span>Design added successfully! Redirecting to templates manager...</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Design Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Rajputana Sangeet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Event Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="wedding">💍 Wedding</option>
              <option value="engagement">💎 Engagement</option>
              <option value="birthday">🎂 Birthday</option>
              <option value="anniversary">✨ Anniversary</option>
              <option value="baby_shower">🍼 Baby Shower</option>
              <option value="housewarming">🏡 Housewarming</option>
              <option value="graduation">🎓 Graduation</option>
              <option value="religious">☀️ Religious</option>
              <option value="other">📅 Other Event</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-stone-300 mb-1.5">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="A brief summary of the design aesthetics and atmosphere..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Price & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Publication Price (₹) *
            </label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
            />
            <span className="text-[10px] text-stone-500 mt-1 block">Set 0 for free template</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. luxury, gold, palace, floral"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-12 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 rounded-xl bg-stone-950 border border-stone-800 px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Primary Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-12 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 rounded-xl bg-stone-950 border border-stone-800 px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>
        </div>

        {/* Thumbnail URL */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-300">
            Cover / Thumbnail Image URL
          </label>
          <input
            type="url"
            required
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
          />

          {/* Quick presets */}
          <div>
            <span className="text-[10px] text-stone-500 font-semibold block mb-1.5">
              Or pick a royalty-free stock preset:
            </span>
            <div className="flex flex-wrap gap-2">
              {presetThumbnails.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setThumbnailUrl(preset.url)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                    thumbnailUrl === preset.url
                      ? "bg-amber-600 text-white border-amber-500"
                      : "bg-stone-950 text-stone-400 border-stone-800 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
          <Link
            href="/admin/templates"
            className="rounded-xl px-4 py-2.5 text-xs font-bold text-stone-400 hover:text-white transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-gold hover:bg-amber-500 transition active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Saving Design..." : "Save & Publish Design"}
          </button>
        </div>
      </form>
    </div>
  );
}
