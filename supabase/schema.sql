-- ==============================================================================
-- InviteStudio: Digital Invitation SaaS Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS) & Triggers
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
-- Extends auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'pro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto create profile trigger when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'wedding', 'engagement', 'birthday', 'anniversary', 
    'baby_shower', 'housewarming', 'graduation', 'religious', 'other'
  )),
  description TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  canvas JSONB NOT NULL,
  background JSONB NOT NULL,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  theme_colors JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by everyone" 
  ON public.templates FOR SELECT USING (true);

-- 4. INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id TEXT REFERENCES public.templates(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TIMESTAMPTZ,
  event_time TEXT,
  venue_name TEXT,
  venue_address TEXT,
  host_names TEXT,
  rsvp_deadline TIMESTAMPTZ,
  description TEXT,
  
  -- Canvas data customized by user
  canvas JSONB NOT NULL,
  background JSONB NOT NULL,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Interactive settings & widgets
  settings JSONB NOT NULL DEFAULT '{
    "enable_countdown": true,
    "enable_rsvp": true,
    "enable_map": true,
    "enable_calendar": true,
    "enable_gallery": true,
    "enable_music": false,
    "music_url": "",
    "is_watermark_hidden": false,
    "theme_color": "#D4AF37",
    "whatsapp_phone": ""
  }'::jsonb,
  
  is_published BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_is_published ON public.invitations(is_published);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Invitations RLS:
-- 1. Anyone can view published invitations
CREATE POLICY "Published invitations are viewable by public" 
  ON public.invitations FOR SELECT 
  USING (is_published = true OR auth.uid() = user_id);

-- 2. Users can manage their own invitations
CREATE POLICY "Users can create their own invitations" 
  ON public.invitations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invitations" 
  ON public.invitations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invitations" 
  ON public.invitations FOR DELETE 
  USING (auth.uid() = user_id);

-- 5. INVITATION IMAGES TABLE (Galleries)
CREATE TABLE IF NOT EXISTS public.invitation_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitation_images_invitation_id ON public.invitation_images(invitation_id);

ALTER TABLE public.invitation_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Images of published invitations are viewable by all"
  ON public.invitation_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations i 
      WHERE i.id = invitation_images.invitation_id 
        AND (i.is_published = true OR i.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage images of their invitations"
  ON public.invitation_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations i 
      WHERE i.id = invitation_images.invitation_id 
        AND i.user_id = auth.uid()
    )
  );

-- 6. RSVPS TABLE
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('attending', 'not_attending', 'maybe')),
  guests_count INTEGER DEFAULT 1,
  dietary_requirements TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON public.rsvps(invitation_id);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- RSVPs RLS:
-- 1. Anyone can submit an RSVP to a published invitation
CREATE POLICY "Public can insert RSVP for published invitations"
  ON public.rsvps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations i 
      WHERE i.id = rsvps.invitation_id 
        AND i.is_published = true
    )
  );

-- 2. Invitation owners can view and manage their RSVPs
CREATE POLICY "Invitation owners can view RSVPs"
  ON public.rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations i 
      WHERE i.id = rsvps.invitation_id 
        AND i.user_id = auth.uid()
    )
  );

CREATE POLICY "Invitation owners can delete RSVPs"
  ON public.rsvps FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations i 
      WHERE i.id = rsvps.invitation_id 
        AND i.user_id = auth.uid()
    )
  );

-- 7. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'stripe', 'mock')),
  order_id TEXT,
  payment_id TEXT,
  signature TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_invitation_id ON public.payments(invitation_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
