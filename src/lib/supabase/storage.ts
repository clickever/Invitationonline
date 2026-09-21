import { Invitation, RsvpSubmission, UserProfile } from "../types";
import { getTemplateById } from "../templates";
import { isSupabaseConfigured, supabase } from "./client";

const LOCAL_STORAGE_INVITATIONS_KEY = "invitestudio_invitations";
const LOCAL_STORAGE_RSVPS_KEY = "invitestudio_rsvps";
const LOCAL_STORAGE_USER_KEY = "invitestudio_user";

export const DEFAULT_DEMO_USER: UserProfile = {
  id: "usr_demo_8829",
  email: "sarah.designer@example.com",
  fullName: "Sarah Jenkins",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  plan: "free",
  createdAt: new Date().toISOString(),
};

// Initial sample invitations for demo/local storage
const INITIAL_DEMO_INVITATIONS: Invitation[] = [
  {
    id: "inv_sample_01",
    userId: "usr_demo_8829",
    templateId: "wedding-001",
    slug: "ananya-and-arjun-wedding",
    title: "Ananya & Arjun Wedding Celebration",
    eventType: "wedding",
    eventDate: "2026-10-24T17:00:00.000Z",
    eventTime: "5:00 PM onwards",
    venueName: "The Grand Oberoi Palace",
    venueAddress: "Heritage Lawns, Lake Palace Road, Udaipur, Rajasthan",
    hostNames: "Sharma & Verma Families",
    rsvpDeadline: "2026-10-10",
    description: "Join us in celebrating the wedding union of Ananya and Arjun in beautiful Udaipur.",
    canvas: { width: 1080, height: 1920 },
    background: { type: "color", value: "#FDFBF7" },
    elements: getTemplateById("wedding-001")?.elements || [],
    settings: {
      enableCountdown: true,
      enableRsvp: true,
      enableMap: true,
      enableCalendar: true,
      enableGallery: true,
      enableMusic: false,
      musicUrl: "",
      isWatermarkHidden: false,
      themeColor: "#D4AF37",
      whatsappPhone: "+919876543210",
    },
    isPublished: true,
    isPremium: false,
    viewsCount: 142,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    images: [
      {
        id: "img_1",
        invitationId: "inv_sample_01",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        caption: "Our first trip together",
        sortOrder: 1,
      },
      {
        id: "img_2",
        invitationId: "inv_sample_01",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        caption: "Sunset strolls",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "inv_sample_02",
    userId: "usr_demo_8829",
    templateId: "birthday-001",
    slug: "richard-50th-gilded-soiree",
    title: "Richard's 50th Golden Milestone",
    eventType: "birthday",
    eventDate: "2026-11-27T19:00:00.000Z",
    eventTime: "7:00 PM",
    venueName: "The Gilded Ballroom at The Ritz",
    venueAddress: "100 Central Park South, New York, NY",
    hostNames: "Sterling Family",
    rsvpDeadline: "2026-11-15",
    description: "A black-tie evening with dinner, dancing, and champagne to celebrate Richard's 50th.",
    canvas: { width: 1080, height: 1920 },
    background: { type: "color", value: "#0D0D0D" },
    elements: getTemplateById("birthday-001")?.elements || [],
    settings: {
      enableCountdown: true,
      enableRsvp: true,
      enableMap: true,
      enableCalendar: true,
      enableGallery: false,
      enableMusic: false,
      musicUrl: "",
      isWatermarkHidden: true,
      themeColor: "#E6C687",
      whatsappPhone: "+12125550199",
    },
    isPublished: false,
    isPremium: true,
    viewsCount: 38,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const INITIAL_DEMO_RSVPS: RsvpSubmission[] = [
  {
    id: "rsvp_01",
    invitationId: "inv_sample_01",
    guestName: "Priya & Siddharth Mehta",
    email: "priya.mehta@example.com",
    phone: "+91 98200 12345",
    attendanceStatus: "attending",
    guestsCount: 2,
    dietaryRequirements: "Vegetarian",
    message: "Cannot wait to celebrate with you both in Udaipur!",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "rsvp_02",
    invitationId: "inv_sample_01",
    guestName: "Marcus Vance",
    email: "marcus.v@example.com",
    phone: "+1 415 555 0192",
    attendanceStatus: "attending",
    guestsCount: 1,
    dietaryRequirements: "No nuts",
    message: "Booking flights this week. Huge congratulations!",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "rsvp_03",
    invitationId: "inv_sample_01",
    guestName: "Rohan & Aarti Kapoor",
    email: "rohan.kapoor@example.com",
    phone: "+91 98111 88776",
    attendanceStatus: "maybe",
    guestsCount: 2,
    dietaryRequirements: "None",
    message: "Checking work schedule, will confirm soon!",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Helper to access LocalStorage safely in Next.js SSR
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("LocalStorage write error:", err);
  }
}

// User Profile
export function getCurrentUser(): UserProfile | null {
  return getLocalItem<UserProfile | null>(LOCAL_STORAGE_USER_KEY, DEFAULT_DEMO_USER);
}

export function setCurrentUser(user: UserProfile | null): void {
  setLocalItem(LOCAL_STORAGE_USER_KEY, user);
}

// Invitations Store
export async function getAllUserInvitations(userId?: string): Promise<Invitation[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseInvitation);
      }
    } catch (err) {
      console.warn("Supabase query failed, using local store:", err);
    }
  }

  // Local Storage Fallback
  let items = getLocalItem<Invitation[]>(LOCAL_STORAGE_INVITATIONS_KEY, []);
  if (!items || items.length === 0) {
    items = INITIAL_DEMO_INVITATIONS;
    setLocalItem(LOCAL_STORAGE_INVITATIONS_KEY, items);
  }

  if (userId) {
    return items.filter((i) => i.userId === userId);
  }
  return items;
}

