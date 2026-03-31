# OutOfBox — Folder Structure

```
/outofbox/
├── .env.local                        # secrets (never committed)
├── .env.example                      # documented env vars template
├── next.config.ts
├── tailwind.config.ts
├── vercel.json                       # cron job config
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── messages/
│   ├── en.json                       # English i18n strings
│   └── pt.json                       # Portuguese i18n strings
├── public/
│   ├── icons/                        # PWA icons, favicon
│   ├── manifest.json                 # PWA manifest
│   └── sw.js                         # Service worker (push notifications)
├── docs/                             # this folder
└── src/
    ├── app/
    │   ├── [locale]/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx              # landing page
    │   │   ├── (auth)/
    │   │   │   ├── login/page.tsx
    │   │   │   └── register/page.tsx
    │   │   └── (app)/               # protected route group
    │   │       ├── layout.tsx        # app shell
    │   │       ├── chat/
    │   │       │   ├── page.tsx
    │   │       │   └── [sessionId]/page.tsx
    │   │       ├── journal/
    │   │       │   ├── page.tsx
    │   │       │   └── [entryId]/page.tsx
    │   │       ├── dashboard/page.tsx
    │   │       ├── checkin/page.tsx
    │   │       └── settings/page.tsx
    │   └── api/
    │       ├── auth/[...nextauth]/route.ts
    │       ├── ai/reflect/route.ts
    │       ├── sessions/
    │       │   ├── route.ts
    │       │   └── [id]/route.ts
    │       ├── journal/
    │       │   ├── route.ts
    │       │   └── [id]/route.ts
    │       ├── checkin/route.ts
    │       ├── progress/route.ts
    │       └── notifications/
    │           ├── subscribe/route.ts
    │           ├── unsubscribe/route.ts
    │           └── send/route.ts     # called by Vercel Cron
    ├── components/
    │   ├── ui/                       # shadcn/ui base components
    │   ├── layout/
    │   │   ├── AppShell.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── TopBar.tsx
    │   │   └── LanguageSwitcher.tsx
    │   ├── chat/
    │   │   ├── ChatWindow.tsx
    │   │   ├── MessageBubble.tsx
    │   │   ├── ReflectionCard.tsx
    │   │   ├── ChatInput.tsx
    │   │   └── SessionList.tsx
    │   ├── journal/
    │   │   ├── JournalEditor.tsx
    │   │   ├── JournalEntryCard.tsx
    │   │   └── JournalList.tsx
    │   ├── dashboard/
    │   │   ├── StreakCard.tsx
    │   │   ├── StatsGrid.tsx
    │   │   ├── WeeklySummary.tsx
    │   │   └── ProgressRing.tsx
    │   ├── checkin/
    │   │   ├── DailyCheckIn.tsx
    │   │   └── CheckInPrompt.tsx
    │   └── common/
    │       ├── LoadingSpinner.tsx
    │       ├── EmptyState.tsx
    │       ├── ErrorBoundary.tsx
    │       └── ThemeProvider.tsx
    ├── lib/
    │   ├── db.ts                     # Prisma client singleton
    │   ├── gemini.ts                 # Gemini client + system prompt
    │   ├── auth.ts                   # NextAuth config
    │   ├── push.ts                   # web-push helpers
    │   ├── streak.ts                 # streak calculation logic
    │   ├── validations.ts            # Zod schemas
    │   └── utils.ts                  # cn(), date helpers
    ├── hooks/
    │   ├── useChat.ts
    │   ├── useJournal.ts
    │   ├── useProgress.ts
    │   ├── useNotifications.ts
    │   └── useLocale.ts
    ├── types/
    │   ├── index.ts
    │   └── next-auth.d.ts
    ├── middleware.ts                 # i18n routing + auth guard
    └── i18n.ts                       # next-intl config
```
