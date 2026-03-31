import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)
  return (
    <div className="flex h-screen bg-[#0A0F1E]">
      <Sidebar locale={locale} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