export async function getInvitationById(id: string): Promise<Invitation | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        return mapSupabaseInvitation(data);
      }
    } catch (err) {
      console.warn("Supabase fetch by ID failed:", err);
    }
  }

  const all = await getAllUserInvitations();
  return all.find((item) => item.id === id) || null;
}

export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!error && data) {
        return mapSupabaseInvitation(data);
      }
    } catch (err) {
      console.warn("Supabase fetch by slug failed:", err);
    }
  }

  const all = await getAllUserInvitations();
  return all.find((item) => item.slug === slug) || null;
}

export async function saveInvitation(invitation: Invitation): Promise<Invitation> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const payload = {
        id: invitation.id,
        user_id: invitation.userId,
        template_id: invitation.templateId,
        slug: invitation.slug,
        title: invitation.title,
        event_type: invitation.eventType,
        event_date: invitation.eventDate,
        event_time: invitation.eventTime,
        venue_name: invitation.venueName,
        venue_address: invitation.venueAddress,
        host_names: invitation.hostNames,
        rsvp_deadline: invitation.rsvpDeadline,
        description: invitation.description,
        canvas: invitation.canvas,
        background: invitation.background,
        elements: invitation.elements,
        settings: invitation.settings,
        is_published: invitation.isPublished,
        is_premium: invitation.isPremium,
        views_count: invitation.viewsCount,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from("invitations")
        .upsert(payload)
        .select()
        .single();
      if (!error && data) {
        return mapSupabaseInvitation(data);
      }
    } catch (err) {
      console.warn("Supabase upsert failed:", err);
    }
  }

  // Local Storage Save
  const all = await getAllUserInvitations();
  const index = all.findIndex((item) => item.id === invitation.id);
  const updated = {
    ...invitation,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    all[index] = updated;
  } else {
    all.unshift(updated);
  }

  setLocalItem(LOCAL_STORAGE_INVITATIONS_KEY, all);
  return updated;
}

export async function deleteInvitation(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("invitations").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete failed:", err);
    }
  }

  const all = await getAllUserInvitations();
  const filtered = all.filter((item) => item.id !== id);
  setLocalItem(LOCAL_STORAGE_INVITATIONS_KEY, filtered);
  return true;
}

