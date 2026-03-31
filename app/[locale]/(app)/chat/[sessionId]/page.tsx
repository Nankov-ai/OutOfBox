import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import ChatWindow from '@/components/chat/ChatWindow'

export default async function ChatPage({
  params,
}: {
  params: Promise<{ locale: string; sessionId: string }>
}) {
  const { locale, sessionId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect(`/${locale}/login`)

  const chatSession = await db.chatSession.findFirst({
    where: { id: sessionId, userId: session.user.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  })

  if (!chatSession) redirect(`/${locale}/chat`)

  return <ChatWindow session={chatSession} locale={locale} userId={session.user.id} />
}
