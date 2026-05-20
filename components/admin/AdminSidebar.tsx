'use client'
// components/admin/AdminSidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Gem, Package, Tag, CalendarDays,
  MapPin, Image, Newspaper, FileText, MessageSquare,
  Users, LogOut, Globe, ChevronRight, X
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { type: 'divider', label: 'Catalog' },
  { label: 'Brands', href: '/admin/brands', icon: Gem },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { type: 'divider', label: 'Boutiques & Events' },
  { label: 'Boutiques', href: '/admin/boutiques', icon: MapPin },
  { label: 'Events', href: '/admin/events', icon: CalendarDays },
  { type: 'divider', label: 'Media & Content' },
  { label: 'Hero Sliders', href: '/admin/sliders', icon: Image },
  { label: 'Press / Media', href: '/admin/media', icon: Newspaper },
  { label: 'Page Content', href: '/admin/content', icon: FileText },
  { type: 'divider', label: 'Communications' },
  { label: 'Messages', href: '/admin/contact-messages', icon: MessageSquare },
  { type: 'divider', label: 'System' },
  { label: 'Admin Users', href: '/admin/users', icon: Users },
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className={`
      fixed top-0 left-0 h-full w-64 admin-sidebar z-40 flex flex-col
      transform transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0
    `}>
      {/* Logo */}
<div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
  <Link href="/admin" className="flex items-center gap-3 min-w-0">
    
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-[#3a2d20]"
      style={{ backgroundColor: '#0b0816' }}
    >
      <img
        src="/images/home/ag-gold.png"
        alt="Amiri Gems"
        className="w-8 h-8 object-contain"
        style={{
          filter: 'brightness(1.15) contrast(1.15) saturate(1.3)'
        }}
      />
    </div>

    <div className="min-w-0">
      <p className="text-white font-sans text-sm font-semibold tracking-wide truncate">
        Amiri Gems
      </p>
      <p className="text-white/40 font-sans text-xs">
        Admin Panel
      </p>
    </div>

  </Link>

  <button
    onClick={onClose}
    className="lg:hidden text-white/40 hover:text-white ml-2"
  >
    <X size={18} />
  </button>
</div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto admin-sidebar-scroll py-4 px-3 space-y-0.5">
        {navItems.map((item, i) => {
          if ((item as any).type === 'divider') {
            return (
              <div key={i} className="pt-4 pb-1 px-3">
                <p className="text-xs text-white/30 font-sans font-semibold tracking-widest uppercase">
                  {item.label}
                </p>
              </div>
            )
          }

          const Icon = item.icon!
          const active = isActive(item.href!, item.exact)

          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={onClose}
              className={`admin-nav-item ${active ? 'active' : ''}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={12} className="text-gold opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="admin-nav-item"
        >
          <Globe size={16} />
          <span>View Website</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="admin-nav-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
