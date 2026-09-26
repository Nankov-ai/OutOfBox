'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { pt, enUS } from 'date-fns/locale'
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

type Entry = { id: string; title: string | null; content: string; mood: number | null; createdAt: Date | string }

const MOODS = ['', '😔', '😕', '😐', '🙂', '😊']

export default function JournalClient({ entries: initial, locale }: { entries: Entry[]; locale: string }) {
  const [entries, setEntries] = useState<Entry[]>(initial)
  const [selected, setSelected] = useState<Entry | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<number>(3)
  const [saving, setSaving] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const dateFnsLocale = locale === 'en' ? enUS : pt

  function openNew() {
    setSelected(null)
    setTitle('')
    setContent('')
    setMood(3)
    setIsNew(true)
  }

  function openEntry(e: Entry) {
    setSelected(e)
    setTitle(e.title ?? '')
    setContent(e.content)
    setMood(e.mood ?? 3)
    setIsNew(false)
  }

  async function save() {
    if (!content.trim()) return
    setSaving(true)
    try {
      if (isNew) {
        const res = await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, mood }),
        })
        const { entry } = await res.json()
        setEntries(prev => [entry, ...prev])
        setSelected(entry)
        setIsNew(false)
      } else if (selected) {
        await fetch(`/api/journal/${selected.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, mood }),
        })
        setEntries(prev => prev.map(e => e.id === selected.id ? { ...e, title, content, mood } : e))
      }
    } finally {
      setSaving(false)
    }
  }

  async function deleteEntry(id: string) {
    await fetch(`/api/journal/${id}`, { method: 'DELETE' })
    setEntries(prev => prev.filter(e => e.id !== id))
    if (selected?.id === id) { setSelected(null); setIsNew(false) }
  }

  const labels = {
    newEntry: locale === 'en' ? 'New entry' : 'Nova entrada',
    title: locale === 'en' ? 'Title (optional)' : 'Título (opcional)',
    write: locale === 'en' ? 'Write freely...' : 'Escreve livremente...',
    save: locale === 'en' ? 'Save' : 'Guardar',
    mood: locale === 'en' ? 'How are you feeling?' : 'Como te sentes?',
    empty: locale === 'en' ? 'No entries yet. Start writing.' : 'Ainda sem entradas. Começa a escrever.',
  }

  // On mobile: show list or editor, not both
  const showEditor = isNew || selected !== null

  return (
    <div className="flex h-full">
      {/* Sidebar — hidden on mobile when editor is open */}
      <div className={cn(
        'border-r border-[#1F2937] flex flex-col',
        'w-full md:w-64 md:shrink-0',
        showEditor ? 'hidden md:flex' : 'flex'
      )}>
        <div className="p-3 border-b border-[#1F2937]">
          <button onClick={openNew} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-medium transition">
            <Plus size={15} /> {labels.newEntry}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {entries.length === 0 && <p className="text-slate-500 text-xs p-3">{labels.empty}</p>}
          {entries.map(e => (
            <div key={e.id} onClick={() => openEntry(e)} className={cn(
              'p-3 rounded-xl cursor-pointer group transition',
              selected?.id === e.id ? 'bg-purple-600/20 border border-purple-600/30' : 'hover:bg-[#1F2937]'
            )}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200 truncate">{e.title || (locale === 'en' ? 'Untitled' : 'Sem título')}</p>
                <span className="text-xs">{e.mood ? MOODS[e.mood] : ''}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{format(new Date(e.createdAt), 'd MMM', { locale: dateFnsLocale })}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor — hidden on mobile when list is showing */}
      <div className={cn(
        'flex-col p-6 max-w-2xl mx-auto w-full',
        showEditor ? 'flex' : 'hidden md:flex'
      )}>
        {(isNew || selected) ? (
          <>
            <button
              onClick={() => { setSelected(null); setIsNew(false) }}
              className="md:hidden flex items-center gap-1 text-slate-400 text-sm mb-4"
            >
              <ArrowLeft size={15} /> {locale === 'en' ? 'Back' : 'Voltar'}
            </button>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={labels.title}
              className="bg-transparent text-xl font-semibold text-slate-100 placeholder-slate-600 focus:outline-none mb-4"
            />
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-500">{labels.mood}</span>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setMood(n)} className={cn('text-lg transition', mood === n ? 'scale-125' : 'opacity-40 hover:opacity-100')}>
                  {MOODS[n]}
                </button>
              ))}
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={labels.write}
              className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 resize-none focus:outline-none text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between pt-4 border-t border-[#1F2937] mt-4">
              {selected && (
                <button onClick={() => deleteEntry(selected.id)} className="text-slate-500 hover:text-red-400 transition">
                  <Trash2 size={16} />
                </button>
              )}
              <button onClick={save} disabled={saving || !content.trim()} className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-sm transition">
                <Save size={14} /> {labels.save}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-40">
            <p className="text-slate-400 text-sm">{labels.empty}</p>
          </div>
        )}
      </div>
    </div>
  )
}
