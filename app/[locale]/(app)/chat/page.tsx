import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function ChatIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()
  if (!session?.user?.id) redirect(`/${locale}/login`)

  let chatSession = await db.chatSession.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' }
  })

  if (!chatSession) {
    chatSession = await db.chatSession.create({ data: { userId: session.user.id } })
  }

  redirect(`/${locale}/chat/${chatSession.id}`)
}
