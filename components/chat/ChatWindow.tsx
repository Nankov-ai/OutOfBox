'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
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
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">OutOfBox</span>
                  <button
                    onClick={() => toggleSpeak(msg.id, msg.content)}
                    className="text-slate-500 hover:text-amber-400 transition ml-3"
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
