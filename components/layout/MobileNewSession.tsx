'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Brain, Sprout } from 'lucide-react'

export default function MobileNewSession({ locale }: { locale: string }) {
  const [showPicker, setShowPicker] = useState(false)
  const [creating, setCreating] = useState(false)
  const router = useRouter()
  const pt = locale !== 'en'

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

  return (
    <>
      {/* FAB — visible on mobile only */}
      <button
        onClick={() => setShowPicker(true)}
        disabled={creating}
        className="md:hidden fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 shadow-lg flex items-center justify-center transition disabled:opacity-50"
        aria-label={pt ? 'Nova sessão' : 'New session'}
      >
        <Plus size={22} />
      </button>

      {/* Picker modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-4 sm:pb-0">
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
                className="flex items-start gap-4 p-4 rounded-xl border border-[#1F2937] hover:border-purple-600/50 hover:bg-purple-600/10 active:bg-purple-600/20 transition text-left"
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
                      ? 'Partilha o que tens na mente. O coach ajuda-te a ver de outro ângulo.'
                      : "Share what's on your mind. The coach helps you see from a new angle."}
                  </p>
                </div>
              </button>
              <button
                onClick={() => newSession('GROWTH_PLAN')}
                className="flex items-start gap-4 p-4 rounded-xl border border-[#1F2937] hover:border-emerald-600/50 hover:bg-emerald-600/10 active:bg-emerald-600/20 transition text-left"
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
                      ? 'Sessão guiada para construíres um plano de crescimento pessoal.'
                      : 'Guided session to build your personal growth plan.'}
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
