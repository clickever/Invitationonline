# Complete Production Deployment Guide for InviteStudio

This guide walks you through publishing **InviteStudio** to the web using **Vercel** (for hosting Next.js) and **Supabase** (for the PostgreSQL database & Auth).

---

## Prerequisites Checklist
1. A **GitHub** account ([github.com](https://github.com))
2. A **Vercel** account ([vercel.com](https://vercel.com) - free tier available)
3. A **Supabase** account ([supabase.com](https://supabase.com) - free tier available)
4. (Optional) A **Razorpay** account ([razorpay.com](https://razorpay.com)) if accepting live payments in India/international

---

## Step 1: Initialize Git and Push to GitHub

Open your terminal in this project directory (`/Users/nithinrajm/Documents/Invitationonline`) and run:

```bash
# 1. Initialize git repository
git init

# 2. Stage all project files
git add .

# 3. Create your initial commit
git commit -m "feat: initial InviteStudio production release"

# 4. Set default branch to main
git branch -M main

# 5. Create a new repository on GitHub (named 'invitestudio' or 'invitation-online')
# Then link it to your remote:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push your code to GitHub
git push -u origin main
```

---

## Step 2: Set Up Your Supabase Cloud Database

1. Go to [supabase.com](https://supabase.com) and click **"New Project"**.
2. Select your organization, name your project (e.g. `invitestudio-prod`), enter a secure database password, and choose a region close to your target audience (e.g. Mumbai `ap-south-1` or Singapore/US).
3. Once the database provisions (takes ~1-2 minutes):
   - In the left sidebar, click **SQL Editor**.
   - Click **"New Query"**.
   - Open the file `supabase/schema.sql` from your project, copy the entire SQL script, paste it into the query editor, and click **Run**.
   - This creates all tables (`profiles`, `templates`, `invitations`, `invitation_images`, `rsvps`, `payments`), Row Level Security policies, indexes, and triggers.
4. Obtain your API credentials:
   - In Supabase, go to **Project Settings** (gear icon) -> **API**.
   - Copy:
     - **Project URL** (`https://xyzcompany.supabase.co`)
     - **Project API Keys**: `anon` `public` key (safe for browser)
     - **Project API Keys**: `service_role` `secret` key (keep private)

---

## Step 3: Deploy to Vercel (Recommended for Next.js)

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Select your GitHub repository (`invitestudio`).
4. In the configuration screen:
   - **Framework Preset**: Next.js (automatically detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (leave default)
   - **Output Directory**: `.next` (leave default)

5. Under **Environment Variables**, add the following variables:

| Variable Name | Value | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | The production URL (or custom domain) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Your Supabase Anon Public Key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Your Supabase Service Role Key |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_...` (or test key) | Optional: Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | `your_razorpay_secret` | Optional: Razorpay Secret |

6. Click **"Deploy"**.
7. Vercel will install dependencies, compile the TypeScript code, optimize static pages, and generate your live URL (e.g. `https://invitestudio.vercel.app`).

---

## Step 4: Configure Authentication Redirect URLs in Supabase

To ensure users can sign in and be redirected back to your live domain:
1. In Supabase, go to **Authentication** -> **URL Configuration**.
2. Set **Site URL** to your live Vercel URL (e.g. `https://invitestudio.vercel.app`).
3. Under **Redirect URLs**, add:
   - `https://invitestudio.vercel.app/**`
   - `http://localhost:3000/**` (for local development)

---

## Step 5: (Optional) Connect a Custom Domain

1. In Vercel, go to your project **Settings** -> **Domains**.
2. Enter your custom domain (e.g. `invitestudio.com` or `app.yourbrand.com`).
3. Add the DNS records shown by Vercel (usually an `A` record pointing to `76.76.21.21` or a `CNAME` pointing to `cname.vercel-dns.com`) at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.).
4. Vercel will automatically provision a free SSL certificate within 2-5 minutes.
5. Update `NEXT_PUBLIC_APP_URL` in your Vercel Environment Variables to your custom domain.

---

## Step 6: Verify Live Production Features

Once published, visit your live website and verify:
1. **Homepage & Catalog**: Browse templates and filter by category (Weddings, Birthdays, etc.).
2. **Visual Editor**: Select a template, customize names and date, add a countdown or map widget, and click **Publish**.
3. **Public Page (`/i/[slug]`)**: Open the generated URL on your mobile phone to experience the mobile-first design, test the RSVP button with confetti, and test the WhatsApp share & QR code!
4. **Dashboard**: Verify the RSVP count and guest details in your dashboard.
