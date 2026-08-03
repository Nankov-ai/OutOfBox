'use client'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { use } from 'react'

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const t = useTranslations('auth')
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#111827] border border-[#1F2937]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
            OutOfBox
          </h1>
          <p className="text-slate-400 mt-2 text-sm">{t('loginSubtitle')}</p>
        </div>
        <button
          onClick={() => signIn('google', { callbackUrl: `/${locale}/chat` })}
          className="w-full py-3 px-4 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition text-sm"
        >
          {t('continueGoogle')}
        </button>
      </div>
    </div>
  )
}
