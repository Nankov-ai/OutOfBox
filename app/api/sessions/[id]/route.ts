import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const chatSession = await db.chatSession.findFirst({
    where: { id, userId: session.user.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  })
  if (!chatSession) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ session: chatSession })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await db.chatSession.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ ok: true })
}
