# OutOfBox — API Routes

All protected routes validate the NextAuth session before processing.
All request/response bodies are JSON.

---

## Authentication
| Method | Route | Description |
|---|---|---|
| ALL | `/api/auth/[...nextauth]` | NextAuth magic link / Google OAuth |

---

## AI / Reflection
| Method | Route | Body | Response |
|---|---|---|---|
| POST | `/api/ai/reflect` | `{ sessionId, userMessage, locale }` | `{ questions: string[] }` |

- Calls Gemini with the system prompt from `Prompt.txt`
- Saves both the user message and AI response to `ChatMessage`
- Updates `UserProgress.totalMessages`
- Validates response contains `?` (retries once if not)

---

## Chat Sessions
| Method | Route | Body | Response |
|---|---|---|---|
| GET | `/api/sessions` | — | `{ sessions[], total }` |
| POST | `/api/sessions` | — | `{ session }` |
| GET | `/api/sessions/[id]` | — | `{ session, messages[] }` |
| PATCH | `/api/sessions/[id]` | `{ title }` | `{ session }` |
| DELETE | `/api/sessions/[id]` | — | `{ ok: true }` |

---

## Journal
| Method | Route | Body | Response |
|---|---|---|---|
| GET | `/api/journal` | `?page&sessionId` | `{ entries[], total }` |
| POST | `/api/journal` | `{ title, content, mood?, sessionId? }` | `{ entry }` |
| GET | `/api/journal/[id]` | — | `{ entry }` |
| PATCH | `/api/journal/[id]` | `{ title?, content?, mood? }` | `{ entry }` |
| DELETE | `/api/journal/[id]` | — | `{ ok: true }` |

---

## Daily Check-in
| Method | Route | Body | Response |
|---|---|---|---|
| GET | `/api/checkin` | — | `{ checkIn, completed: boolean }` |
| POST | `/api/checkin` | `{ checkInId, response? }` | `{ checkIn }` |

- GET creates today's check-in if none exists (question selected by `dayOfYear % questions.length`)
- POST marks as completed, updates streak

---

## Progress
| Method | Route | Response |
|---|---|---|
| GET | `/api/progress` | `{ progress, weeklyActivity: number[7] }` |

---

## Push Notifications
| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/notifications/subscribe` | `{ subscription }` | Save Web Push subscription |
| DELETE | `/api/notifications/unsubscribe` | `{ endpoint }` | Remove subscription |
| POST | `/api/notifications/send` | — | Called by Vercel Cron. Requires `Authorization: Bearer CRON_SECRET` |

---

## Streak Update Logic

Internal helper `updateStreak(userId)` in `src/lib/streak.ts`.
Called by: `/api/ai/reflect`, `/api/checkin` (POST), `/api/journal` (POST).

```
lastActiveDate == today    → no-op
lastActiveDate == yesterday → currentStreak++, update longestStreak if exceeded
lastActiveDate == older     → currentStreak = 1
always                      → lastActiveDate = today
```
