# OutOfBox — Implementation Phases

---

## Phase 1 — Foundation
**Goal:** Runnable skeleton with auth and basic chat.

- [ ] Scaffold Next.js 14 with TypeScript + Tailwind + App Router
- [ ] Configure `next-intl` — `messages/pt.json`, `messages/en.json`, `middleware.ts`, `[locale]` routing
- [ ] Set up Prisma + Supabase — write schema, run first migration
- [ ] Configure NextAuth v5 — Google OAuth + email magic link, protect `(app)` route group
- [ ] Implement Gemini integration — `src/lib/gemini.ts` with system prompt from `Prompt.txt`
- [ ] Create `/api/ai/reflect` route
- [ ] Build `ChatWindow`, `MessageBubble`, `ChatInput`, `ReflectionCard` — functional, minimal styling
- [ ] Wire `/api/sessions` and `/api/messages` — basic persistence

**Milestone:** User can log in, start a chat, type a thought, receive Gemini reflection questions. Data persists.

---

## Phase 2 — Core Features
**Goal:** Journal, check-in, and progress tracking.

- [ ] Build Journal — `JournalEditor`, `JournalList`, `JournalEntryCard`, wire `/api/journal` CRUD
- [ ] Add "link to session" feature in journal
- [ ] Build Daily Check-in — question bank in `messages/` files, `/api/checkin` GET/POST
- [ ] `DailyCheckIn` modal shown on app load if not completed today
- [ ] Build Progress Dashboard — `StreakCard`, `StatsGrid`
- [ ] Implement `updateStreak()` logic in `src/lib/streak.ts`
- [ ] Wire `/api/progress`
- [ ] `WeeklySummary` chart with Recharts

**Milestone:** Full core loop functional. Chat → Journal → Check-in → Streak.

---

## Phase 3 — Design & UX Polish
**Goal:** Premium dark/gradient aesthetic.

- [ ] Design tokens in `tailwind.config.ts` — navy `#0A0F1E`, purple `#7C3AED`, gold `#F59E0B`
- [ ] Purple-to-navy gradients, gold accents on streak milestones
- [ ] Framer Motion — message entrance, page transitions, streak counter animation
- [ ] Mobile-first responsive — bottom nav mobile, sidebar desktop
- [ ] PWA setup — `manifest.json`, app icons, service worker base
- [ ] `LanguageSwitcher` component

**Milestone:** App looks premium, works well on mobile.

---

## Phase 4 — Push Notifications
**Goal:** Daily reminders that bring users back.

- [ ] Register service worker (`public/sw.js`) — handles `push` and `notificationclick`
- [ ] Notification permission flow in Settings — `useNotifications` hook, calls `/api/notifications/subscribe`
- [ ] `src/lib/push.ts` — wraps `web-push` with `sendNotification()` helper
- [ ] `/api/notifications/send` route with `CRON_SECRET` guard
- [ ] `vercel.json` Cron Job — calls `/api/notifications/send` at 8am UTC daily
- [ ] Notification time personalization — user sets preferred time in settings

**Milestone:** Users receive daily push notifications to reflect.

---

## Phase 5 — Quality & Launch
**Goal:** Production-ready.

- [ ] Error handling — `ErrorBoundary`, API error responses, Gemini failure fallback
- [ ] Loading states — skeleton screens for chat history, journal list, dashboard
- [ ] Empty states — illustrated prompts for new users
- [ ] SEO — `metadata` on all pages, Open Graph for landing page
- [ ] Environment validation — `@t3-oss/env-nextjs`
- [ ] Accessibility — keyboard nav, ARIA labels, focus management in modals
- [ ] Rate limiting on `/api/ai/reflect` — prevent API abuse
- [ ] Deploy to Vercel — configure env vars, test push notifications end-to-end

**Milestone:** Live in production.
