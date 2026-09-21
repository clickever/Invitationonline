import { EventCategory, Template } from "../types";
import { SEED_TEMPLATES } from "./seedData";

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
  return SEED_TEMPLATES;
}

export function getTemplatesByCategory(category: string): Template[] {
  if (!category || category === "all") {
    return SEED_TEMPLATES;
  }
  return SEED_TEMPLATES.filter((t) => t.category.toLowerCase() === category.toLowerCase());
}

export function getTemplateById(id: string): Template | undefined {
  return SEED_TEMPLATES.find((t) => t.id === id);
}
