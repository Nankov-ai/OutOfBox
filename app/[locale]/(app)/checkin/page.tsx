import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CheckinClient from '@/components/checkin/CheckinClient'

export default async function CheckinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()
  if (!session?.user?.id) redirect(`/${locale}/login`)

  return <CheckinClient locale={locale} />
}
