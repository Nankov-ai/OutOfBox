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

export default function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-[#1F2937] flex items-center justify-around px-2 py-2 z-50">
      {navItems.map(({ href, icon: Icon }) => {
        const fullPath = `/${locale}/${href}`
        const active = pathname.startsWith(fullPath)
        return (
          <Link
            key={href}
            href={fullPath}
            className={cn(
              'flex flex-col items-center p-2 rounded-xl transition',
              active ? 'text-purple-400' : 'text-slate-500'
            )}
          >
            <Icon size={20} />
          </Link>
        )
      })}
    </nav>
  )
}
