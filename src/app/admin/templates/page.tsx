"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Palette, 
  IndianRupee, 
  Save, 
  PlusCircle, 
  Trash2, 
  Check, 
  Sparkles,
  ExternalLink 
} from "lucide-react";
import { getAllTemplates } from "@/lib/templates";
import { 
  getTemplatePricingOverrides, 
  setTemplatePrice, 
  deleteCustomTemplate 
} from "@/lib/supabase/storage";
import { Template } from "@/lib/types";
import DigitalInvitationCardPreview from "@/components/templates/DigitalInvitationCardPreview";

export default function AdminTemplatesPricingPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [pricingState, setPricingState] = useState<Record<string, number>>({});
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const loadTemplates = () => {
    const all = getAllTemplates();
    setTemplates(all);
    const overrides = getTemplatePricingOverrides();
    const prices: Record<string, number> = {};
    all.forEach((t) => {
      prices[t.id] = overrides[t.id] !== undefined ? overrides[t.id] : (t.price ?? (t.isPremium ? 1100 : 0));
    });
    setPricingState(prices);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handlePriceChange = (id: string, newPriceStr: string) => {
    const val = parseInt(newPriceStr, 10);
    setPricingState((prev) => ({
      ...prev,
      [id]: isNaN(val) ? 0 : val,
    }));
  };

  const handleSavePrice = (id: string) => {
    const price = pricingState[id] ?? 0;
    setTemplatePrice(id, price);
    setSavedSuccessId(id);
    setTimeout(() => setSavedSuccessId(null), 2500);
    loadTemplates();
  };

  const handleDeleteCustom = (id: string) => {
    if (confirm("Are you sure you want to delete this custom template?")) {
      deleteCustomTemplate(id);
      loadTemplates();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Design Pricing Manager</h1>
          <p className="text-xs text-stone-400 mt-1">
            Configure custom publication pricing for individual invitation designs.
          </p>
        </div>

        <Link
          href="/admin/templates/new"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-500 transition active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Custom Design</span>
        </Link>
      </div>

      {/* Templates List */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 border-b border-stone-800 text-stone-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Design</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Publication Price (₹)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {templates.map((template) => {
                const currentPrice = pricingState[template.id] ?? (template.price ?? (template.isPremium ? 1100 : 0));
                const isCustom = template.id.startsWith("custom-");

                return (
                  <tr key={template.id} className="hover:bg-stone-850/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-10 rounded-lg overflow-hidden shadow-xs border border-stone-800 shrink-0">
                          <DigitalInvitationCardPreview template={template} showBadge={false} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate max-w-[200px]">
                            {template.name}
                          </div>
                          <span className="font-mono text-[10px] text-stone-500">
                            {template.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded-full bg-stone-950 border border-stone-800 px-2.5 py-0.5 text-[10px] uppercase font-bold text-stone-300">
                        {template.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {currentPrice > 0 ? (
                        <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] uppercase font-bold text-amber-400">
                          Premium
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] uppercase font-bold text-emerald-400">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 max-w-[140px]">
                        <span className="text-stone-400 font-bold font-mono">₹</span>
                        <input
                          type="number"
                          value={currentPrice}
                          onChange={(e) => handlePriceChange(template.id, e.target.value)}
                          className="w-24 rounded-lg bg-stone-950 border border-stone-800 px-2.5 py-1.5 font-mono text-xs text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleSavePrice(template.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition active:scale-95 ${
                          savedSuccessId === template.id
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-600 hover:bg-amber-500 text-white"
                        }`}
                      >
                        {savedSuccessId === template.id ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5" />
                            <span>Update</span>
                          </>
                        )}
                      </button>

                      {isCustom && (
                        <button
                          onClick={() => handleDeleteCustom(template.id)}
                          className="p-1.5 text-stone-500 hover:text-red-400 rounded-lg hover:bg-stone-800 transition"
                          title="Delete Custom Template"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
