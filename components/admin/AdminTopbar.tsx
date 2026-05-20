'use client'
// components/admin/AdminTopbar.tsx
import { useSession } from 'next-auth/react'
import { Menu, Bell } from 'lucide-react'
import { usePathname } from 'next/navigation'

const pageLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/brands': 'Brands',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/events': 'Events',
  '/admin/boutiques': 'Boutiques',
  '/admin/sliders': 'Hero Sliders',
  '/admin/media': 'Press / Media',
  '/admin/content': 'Page Content',
  '/admin/contact-messages': 'Contact Messages',
  '/admin/users': 'Admin Users',
}

function getLabel(pathname: string): string {
  if (pageLabels[pathname]) return pageLabels[pathname]
  // Match nested routes: /admin/brands/new, /admin/brands/[id], /admin/brands/[id]/edit
  const match = pathname.match(/^(\/admin\/[^/]+)(\/(.+))?$/)
  if (match) {
    const base = pageLabels[match[1]] || 'Admin'
    if (!match[3]) return base
    if (match[3] === 'new') return `New ${base.replace(/s$/, '')}`
    if (match[3].endsWith('/edit')) return `Edit ${base.replace(/s$/, '')}`
    return `${base.replace(/s$/, '')} Details`
  }
  return 'Admin'
}

interface Props {
  onMenuClick: () => void
}

export default function AdminTopbar({ onMenuClick }: Props) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const label = getLabel(pathname)

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-700">
          <Menu size={22} />
        </button>
        <h1 className="text-base font-sans font-semibold text-gray-800">{label}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 relative">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
            <span className="text-gold font-sans font-semibold text-sm">
              {session?.user?.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-sans font-medium text-gray-800">{session?.user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 font-sans">{(session?.user as any)?.role || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
