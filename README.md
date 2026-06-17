# Elevate: Rise — v1 MVP

A gamified engagement app for the ELEV8 community. Built with React + Supabase.

## What's included

- **Auth** — email/password sign up & login, character selection (male/female)
- **Dashboard** — total EP, streak, rank, housing progression, referral count
- **Tap to Earn** — 500 taps/day, +1 EP each, satisfying tap animation
- **Lift Sessions** — 8AM/8PM check-in windows (Central Time), +1,000 EP each
- **Streak system** — daily login tracking with 7/30/90 day milestone bonuses
- **Referral system** — unique referral links, +1,000 EP on join, +5,000 EP when referral becomes active (3 login days)
- **Housing progression** — 6 tiers from Studio Apartment to Mansion, auto-updates
- **Rank system** — 7 ranks from Newcomer to Elevated, auto-updates
- **Leaderboard** — daily / weekly / all-time views
- **Admin panel** — search users, grant/remove EP manually

## Setup

### 1. Database (Supabase)

1. Go to your Supabase project SQL Editor
2. Run the entire contents of `supabase-schema.sql`
3. This creates all tables, functions, and security policies

To make yourself an admin after creating your account:
```sql
update profiles set is_admin = true where username = 'YOUR_USERNAME';
```

### 2. Install & run locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`

### 3. Deploy

Easiest option — [Vercel](https://vercel.com):
1. Push this repo to GitHub
2. Import the repo in Vercel
3. Deploy (no environment variables needed — Supabase keys are already in the code since they're public-safe anon keys)

## Project structure

```
src/
  lib/
    supabase.js       — Supabase client
    AuthContext.jsx   — auth state + login/signup/signout logic
  components/
    BottomNav.jsx     — mobile bottom navigation
    useToast.jsx      — toast notification hook
  pages/
    Login.jsx
    Register.jsx
    Dashboard.jsx     — main hub
    Tap.jsx           — tap-to-earn game
    Sessions.jsx      — 8AM/8PM check-in
    Leaderboard.jsx
    Referrals.jsx
    Profile.jsx
    Admin.jsx
  styles/
    global.css        — design system (colors, buttons, cards)
supabase-schema.sql    — full database schema, run this first
```

## Design notes

- Color system matches the ELEV8 brand: deep space black background, gold (#F0A830) as primary action/currency color, purple (#A06EF0) as secondary accent
- Mobile-first — max width 480px, works in any browser including on phone home screen
- All session time logic uses **America/Chicago** (Central Time) per spec

## What's NOT built yet (intentionally — per the spec's "Future Expansion" section)

Character customization, clothing, vehicles, businesses, NFTs, token integration, marketplace, guilds, missions/quests, achievements, premium memberships.

The database schema (especially `profiles` and the lookup tables) is structured so these can be added later without a rebuild.

## Notes on the Supabase anon key

The anon/public key used in `src/lib/supabase.js` is safe to expose client-side — that's its intended purpose. All sensitive operations (granting EP, checking in sessions, etc.) are protected by Row Level Security policies and run through database functions (`security definer`) rather than direct table writes from the client. Never expose your Supabase **service_role** key anywhere in this codebase.
