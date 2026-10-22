import { Invitation, RsvpSubmission, UserProfile, AdminSettings, PaymentRecord, Template } from "../types";
import { getTemplateById } from "../templates";
import { isSupabaseConfigured, supabase } from "./client";

const LOCAL_STORAGE_INVITATIONS_KEY = "invitestudio_invitations";
const LOCAL_STORAGE_RSVPS_KEY = "invitestudio_rsvps";
const LOCAL_STORAGE_USER_KEY = "invitestudio_user";
const LOCAL_STORAGE_USERS_LIST_KEY = "invitestudio_all_users";
const LOCAL_STORAGE_PAYMENTS_KEY = "invitestudio_payments";
const LOCAL_STORAGE_ADMIN_SETTINGS_KEY = "invitestudio_admin_settings";
const LOCAL_STORAGE_CUSTOM_TEMPLATES_KEY = "invitestudio_custom_templates";
const LOCAL_STORAGE_TEMPLATE_PRICING_KEY = "invitestudio_template_pricing";

const LOCAL_STORAGE_GUEST_DRAFT_PREFIX = "invitestudio_guest_draft_";

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

// User Profile (No more automatic demo user: returns null if not logged in)
export function getCurrentUser(): UserProfile | null {
  return getLocalItem<UserProfile | null>(LOCAL_STORAGE_USER_KEY, null);
}

export function setCurrentUser(user: UserProfile | null): void {
  setLocalItem(LOCAL_STORAGE_USER_KEY, user);
}

export function getAllRegisteredUsers(): UserProfile[] {
  return getLocalItem<UserProfile[]>(LOCAL_STORAGE_USERS_LIST_KEY, []);
}

