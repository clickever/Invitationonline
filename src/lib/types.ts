export type EventCategory =
  | 'wedding'
  | 'engagement'
  | 'birthday'
  | 'anniversary'
  | 'baby_shower'
  | 'housewarming'
  | 'graduation'
  | 'religious'
  | 'other';

export interface CanvasConfig {
  width: number;
  height: number;
}

export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image' | 'pattern';
  value: string;
  secondaryColor?: string;
  angle?: number;
  opacity?: number;
}

export type ElementType =
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'countdown'
  | 'location'
  | 'rsvp_button'
  | 'badge'
  | 'shape';

export type FieldKey =
  | 'bride_name'
  | 'groom_name'
  | 'couple_names'
  | 'celebrant_name'
  | 'event_title'
  | 'event_subtitle'
  | 'event_date'
  | 'event_time'
  | 'venue_name'
  | 'venue_address'
  | 'rsvp_info'
  | 'host_names'
  | 'quote'
  | 'dress_code';

export interface CanvasElement {
  id: string;
  type: ElementType;
  editable?: boolean;
  fieldKey?: FieldKey;
  
  // Coordinates & sizing relative to canvas width/height (1080 x 1920)
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex?: number;
  opacity?: number;

  // Typography properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'capitalize' | 'lowercase';

  // Image properties
  src?: string;
  alt?: string;
  objectFit?: 'cover' | 'contain';
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;

  // Button properties
  buttonText?: string;
  buttonLink?: string;
  buttonStyle?: 'solid' | 'outline' | 'glass';
  buttonBg?: string;
  buttonColor?: string;
  actionType?: 'rsvp' | 'map' | 'calendar' | 'link' | 'whatsapp' | 'call';

  // Divider / Shape / Ornament properties
  shapeType?: 'line' | 'ornament' | 'circle' | 'rectangle' | 'arch';
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  ornamentStyle?: 'flourish' | 'wreath' | 'stars' | 'rings' | 'sparkles';
}

export interface TemplateThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  cardBg?: string;
}

export interface TemplateFontSettings {
  heading: string;
  body: string;
  script?: string;
}

export interface Template {
  id: string;
  name: string;
  category: EventCategory;
  description: string;
  isPremium: boolean;
  price?: number;
  thumbnailUrl: string;
  canvas: CanvasConfig;
  background: BackgroundConfig;
  elements: CanvasElement[];
  themeColors?: TemplateThemeColors;
  fontSettings?: TemplateFontSettings;
  tags?: string[];
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface InvitationSettings {
  enableCountdown: boolean;
  enableRsvp: boolean;
  enableMap: boolean;
  enableCalendar: boolean;
  enableGallery: boolean;
  enableMusic: boolean;
  musicUrl?: string;
  isWatermarkHidden: boolean;
  themeColor?: string;
  whatsappPhone?: string;
  contactPhone?: string;
  dressCode?: string;
  storyTitle?: string;
  storyText?: string;
  schedule?: ScheduleItem[];
}

export interface InvitationImage {
  id: string;
  invitationId: string;
  url: string;
  caption?: string;
  sortOrder: number;
}

export interface Invitation {
  id: string;
  userId: string;
  templateId: string;
  slug: string;
  title: string;
  eventType: EventCategory;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  hostNames?: string;
  rsvpDeadline?: string;
  description?: string;

  canvas: CanvasConfig;
  background: BackgroundConfig;
  elements: CanvasElement[];
  settings: InvitationSettings;

  isPublished: boolean;
  isPremium: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  images?: InvitationImage[];
}

export interface RsvpSubmission {
  id: string;
  invitationId: string;
  guestName: string;
  email?: string;
  phone?: string;
  attendanceStatus: 'attending' | 'not_attending' | 'maybe';
  guestsCount: number;
  dietaryRequirements?: string;
  message?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  password?: string;
  avatarUrl?: string;
  plan: 'free' | 'premium' | 'pro';
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userEmail?: string;
  invitationId?: string;
  invitationTitle?: string;
  invitationSlug?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'rejected';
  provider: 'upi' | 'razorpay' | 'mock';
  orderId?: string;
  paymentId?: string;
  upiId?: string;
  utrNumber?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface AdminSettings {
  upiId: string;
  payeeName: string;
  defaultPrice: number;
  defaultPublicationPrice?: number;
  currency?: string;
  adminPin: string;
  updatedAt?: string;
}


