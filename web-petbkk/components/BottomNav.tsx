'use client'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/',         label: 'หน้าหลัก',    icon: '🏠' },
  { href: '/food',     label: 'อาหาร',       icon: '🍖' },
  { href: '/hospital',  label: 'โรงพยาบาล',  icon: '🏥' },
  { href: '/guides',   label: 'คู่มือ',       icon: '📚' },
  { href: '/saved',    label: 'บันทึก',      icon: '❤️' },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="เมนูหลัก"
    >
      <div className="grid grid-cols-5">
        {TABS.map(tab => {
          const active = isActive(pathname, tab.href)
          return (
            <a
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-[10px] font-semibold transition-colors ${
                active ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span>{tab.label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
