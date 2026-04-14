'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MessageSquare, BookOpen, BarChart2, Sun, Settings, Plus, X, Brain, Sprout } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: 'chat', icon: MessageSquare },
  { href: 'journal', icon: BookOpen },
  { href: 'dashboard', icon: BarChart2 },
  { href: 'checkin', icon: Sun },
  { href: 'settings', icon: Settings },
]

const labels: Record<string, { pt: string; en: string }> = {
  chat: { pt: 'Reflexão', en: 'Reflect' },
  journal: { pt: 'Diário', en: 'Journal' },
  dashboard: { pt: 'Progresso', en: 'Progress' },
  checkin: { pt: 'Check-in', en: 'Check-in' },
  settings: { pt: 'Definições', en: 'Settings' },
}

export default function Sidebar({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [showPicker, setShowPicker] = useState(false)
  const [creating, setCreating] = useState(false)

  async function newSession(type: 'REFLECTION' | 'GROWTH_PLAN') {
    setCreating(true)
    setShowPicker(false)
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      const { session } = await res.json()
      router.push(`/${locale}/chat/${session.id}`)
    } finally {
      setCreating(false)
    }
  }

  const pt = locale !== 'en'

  return (
    <>
      <aside className="hidden md:flex flex-col w-16 lg:w-56 bg-[#111827] border-r border-[#1F2937] p-3 gap-1 shrink-0">
        <div className="mb-2 px-2 py-4">
          <h1 className="hidden lg:block font-bold text-lg bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
            OutOfBox
          </h1>
          <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-amber-500" />
        </div>
        <button
          onClick={() => setShowPicker(true)}
          disabled={creating}
          className="flex items-center gap-2 px-2 py-2 mb-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-sm font-medium transition disabled:opacity-50"
        >
          <Plus size={16} className="shrink-0" />
          <span className="hidden lg:block">{pt ? 'Nova sessão' : 'New session'}</span>
        </button>
        {navItems.map(({ href, icon: Icon }) => {
          const fullPath = `/${locale}/${href}`
          const active = pathname.startsWith(fullPath)
          const label = labels[href]?.[locale as 'pt' | 'en'] ?? href
          return (
            <Link
              key={href}
              href={fullPath}
              className={cn(
                'flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-medium transition',
                active
                  ? 'bg-purple-600/20 text-purple-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2937]'
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden lg:block">{label}</span>
            </Link>
          )
        })}
      </aside>

      {/* Session type picker modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-100 font-semibold text-base">
                {pt ? 'Que tipo de sessão?' : 'What kind of session?'}
              </h2>
              <button onClick={() => setShowPicker(false)} className="text-slate-500 hover:text-slate-300 transition">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => newSession('REFLECTION')}
                className="flex items-start gap-4 p-4 rounded-xl border border-[#1F2937] hover:border-purple-600/50 hover:bg-purple-600/10 transition text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center shrink-0">
                  <Brain size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-100 text-sm font-medium mb-0.5">
                    {pt ? 'Reflexão' : 'Reflection'}
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {pt
                      ? 'Partilha o que tens na mente. O coach responde com perguntas que te ajudam a ver a situação de outro ângulo.'
                      : 'Share what\'s on your mind. The coach replies with questions to help you see things from a new angle.'}
                  </p>
                </div>
              </button>
              <button
                onClick={() => newSession('GROWTH_PLAN')}
                className="flex items-start gap-4 p-4 rounded-xl border border-[#1F2937] hover:border-emerald-600/50 hover:bg-emerald-600/10 transition text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center shrink-0">
                  <Sprout size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-100 text-sm font-medium mb-0.5">
                    {pt ? 'Plano de Crescimento' : 'Growth Plan'}
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {pt
                      ? 'Uma sessão guiada passo a passo para descobrires padrões internos e construíres um plano de crescimento pessoal.'
                      : 'A step-by-step guided session to uncover inner patterns and build a personal growth plan.'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
