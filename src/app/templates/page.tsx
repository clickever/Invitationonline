"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  Eye, 
  Check, 
  X 
} from "lucide-react";
import { getAllTemplates, CATEGORIES } from "@/lib/templates";
import { Template } from "@/lib/types";

function TemplateGalleryContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState<"all" | "free" | "premium">("all");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const allTemplates = getAllTemplates();

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      // Category filter
      const matchesCategory =
        activeCategory === "all" || t.category.toLowerCase() === activeCategory.toLowerCase();

      // Tier filter
      const matchesTier =
        filterTier === "all" ||
        (filterTier === "free" && !t.isPremium) ||
        (filterTier === "premium" && t.isPremium);

      // Search query
      const matchesSearch =
        !searchQuery.trim() ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesTier && matchesSearch;
    });
  }, [allTemplates, activeCategory, filterTier, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>Curated Designer Collection</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
            Invitation Templates
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Select an invitation design to customize in our visual editor with your event details, fonts, countdowns, and real-time RSVPs.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 mb-10 space-y-5">
          {/* Top Row: Search & Tier */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search templates (e.g., gold, royal, floral, 50th)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Free vs Premium Toggle */}
            <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-semibold">
              <button
                onClick={() => setFilterTier("all")}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filterTier === "all" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
                }`}
              >
                All Designs
              </button>
              <button
                onClick={() => setFilterTier("free")}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filterTier === "free" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setFilterTier("premium")}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filterTier === "premium" ? "bg-amber-600 text-white shadow-sm" : "text-stone-500"
                }`}
              >
                ★ Premium
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-stone-100 pt-4">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                activeCategory === "all"
                  ? "bg-stone-900 text-white shadow"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              All Categories ({allTemplates.length})
            </button>
            {CATEGORIES.filter((c) => c.count > 0).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? "bg-stone-900 text-white shadow"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-xs text-stone-500 font-medium">
            Showing <strong className="text-stone-800">{filteredTemplates.length}</strong> templates
          </p>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-stone-200/80 max-w-md mx-auto">
            <Filter className="h-10 w-10 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-800">No templates found</h3>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Try adjusting your search keywords or switching category filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
                setFilterTier("all");
              }}
              className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative rounded-3xl bg-white overflow-hidden shadow-card border border-stone-200/80 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image / Thumbnail */}
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 flex-wrap">
                    <span className="rounded-full bg-stone-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {template.category.replace("_", " ")}
                    </span>
                    {template.isPremium ? (
                      <span className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-stone-900 shadow">
                        ★ ₹{template.price ?? 1100}
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500 text-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Hover Buttons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/editor/${template.id}`}
                        className="flex-1 rounded-xl bg-amber-500 py-3 text-center text-xs font-bold text-stone-950 shadow-lg hover:bg-amber-400 transition"
                      >
                        Customize This Design
                      </Link>
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className="rounded-xl bg-white/20 backdrop-blur-md p-3 text-white hover:bg-white/40 transition"
                        title="Quick Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-700 transition truncate">
                      {template.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      {template.isPremium ? (
                        <span className="text-xs font-bold text-amber-950 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          ₹{template.price ?? 1100} <span className="text-[10px] font-normal text-stone-500">/ publish</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          Free
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/editor/${template.id}`}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                    >
                      <span>Customize</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Quick Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between p-4 border-b border-stone-100">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    {previewTemplate.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">
                      {previewTemplate.category.replace("_", " ")}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs font-bold text-stone-700">
                      {previewTemplate.isPremium ? `₹${previewTemplate.price ?? 1100} single publication` : "100% Free"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="rounded-full p-2 text-stone-400 hover:bg-stone-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 text-center space-y-4 max-h-[70vh] overflow-y-auto">
                <img
                  src={previewTemplate.thumbnailUrl}
                  alt={previewTemplate.name}
                  className="rounded-2xl max-h-96 w-full object-cover shadow-sm mx-auto"
                />
                <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
                  {previewTemplate.description}
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Link
                    href={`/editor/${previewTemplate.id}`}
                    className="w-full rounded-2xl bg-amber-600 py-3 text-xs font-bold text-white shadow hover:bg-amber-700 transition"
                  >
                    {previewTemplate.isPremium ? `Customize (₹${previewTemplate.price ?? 1100} to Publish)` : "Customize Free Template"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] p-10 text-center">Loading template gallery...</div>}>
      <TemplateGalleryContent />
    </Suspense>
  );
}
