import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getReflectionQuestions } from '@/lib/gemini'
import { updateStreak } from '@/lib/streak'
import { z } from 'zod'

const schema = z.object({
  sessionId: z.string(),
  userMessage: z.string().min(1).max(2000),
  locale: z.enum(['pt', 'en']).default('pt'),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { sessionId, userMessage, locale } = parsed.data

  const chatSession = await db.chatSession.findFirst({
    where: { id: sessionId, userId: session.user.id }
  })
  if (!chatSession) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.chatMessage.create({ data: { sessionId, role: 'USER', content: userMessage } })

  const aiContent = await getReflectionQuestions(userMessage, locale)

  await db.chatMessage.create({ data: { sessionId, role: 'ASSISTANT', content: aiContent } })

  if (!chatSession.title) {
    await db.chatSession.update({
      where: { id: sessionId },
      data: { title: userMessage.slice(0, 60) + (userMessage.length > 60 ? '...' : '') }
    })
  }

  await db.userProgress.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, totalMessages: 1 },
    update: { totalMessages: { increment: 1 } }
  })
  await updateStreak(session.user.id)

  return NextResponse.json({ content: aiContent })
}
