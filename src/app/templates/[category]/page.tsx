"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, ArrowRight } from "lucide-react";
import { getTemplatesByCategory, CATEGORIES } from "@/lib/templates";

export default function CategoryTemplatesPage() {
  const params = useParams();
  const category = (params?.category as string) || "wedding";
  const templates = getTemplatesByCategory(category);

  const categoryMeta = CATEGORIES.find(
    (c) => c.id.toLowerCase() === category.toLowerCase()
  ) || { label: category, icon: "✨" };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/templates"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Templates</span>
        </Link>

        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-4xl mb-1">{categoryMeta.icon}</div>
          <h1 className="font-serif text-4xl font-bold text-stone-900">
            {categoryMeta.label} Invitation Templates
          </h1>
          <p className="text-sm text-stone-600">
            Handcrafted luxury digital invitations designed exclusively for {categoryMeta.label.toLowerCase()} celebrations.
          </p>
        </div>

        {templates.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-stone-200/80 max-w-md mx-auto">
            <h3 className="font-serif text-lg font-bold text-stone-800">New designs arriving soon</h3>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Explore our wedding and celebration templates in the main gallery.
            </p>
            <Link
              href="/templates"
              className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow"
            >
              Browse All Templates
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group rounded-3xl bg-white overflow-hidden shadow-card border border-stone-200/80 hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 flex-wrap">
                    {template.tags?.includes("envelope") && (
                      <span className="rounded-full bg-rose-950/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-200 border border-rose-400/30">
                        ✉ Wax Seal
                      </span>
                    )}
                  </div>
                  {template.isPremium ? (
                    <span className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-stone-900 shadow">
                      ★ ₹{template.price ?? 1100}
                    </span>
                  ) : (
                    <span className="absolute top-4 right-4 rounded-full bg-emerald-500 text-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow">
                      FREE
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">{template.name}</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{template.description}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      {template.elements?.length || 8} elements
                    </span>
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
      </div>
    </div>
  );
}
