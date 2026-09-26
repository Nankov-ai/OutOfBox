import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1),
  mood: z.number().min(1).max(5).optional(),
  sessionId: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const entries = await db.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ entries })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  const entry = await db.journalEntry.create({
    data: { userId: session.user.id, ...parsed.data }
  })
  await db.userProgress.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, totalJournalEntries: 1 },
    update: { totalJournalEntries: { increment: 1 } }
  })
  return NextResponse.json({ entry })
}
