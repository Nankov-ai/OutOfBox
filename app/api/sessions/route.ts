import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sessions = await db.chatSession.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: { messages: { take: 1, orderBy: { createdAt: 'asc' } } }
  })
  return NextResponse.json({ sessions })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let type: 'REFLECTION' | 'GROWTH_PLAN' = 'REFLECTION'
  try {
    const body = await req.json()
    if (body?.type === 'GROWTH_PLAN') type = 'GROWTH_PLAN'
  } catch { /* no body is fine */ }
  const chatSession = await db.chatSession.create({ data: { userId: session.user.id, type } })
  await db.userProgress.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, totalSessions: 1 },
    update: { totalSessions: { increment: 1 } }
  })
  return NextResponse.json({ session: chatSession })
}
