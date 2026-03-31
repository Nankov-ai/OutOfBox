'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MessageSquare, BookOpen, BarChart2, Sun, Settings } from 'lucide-react'

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
  return (
    <aside className="hidden md:flex flex-col w-16 lg:w-56 bg-[#111827] border-r border-[#1F2937] p-3 gap-1 shrink-0">
      <div className="mb-6 px-2 py-4">
        <h1 className="hidden lg:block font-bold text-lg bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
          OutOfBox
        </h1>
        <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-amber-500" />
      </div>
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
  )
}
