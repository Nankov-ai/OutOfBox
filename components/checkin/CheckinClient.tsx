'use client'
import { useEffect, useState } from 'react'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'

type CheckIn = { id: string; question: string; response: string | null; completedAt: string | null }

export default function CheckinClient({ locale }: { locale: string }) {
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null)
  const [completed, setCompleted] = useState(false)
  const [response, setResponse] = useState('')
  const [saving, setSaving] = useState(false)
  const isEn = locale === 'en'

  useEffect(() => {
    fetch('/api/checkin')
      .then(r => r.json())
      .then(({ checkIn, completed }) => {
        setCheckIn(checkIn)
        setCompleted(completed)
        if (checkIn?.response) setResponse(checkIn.response)
      })
  }, [])

  async function submit() {
    if (!checkIn || !response.trim()) return
    setSaving(true)
    await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkInId: checkIn.id, response }),
    })
    setCompleted(true)
    setSaving(false)
  }

  if (!checkIn) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-purple-400" />
    </div>
  )

  return (
    <div className="p-6 max-w-xl mx-auto w-full space-y-6">
      <div>
        <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-2">
          {isEn ? "Today's check-in" : 'Check-in de hoje'}
        </p>
        <h2 className="text-xl font-semibold text-slate-100 leading-snug">{checkIn.question}</h2>
      </div>

      {completed ? (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
            <CheckCircle2 size={16} />
            {isEn ? 'Completed today' : 'Concluído hoje'}
          </div>
          {response && <p className="text-slate-300 text-sm leading-relaxed">{response}</p>}
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={response}
            onChange={e => setResponse(e.target.value)}
            placeholder={isEn ? 'Write your reflection...' : 'Escreve a tua reflexão...'}
            rows={5}
            className="w-full bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:border-purple-500 transition"
          />
          <button
            onClick={submit}
            disabled={saving || !response.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-sm font-medium transition"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {isEn ? 'Submit' : 'Enviar'}
          </button>
        </div>
      )}
    </div>
  )
}
