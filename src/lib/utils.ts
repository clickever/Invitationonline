import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Invitation } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  const sanitized = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 30);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${sanitized || "invitation"}-${randomSuffix}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function createGoogleCalendarUrl(invitation: Partial<Invitation>): string {
  const title = encodeURIComponent(invitation.title || "Special Celebration");
  const details = encodeURIComponent(
    `${invitation.description || ""}\n\nVenue: ${invitation.venueName || ""} - ${invitation.venueAddress || ""}\nRSVP via InviteStudio: ${typeof window !== "undefined" ? window.location.href : ""}`
  );
  const location = encodeURIComponent(
    `${invitation.venueName || ""}, ${invitation.venueAddress || ""}`
  );

  let dateStart = "";
  let dateEnd = "";

  if (invitation.eventDate) {
    try {
      const d = new Date(invitation.eventDate);
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      dateStart = `${year}${month}${day}T100000Z`;
      dateEnd = `${year}${month}${day}T140000Z`;
    } catch {
      dateStart = "";
    }
  }

  const datesParam = dateStart ? `&dates=${dateStart}/${dateEnd}` : "";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${datesParam}`;
}

export function generateIcsContent(invitation: Partial<Invitation>): string {
  const title = invitation.title || "Special Celebration";
  const description = `${invitation.description || ""}\\nVenue: ${invitation.venueName || ""}`;
  const location = `${invitation.venueName || ""}, ${invitation.venueAddress || ""}`;
  
  let dateStamp = "20261024T100000Z";
  if (invitation.eventDate) {
    try {
      const d = new Date(invitation.eventDate);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      dateStamp = `${y}${m}${day}T100000Z`;
    } catch {
      // keep fallback
    }
  }

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//InviteStudio//Digital Invitations//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${invitation.id || "invite"}-${Date.now()}@invitestudio.app`,
    `DTSTAMP:${dateStamp}`,
    `DTSTART:${dateStamp}`,
    `DTEND:${dateStamp}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcsFile(invitation: Partial<Invitation>) {
  const ics = generateIcsContent(invitation);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${invitation.slug || "invitation"}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatCurrency(amount: number, currency = "INR"): string {
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return `$${amount.toFixed(2)}`;
}
