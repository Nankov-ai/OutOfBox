# OutOfBox — Architecture Document

## Concept
A mindset coaching web app inspired by the #belegendary podcast philosophy.
The AI acts as a reframing coach: when a user inputs a negative thought or obstacle,
it responds with 1–3 powerful reflection questions — never direct advice.

**Core philosophy:** Things don't happen TO you, they happen FOR you.
Every challenge is either a blessing or a lesson.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack, SSR, Vercel-native, API routes |
| Language | TypeScript | Type safety across the entire codebase |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, fully customizable dark design |
| Animation | Framer Motion | Premium feel for message transitions |
| AI | Google Gemini API (`gemini-1.5-flash`) | Required; fast and cost-effective |
| Auth | NextAuth.js v5 (Auth.js) | Google OAuth + magic link, App Router support |
| Database | PostgreSQL via Supabase | Managed Postgres + RLS + free tier |
| ORM | Prisma | Type-safe queries, migrations |
| i18n | next-intl | Best-in-class for App Router, server components |
| Push | Web Push API + `web-push` | VAPID-based, no vendor lock-in |
| Charts | Recharts | Weekly activity bar chart |
| Hosting | Vercel | Zero-config Next.js, Cron Jobs for notifications |

---

## Architecture Overview

```
Browser
  └─ Next.js App Router (Vercel)
       ├─ [locale]/(auth)         ← login/register pages
       ├─ [locale]/(app)          ← protected app shell
       │    ├─ /chat              ← ChatWindow ↔ /api/ai/reflect → Gemini API
       │    ├─ /journal           ← JournalEditor ↔ /api/journal
       │    ├─ /dashboard         ← StatsGrid, StreakCard ↔ /api/progress
       │    ├─ /checkin           ← DailyCheckIn ↔ /api/checkin
       │    └─ /settings          ← push sub ↔ /api/notifications/subscribe
       └─ /api
            ├─ auth/[...nextauth] ← NextAuth v5 + Prisma adapter
            ├─ ai/reflect         ← Gemini API call (server-side only)
            ├─ sessions           ← Prisma → Supabase Postgres
            ├─ journal            ← Prisma → Supabase Postgres
            ├─ checkin            ← Prisma + streak logic
            ├─ progress           ← Prisma aggregation
            └─ notifications/*    ← web-push + Vercel Cron
                    ↕
            Service Worker (sw.js)
              └─ Push Events → Notification display
```

---

## Key Design Decisions

1. **Gemini system prompt is server-side only** — `src/lib/gemini.ts` loads the system prompt and sets it as `systemInstruction` in every call. The API key never touches the browser.

2. **AI never gives advice** — the system prompt enforces this. The `/api/ai/reflect` route validates the response contains questions (checks for `?` characters, retries once if not).

3. **Streak logic is append-only** — `UserProgress` only increases. No manual editing. Maintains gamification trust.

4. **i18n-aware check-in questions** — daily question pool lives in `messages/pt.json` and `messages/en.json`. The API reads the user's `preferredLocale` and picks via deterministic daily rotation: `index = dayOfYear % questions.length`.

5. **Session-to-journal linking is optional** — a journal entry can exist independently, but a session can have at most one linked journal entry.

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| Background | `#0A0F1E` | Deep navy base |
| Primary | `#7C3AED` | Purple — brand accent |
| Accent | `#F59E0B` | Gold/amber — streaks, milestones |
| Text | `#E2E8F0` | Light readable text |
| Surface | `#111827` | Cards and panels |
| Border | `#1F2937` | Subtle dividers |

Dark theme only. Purple-to-navy gradients on hero areas. Gold glows on streak milestones (7+ days).
