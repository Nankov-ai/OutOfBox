import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateWeeklySummary } from '@/lib/gemini'
import { subDays } from 'date-fns'

export async function POST(req: NextRequest) {
  // Protect with cron secret
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const since = subDays(new Date(), 7)

  const users = await db.user.findMany({
    select: { id: true, preferredLocale: true },
    where: {
      sessions: {
        some: { updatedAt: { gte: since }, insights: { not: null } }
      }
    }
  })

  let processed = 0
  for (const user of users) {
    const sessions = await db.chatSession.findMany({
      where: { userId: user.id, updatedAt: { gte: since }, insights: { not: null } },
      select: { insights: true }
    })
    const insights = sessions.map(s => s.insights).filter(Boolean) as string[]
    if (insights.length === 0) continue

    const summary = await generateWeeklySummary(insights, user.preferredLocale ?? 'pt')
    const title = user.preferredLocale === 'en' ? '📊 Weekly reflection summary' : '📊 Resumo semanal de reflexão'

    await db.journalEntry.create({
      data: { userId: user.id, title, content: summary }
    })
    processed++
  }

  return NextResponse.json({ ok: true, processed })
}