export function registerUser(
  fullName: string,
  email: string,
  password?: string,
  mobileNumber?: string
): { success: boolean; user?: UserProfile; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanMobile = mobileNumber ? mobileNumber.trim() : "";
  const users = getAllRegisteredUsers();

  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: "An account with this email address already exists. Please log in." };
  }

  if (cleanMobile && users.some((u) => (u.mobileNumber && u.mobileNumber.trim() === cleanMobile) || (u.phone && u.phone.trim() === cleanMobile))) {
    return { success: false, error: "An account with this mobile number already exists. Please log in." };
  }

  const newUser: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    fullName: fullName.trim(),
    phone: cleanMobile,
    mobileNumber: cleanMobile,
    password: password || "",
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName.trim())}`,
    plan: "free",
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  setLocalItem(LOCAL_STORAGE_USERS_LIST_KEY, users);
  setCurrentUser(newUser);
  return { success: true, user: newUser };
}

export function loginUser(
  identifier: string,
  password?: string
): { success: boolean; user?: UserProfile; error?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const users = getAllRegisteredUsers();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      (u.mobileNumber && u.mobileNumber.trim() === identifier.trim()) ||
      (u.phone && u.phone.trim() === identifier.trim())
  );

  if (!user) {
    if (cleanId.includes("@")) {
      const namePart = cleanId.split("@")[0];
      const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      return registerUser(capitalized, cleanId, password);
    }
    return { success: false, error: "No account found with this email or mobile number. Please create an account." };
  }

  // Password check if password was set
  if (user.password && password && user.password !== password) {
    return { success: false, error: "Invalid password. Please try again." };
  }

  setCurrentUser(user);
  return { success: true, user };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

// Guest Draft Helpers
export function getGuestDraft(templateId: string): Invitation | null {
  return getLocalItem<Invitation | null>(`${LOCAL_STORAGE_GUEST_DRAFT_PREFIX}${templateId}`, null);
}

export function saveGuestDraft(templateId: string, invitation: Invitation): void {
  setLocalItem(`${LOCAL_STORAGE_GUEST_DRAFT_PREFIX}${templateId}`, invitation);
}

export function clearGuestDraft(templateId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(`${LOCAL_STORAGE_GUEST_DRAFT_PREFIX}${templateId}`);
  } catch (err) {
    console.error("Failed to clear guest draft:", err);
  }
}

export async function assignInvitationToUser(invitationId: string, userId: string): Promise<Invitation | null> {
  const invite = await getInvitationById(invitationId);
  if (!invite) return null;
  const updated: Invitation = { ...invite, userId };
  await saveInvitation(updated);
  return updated;
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
  if (!items) {
    items = [];
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
  if (!rsvps) {
    rsvps = [];
    setLocalItem(LOCAL_STORAGE_RSVPS_KEY, rsvps);
  }
  return rsvps.filter((r) => r.invitationId === invitationId);
}

export async function getAllUserRsvps(userId: string): Promise<RsvpSubmission[]> {
  const invitations = await getAllUserInvitations(userId);
  const inviteIds = new Set(invitations.map((i) => i.id));
  let rsvps = getLocalItem<RsvpSubmission[]>(LOCAL_STORAGE_RSVPS_KEY, []);
  if (!rsvps) {
    rsvps = [];
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
  if (!rsvps) {
    rsvps = [];
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

// ----------------------------------------------------------------------------
// Admin Backend & Dynamic UPI Payment Engine
// ----------------------------------------------------------------------------

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  upiId: "invitestudio@upi",
  payeeName: "InviteStudio Events",
  defaultPrice: 1100,
  defaultPublicationPrice: 1100,
  currency: "INR",
  adminPin: "Nithin@fxodigital",
};

export function getAdminSettings(): AdminSettings {
  const settings = getLocalItem<AdminSettings>(LOCAL_STORAGE_ADMIN_SETTINGS_KEY, DEFAULT_ADMIN_SETTINGS);
  return {
    ...DEFAULT_ADMIN_SETTINGS,
    ...settings,
    adminPin: settings.adminPin || "Nithin@fxodigital",
  };
}

export function saveAdminSettings(settings: Partial<AdminSettings>): AdminSettings {
  const current = getAdminSettings();
  const updated = { ...current, ...settings };
  setLocalItem(LOCAL_STORAGE_ADMIN_SETTINGS_KEY, updated);
  return updated;
}

export function getAllPayments(): PaymentRecord[] {
  return getLocalItem<PaymentRecord[]>(LOCAL_STORAGE_PAYMENTS_KEY, []);
}

export async function createUpiPayment(data: {
  userId: string;
  userEmail?: string;
  invitationId: string;
  invitationTitle: string;
  invitationSlug: string;
  amount: number;
  upiId: string;
  utrNumber: string;
  status?: "pending" | "completed" | "rejected";
}): Promise<PaymentRecord> {
  const payments = getAllPayments();
  const newRecord: PaymentRecord = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: data.userId,
    userEmail: data.userEmail || "",
    invitationId: data.invitationId,
    invitationTitle: data.invitationTitle,
    invitationSlug: data.invitationSlug,
    amount: data.amount,
    currency: "INR",
    status: data.status || "completed",
    provider: "upi",
    upiId: data.upiId,
    utrNumber: data.utrNumber,
    createdAt: new Date().toISOString(),
  };
  payments.unshift(newRecord);
  setLocalItem(LOCAL_STORAGE_PAYMENTS_KEY, payments);

  // Provisional publish: unlock invitation so host can preview live while admin verifies
  const invite = await getInvitationById(data.invitationId);
  if (invite) {
    await saveInvitation({
      ...invite,
      isPublished: true,
      isPremium: true,
      settings: {
        ...invite.settings,
        isWatermarkHidden: true,
      },
    });
  }

  return newRecord;
}

export async function updatePaymentStatus(
  paymentId: string,
  status: "completed" | "rejected" | "pending"
): Promise<boolean> {
  const payments = getAllPayments();
  const target = payments.find((p) => p.id === paymentId);
  if (!target) return false;

  target.status = status;
  if (status === "completed") {
    target.verifiedAt = new Date().toISOString();
    if (target.invitationId) {
      const invite = await getInvitationById(target.invitationId);
      if (invite) {
        await saveInvitation({
          ...invite,
          isPublished: true,
          isPremium: true,
          settings: {
            ...invite.settings,
            isWatermarkHidden: true,
          },
        });
      }
    }
  } else if (status === "rejected") {
    if (target.invitationId) {
      const invite = await getInvitationById(target.invitationId);
      if (invite) {
        await saveInvitation({
          ...invite,
          isPremium: false,
          settings: {
            ...invite.settings,
            isWatermarkHidden: false,
          },
        });
      }
    }
  }

  setLocalItem(LOCAL_STORAGE_PAYMENTS_KEY, payments);
  return true;
}

// Custom Templates added by Admin
export function getCustomTemplates(): Template[] {
  return getLocalItem<Template[]>(LOCAL_STORAGE_CUSTOM_TEMPLATES_KEY, []);
}

export function saveCustomTemplate(template: Template): Template {
  const custom = getCustomTemplates();
  const existingIdx = custom.findIndex((t) => t.id === template.id);
  if (existingIdx >= 0) {
    custom[existingIdx] = template;
  } else {
    custom.unshift(template);
  }
  setLocalItem(LOCAL_STORAGE_CUSTOM_TEMPLATES_KEY, custom);
  return template;
}

export function deleteCustomTemplate(id: string): boolean {
  let custom = getCustomTemplates();
  custom = custom.filter((t) => t.id !== id);
  setLocalItem(LOCAL_STORAGE_CUSTOM_TEMPLATES_KEY, custom);
  return true;
}

// Template Pricing Overrides
export function getTemplatePricingOverrides(): Record<string, number> {
  return getLocalItem<Record<string, number>>(LOCAL_STORAGE_TEMPLATE_PRICING_KEY, {});
}

export function setTemplatePrice(templateId: string, price: number): void {
  const overrides = getTemplatePricingOverrides();
  overrides[templateId] = price;
  setLocalItem(LOCAL_STORAGE_TEMPLATE_PRICING_KEY, overrides);
}