// RSVP Submissions
export async function getRsvpsForInvitation(invitationId: string): Promise<RsvpSubmission[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .eq("invitation_id", invitationId)
        .order("created_at", { ascending: false });
      if (!error && data) {
        return data.map((r) => ({
          id: r.id,
          invitationId: r.invitation_id,
          guestName: r.guest_name,
          email: r.email,
          phone: r.phone,
          attendanceStatus: r.attendance_status,
          guestsCount: r.guests_count,
          dietaryRequirements: r.dietary_requirements,
          message: r.message,
          createdAt: r.created_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase get RSVPs failed:", err);
    }
  }

  let rsvps = getLocalItem<RsvpSubmission[]>(LOCAL_STORAGE_RSVPS_KEY, []);
  if (!rsvps || rsvps.length === 0) {
    rsvps = INITIAL_DEMO_RSVPS;
    setLocalItem(LOCAL_STORAGE_RSVPS_KEY, rsvps);
  }
  return rsvps.filter((r) => r.invitationId === invitationId);
}

export async function getAllUserRsvps(userId: string): Promise<RsvpSubmission[]> {
  const invitations = await getAllUserInvitations(userId);
  const inviteIds = new Set(invitations.map((i) => i.id));
  let rsvps = getLocalItem<RsvpSubmission[]>(LOCAL_STORAGE_RSVPS_KEY, []);
  if (!rsvps || rsvps.length === 0) {
    rsvps = INITIAL_DEMO_RSVPS;
    setLocalItem(LOCAL_STORAGE_RSVPS_KEY, rsvps);
  }
  return rsvps.filter((r) => inviteIds.has(r.invitationId));
}

export async function submitRsvp(rsvp: Omit<RsvpSubmission, "id" | "createdAt">): Promise<RsvpSubmission> {
  const newSubmission: RsvpSubmission = {
    ...rsvp,
    id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("rsvps").insert({
        id: newSubmission.id,
        invitation_id: newSubmission.invitationId,
        guest_name: newSubmission.guestName,
        email: newSubmission.email,
        phone: newSubmission.phone,
        attendance_status: newSubmission.attendanceStatus,
        guests_count: newSubmission.guestsCount,
        dietary_requirements: newSubmission.dietaryRequirements,
        message: newSubmission.message,
      });
    } catch (err) {
      console.warn("Supabase insert RSVP failed:", err);
    }
  }

  let rsvps = getLocalItem<RsvpSubmission[]>(LOCAL_STORAGE_RSVPS_KEY, []);
  if (!rsvps || rsvps.length === 0) {
    rsvps = INITIAL_DEMO_RSVPS;
  }
  rsvps.unshift(newSubmission);
  setLocalItem(LOCAL_STORAGE_RSVPS_KEY, rsvps);

  return newSubmission;
}

export async function deleteRsvp(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("rsvps").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete RSVP failed:", err);
    }
  }

  let rsvps = getLocalItem<RsvpSubmission[]>(LOCAL_STORAGE_RSVPS_KEY, []);
  rsvps = rsvps.filter((r) => r.id !== id);
  setLocalItem(LOCAL_STORAGE_RSVPS_KEY, rsvps);
  return true;
}

// Stats for dashboard
export async function getDashboardStats(userId: string) {
  const invitations = await getAllUserInvitations(userId);
  const totalInvitations = invitations.length;
  const draftInvitations = invitations.filter((i) => !i.isPublished).length;
  const publishedInvitations = invitations.filter((i) => i.isPublished).length;
  const rsvps = await getAllUserRsvps(userId);
  const totalRsvps = rsvps.length;
  const totalGuestsAttending = rsvps
    .filter((r) => r.attendanceStatus === "attending")
    .reduce((sum, r) => sum + (r.guestsCount || 1), 0);

  return {
    totalInvitations,
    draftInvitations,
    publishedInvitations,
    totalRsvps,
    totalGuestsAttending,
  };
}

// Upgrade invitation to Premium
export async function upgradeInvitationToPremium(invitationId: string): Promise<Invitation | null> {
  const invite = await getInvitationById(invitationId);
  if (!invite) return null;
  const updated: Invitation = {
    ...invite,
    isPremium: true,
    settings: {
      ...invite.settings,
      isWatermarkHidden: true,
      enableGallery: true,
      enableMusic: true,
    },
  };
  return saveInvitation(updated);
}

// Mapper for Supabase row
function mapSupabaseInvitation(row: any): Invitation {
  return {
    id: row.id,
    userId: row.user_id,
    templateId: row.template_id,
    slug: row.slug,
    title: row.title,
    eventType: row.event_type,
    eventDate: row.event_date,
    eventTime: row.event_time,
    venueName: row.venue_name,
    venueAddress: row.venue_address,
    hostNames: row.host_names,
    rsvpDeadline: row.rsvp_deadline,
    description: row.description,
    canvas: row.canvas,
    background: row.background,
    elements: row.elements || [],
    settings: row.settings || {},
    isPublished: row.is_published,
    isPremium: row.is_premium,
    viewsCount: row.views_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
