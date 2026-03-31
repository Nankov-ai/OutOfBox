import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { subDays, startOfDay } from 'date-fns'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const progress = await db.userProgress.findUnique({ where: { userId: session.user.id } })

  // Weekly activity: count messages per day for the last 7 days
  const weeklyActivity = await Promise.all(
    Array.from({ length: 7 }, (_, i) => {
      const day = startOfDay(subDays(new Date(), 6 - i))
      const next = startOfDay(subDays(new Date(), 5 - i))
      return db.chatMessage.count({
        where: {
          session: { userId: session.user.id },
          role: 'USER',
          createdAt: { gte: day, lt: next }
        }
      })
    })
  )

  return NextResponse.json({ progress, weeklyActivity })
}
