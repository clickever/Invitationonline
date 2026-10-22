import { EventCategory, Template } from "../types";
import { SEED_TEMPLATES } from "./seedData";
import { getCustomTemplates, getTemplatePricingOverrides } from "../supabase/storage";

export const CATEGORIES: { id: EventCategory; label: string; icon: string; count: number }[] = [
  { id: "wedding", label: "Wedding", icon: "Ring", count: 5 },
  { id: "engagement", label: "Engagement", icon: "Gem", count: 3 },
  { id: "birthday", label: "Birthday", icon: "Cake", count: 4 },
  { id: "anniversary", label: "Anniversary", icon: "Sparkles", count: 1 },
  { id: "baby_shower", label: "Baby Shower", icon: "Baby", count: 1 },
  { id: "housewarming", label: "Housewarming", icon: "Home", count: 1 },
  { id: "graduation", label: "Graduation", icon: "GraduationCap", count: 0 },
  { id: "religious", label: "Religious", icon: "Sun", count: 0 },
  { id: "other", label: "Other", icon: "Calendar", count: 0 },
];

export function getAllTemplates(): Template[] {
  let custom: Template[] = [];
  let priceOverrides: Record<string, number> = {};
  try {
    custom = getCustomTemplates();
    priceOverrides = getTemplatePricingOverrides();
  } catch {
    // SSR fallback
  }

  const all = [...custom, ...SEED_TEMPLATES];
  return all.map((tmpl) => {
    if (priceOverrides[tmpl.id] !== undefined) {
      const customPrice = priceOverrides[tmpl.id];
      return {
        ...tmpl,
        price: customPrice,
        isPremium: customPrice > 0,
      };
    }
    return tmpl;
  });
}

export function getTemplatesByCategory(category: string): Template[] {
  const all = getAllTemplates();
  if (!category || category === "all") {
    return all;
  }
  return all.filter((t) => t.category.toLowerCase() === category.toLowerCase());
}

export function getTemplateById(id: string): Template | undefined {
  const all = getAllTemplates();
  return all.find((t) => t.id === id);
}

