'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MessageSquare, BookOpen, BarChart2, Sun, Settings } from 'lucide-react'

const navItems = [
  { href: 'chat', icon: MessageSquare, pt: 'Reflexão', en: 'Reflect' },
  { href: 'journal', icon: BookOpen, pt: 'Diário', en: 'Journal' },
  { href: 'dashboard', icon: BarChart2, pt: 'Progresso', en: 'Progress' },
  { href: 'checkin', icon: Sun, pt: 'Check-in', en: 'Check-in' },
  { href: 'settings', icon: Settings, pt: 'Definições', en: 'Settings' },
]

export default function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-[#1F2937] flex items-center justify-around px-1 py-1 z-50">
      {navItems.map(({ href, icon: Icon, pt, en }) => {
        const fullPath = `/${locale}/${href}`
        const active = pathname.startsWith(fullPath)
        const label = locale === 'en' ? en : pt
        return (
          <Link
            key={href}
            href={fullPath}
            className={cn(
              'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition min-w-0',
              active ? 'text-purple-400' : 'text-slate-500'
            )}
          >
            <Icon size={18} />
            <span className="text-[10px] font-medium truncate">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
