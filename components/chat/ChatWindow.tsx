'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Mic, MicOff, Volume2, VolumeX, ShieldAlert, X, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

type SpeechRecognitionEvent = Event & { results: SpeechRecognitionResultList }
type SpeechRecognitionInstance = {
  lang: string; continuous: boolean; interimResults: boolean
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void; stop: () => void
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance
    webkitSpeechRecognition: new () => SpeechRecognitionInstance
  }
}

type Message = { id: string; role: 'USER' | 'ASSISTANT'; content: string; createdAt?: Date | string }
type Session = { id: string; messages: Message[]; type?: string }

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
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState<string | null>(null)
  const [showAiNotice, setShowAiNotice] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!sessionStorage.getItem('oob-ai-notice-dismissed')) setShowAiNotice(true)
  }, [])

  function dismissAiNotice() {
    sessionStorage.setItem('oob-ai-notice-dismissed', '1')
    setShowAiNotice(false)
  }

  // Speech-to-text
  function toggleMic() {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = locale === 'en' ? 'en-US' : 'pt-PT'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(prev => prev ? prev + ' ' + transcript : transcript)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  // Text-to-speech
  function toggleSpeak(msgId: string, text: string) {
    if (speaking === msgId) {
      window.speechSynthesis.cancel()
      setSpeaking(null)
      return
    }
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = locale === 'en' ? 'en-US' : 'pt-PT'
    utter.onend = () => setSpeaking(null)
    utter.onerror = () => setSpeaking(null)
    window.speechSynthesis.speak(utter)
    setSpeaking(msgId)
  }

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

  const isGrowth = session.type === 'GROWTH_PLAN'
  const placeholder = isGrowth
    ? (locale === 'en' ? 'Reply here...' : 'Responde aqui...')
    : (locale === 'en' ? "Share what's on your mind..." : 'Partilha o que tens na mente...')
  const thinkingText = locale === 'en' ? 'Reflecting...' : 'A refletir...'
  const emptyTitle = isGrowth
    ? (locale === 'en' ? 'Growth Plan' : 'Plano de Crescimento')
    : (locale === 'en' ? 'Start your journey' : 'Começa a tua jornada')
  const emptyDesc = isGrowth
    ? (locale === 'en' ? 'Your coach will guide you step by step to build a personal growth plan.' : 'O teu coach vai guiar-te passo a passo para construir um plano de crescimento pessoal.')
    : (locale === 'en' ? 'Write a thought, obstacle or frustration.' : 'Escreve um pensamento, obstáculo ou desabafo.')
  const emptyEmoji = isGrowth ? '🌱' : '💭'

  const aiNoticeTitle = locale === 'en' ? 'You are talking to an AI, not a person' : 'Estás a falar com uma IA, não uma pessoa'
  const aiNoticeText = locale === 'en'
    ? 'Required disclosure under the EU AI Act (Art. 50). All content in this chat is AI-generated: it may be inaccurate and does not replace professional medical, psychological, legal or financial advice.'
    : 'Aviso obrigatório nos termos do AI Act da UE (Art. 50). Todo o conteúdo deste chat é gerado por IA: pode conter imprecisões e não substitui aconselhamento profissional médico, psicológico, legal ou financeiro.'
  const aiPillLabel = locale === 'en' ? 'AI GENERATED' : 'GERADO POR IA'

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full">
      {showAiNotice && (
        <div
          role="alert"
          className="sticky top-0 z-20 flex items-start gap-3 border-b-2 border-amber-500 bg-gradient-to-r from-purple-950 via-[#1a1030] to-purple-950 px-4 py-3 shadow-lg shadow-black/40"
        >
          <ShieldAlert size={22} className="shrink-0 mt-0.5 text-amber-400" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-300 leading-tight">{aiNoticeTitle}</p>
            <p className="text-xs text-purple-100/90 leading-relaxed mt-1">{aiNoticeText}</p>
          </div>
          <button
            onClick={dismissAiNotice}
            className="shrink-0 rounded-md p-1 text-purple-300 hover:text-white hover:bg-white/10 transition"
            aria-label={locale === 'en' ? 'Dismiss' : 'Dispensar'}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 pb-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center text-3xl">
              {emptyEmoji}
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
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">OutOfBox</span>
                    {isGrowth && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-900/40 text-emerald-400 font-medium">Crescimento</span>}
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
                      title={locale === 'en' ? 'Content generated by an AI system (EU AI Act Art. 50)' : 'Conteúdo gerado por um sistema de IA (AI Act Art. 50)'}
                    >
                      <Bot size={9} aria-hidden="true" />
                      {aiPillLabel}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSpeak(msg.id, msg.content)}
                    className="text-slate-500 hover:text-amber-400 transition shrink-0"
                    title={speaking === msg.id ? 'Parar' : 'Ouvir'}
                  >
                    {speaking === msg.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  </button>
                </div>
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
          <button
            onClick={toggleMic}
            className={cn(
              'p-3 rounded-xl transition shrink-0',
              listening
                ? 'bg-red-600 hover:bg-red-500 animate-pulse'
                : 'bg-[#111827] border border-[#1F2937] hover:border-purple-500 text-slate-400 hover:text-purple-400'
            )}
            title={listening ? 'Parar gravação' : 'Falar'}
          >
            {listening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
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
