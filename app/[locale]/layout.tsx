import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })
const locales = ['pt', 'en']

export const metadata: Metadata = {
  title: 'OutOfBox',
  description: 'Treina a tua mentalidade de crescimento.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()
  const messages = await getMessages()
  return (
    <html lang={locale} className="dark">
      <body className={`${inter.className} bg-[#0A0F1E] text-slate-100 antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
