'use client'
import { Flame, MessageSquare, BookOpen, Sun } from 'lucide-react'

type Progress = {
  currentStreak: number; longestStreak: number
  totalSessions: number; totalMessages: number
  totalJournalEntries: number; totalCheckIns: number
} | null

export default function DashboardClient({ progress, locale }: { progress: Progress; locale: string }) {
  const s = progress
  const isEn = locale === 'en'

  const stats = [
    { icon: MessageSquare, label: isEn ? 'Reflections' : 'Reflexões', value: s?.totalSessions ?? 0, color: 'text-purple-400' },
    { icon: BookOpen, label: isEn ? 'Journal entries' : 'Entradas no diário', value: s?.totalJournalEntries ?? 0, color: 'text-blue-400' },
    { icon: Sun, label: isEn ? 'Check-ins' : 'Check-ins', value: s?.totalCheckIns ?? 0, color: 'text-amber-400' },
    { icon: MessageSquare, label: isEn ? 'Questions received' : 'Perguntas recebidas', value: s?.totalMessages ?? 0, color: 'text-green-400' },
  ]

  return (
    <div className="p-6 max-w-2xl mx-auto w-full space-y-8">
      <h1 className="text-2xl font-bold text-slate-100">{isEn ? 'Your progress' : 'O teu progresso'}</h1>

      {/* Streak */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 flex items-center gap-6">
        <div className={`text-6xl ${(s?.currentStreak ?? 0) >= 7 ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' : ''}`}>
          🔥
        </div>
        <div>
          <p className="text-4xl font-bold text-amber-400">{s?.currentStreak ?? 0}</p>
          <p className="text-slate-400 text-sm">{isEn ? 'day streak' : 'dias seguidos'}</p>
          <p className="text-slate-600 text-xs mt-1">{isEn ? `Best: ${s?.longestStreak ?? 0} days` : `Melhor: ${s?.longestStreak ?? 0} dias`}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4 flex items-center gap-4">
            <Icon size={20} className={color} />
            <div>
              <p className="text-2xl font-bold text-slate-100">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {s === null && (
        <p className="text-center text-slate-500 text-sm">
          {isEn ? 'Start a reflection to see your progress.' : 'Começa uma reflexão para ver o teu progresso.'}
        </p>
      )}
    </div>
  )
}
