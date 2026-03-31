'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Message = { id: string; role: 'USER' | 'ASSISTANT'; content: string; createdAt?: Date | string }
type Session = { id: string; messages: Message[] }

export default function ChatWindow({
  session,
  locale,
}: {
  session: Session
  locale: string
  userId: string
}) {
  const [messages, setMessages] = useState<Message[]>(session.messages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend() {
    if (!input.trim() || loading) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'USER', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, userMessage: input, locale }),
      })
      const data = await res.json()
      if (!res.ok || !data.content) throw new Error(data.error || 'No content')
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'ASSISTANT', content: data.content }
      ])
    } catch (e) {
      console.error('Reflect error:', e)
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'ASSISTANT', content: '⚠️ Erro ao obter resposta. Tenta novamente.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const placeholder = locale === 'en' ? "Share what's on your mind..." : 'Partilha o que tens na mente...'
  const thinkingText = locale === 'en' ? 'Reflecting...' : 'A refletir...'
  const emptyTitle = locale === 'en' ? 'Start your journey' : 'Começa a tua jornada'
  const emptyDesc = locale === 'en'
    ? 'Write a thought, obstacle or frustration.'
    : 'Escreve um pensamento, obstáculo ou desabafo.'

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 pb-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center text-3xl">
              💭
            </div>
            <h2 className="text-xl font-semibold text-slate-200">{emptyTitle}</h2>
            <p className="text-slate-400 max-w-sm text-sm">{emptyDesc}</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={cn('flex', msg.role === 'USER' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'USER'
                ? 'bg-purple-600 text-white rounded-br-sm'
                : 'bg-[#111827] border border-[#1F2937] text-slate-200 rounded-bl-sm'
            )}>
              {msg.role === 'ASSISTANT' && (
                <div className="text-amber-400 text-xs font-semibold mb-2 uppercase tracking-wider">OutOfBox</div>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 size={14} className="animate-spin text-purple-400" />
                {thinkingText}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-[#1F2937]">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={placeholder}
            rows={2}
            className="flex-1 bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:border-purple-500 transition"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-2 text-center">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
