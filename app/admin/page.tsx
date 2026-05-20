// app/admin/page.tsx
import prisma from '@/lib/prisma'
import Link from 'next/link'
import {
  Gem, Package, CalendarDays, MapPin, MessageSquare,
  ArrowRight, TrendingUp, Plus, Image, Tag, Star
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function AdminDashboard() {
  const [
    brandsCount, productsCount, eventsCount, boutiquesCount,
    unreadMessages, featuredCount, categoriesCount, slidersCount,
    recentMessages, recentBrands, recentEvents, recentProducts,
  ] = await Promise.all([
    prisma.brand.count({ where: { isDeleted: false } }),
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.event.count({ where: { isDeleted: false } }),
    prisma.boutique.count({ where: { isDeleted: false } }),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.product.count({ where: { isFeatured: true, isDeleted: false } }),
    prisma.category.count({ where: { isDeleted: false } }),
    prisma.slider.count({ where: { isActive: true, isDeleted: false } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.brand.findMany({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.event.findMany({ where: { isDeleted: false }, orderBy: { date: 'desc' }, take: 4 }),
    prisma.product.findMany({ where: { isDeleted: false }, include: { brand: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 4 }),
  ])

  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col flex-1 space-y-6">

      {/* ── Header Banner ─────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #14152e 0%, #1a1a3e 50%, #14152e 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #b8974a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #b8974a 0%, transparent 40%)' }} />
        <div className="relative px-8 py-6 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden border border-[#3a2d20] shadow-lg flex-shrink-0"
          style={{
            background: 'linear-gradient(145deg, #0f0b1d 0%, #15112a 100%)'
          }}
        >
          <img
            src="/images/home/ag-gold.png"
            alt="Amiri Gems"
            className="w-10 h-10 object-contain"
            style={{
              filter: 'brightness(1.15) contrast(1.15) saturate(1.35)',
            }}
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="w-6 h-px"
              style={{ backgroundColor: '#b8974a' }}
            />
            
            <p
              className="text-[11px] tracking-[0.35em] uppercase font-sans"
              style={{ color: '#b8974a' }}
            >
              Admin Panel
            </p>
          </div>

          <h1 className="font-serif text-white text-3xl font-light leading-none mb-1">
            Welcome Back
          </h1>

          <p
            className="text-xs font-sans tracking-wide"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {date}
          </p>
        </div>
      </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/products/new"
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-lg text-white transition-colors"
              style={{ backgroundColor: '#b8974a' }}>
              <Plus size={14} /> New Product
            </Link>
            <Link href="/" target="_blank"
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-lg border transition-colors font-sans"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
              View Website <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Brands', value: brandsCount, icon: Gem, href: '/admin/brands', gradient: 'from-amber-500 to-yellow-600', light: 'bg-amber-50 text-amber-700' },
          { label: 'Total Products', value: productsCount, icon: Package, href: '/admin/products', gradient: 'from-blue-500 to-indigo-600', light: 'bg-blue-50 text-blue-700' },
          { label: 'Featured', value: featuredCount, icon: Star, href: '/admin/products?featured=true', gradient: 'from-purple-500 to-pink-600', light: 'bg-purple-50 text-purple-700' },
          { label: 'Active Sliders', value: slidersCount, icon: Image, href: '/admin/sliders', gradient: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50 text-emerald-700' },
          { label: 'Categories', value: categoriesCount, icon: Tag, href: '/admin/categories', gradient: 'from-orange-500 to-red-500', light: 'bg-orange-50 text-orange-700' },
          { label: 'Events', value: eventsCount, icon: CalendarDays, href: '/admin/events', gradient: 'from-sky-500 to-cyan-600', light: 'bg-sky-50 text-sky-700' },
          { label: 'Boutiques', value: boutiquesCount, icon: MapPin, href: '/admin/boutiques', gradient: 'from-green-500 to-emerald-600', light: 'bg-green-50 text-green-700' },
          { label: 'Unread Messages', value: unreadMessages, icon: MessageSquare, href: '/admin/contact-messages', gradient: 'from-red-500 to-rose-600', light: 'bg-red-50 text-red-700' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}
              className="group relative bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-amber-200 transition-all duration-200 overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:opacity-10 transition-opacity`} />
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.light}`}>
                  <Icon size={18} />
                </div>
                <ArrowRight size={13} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all mt-1" />
              </div>
              <p className="text-3xl font-bold text-gray-800 font-sans mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 font-sans">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#b8974a' }} />
          <h3 className="text-sm font-semibold text-gray-800">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'Add Brand', href: '/admin/brands/new', icon: Gem, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
            { label: 'Add Product', href: '/admin/products/new', icon: Package, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
            { label: 'Add Slider', href: '/admin/sliders/new', icon: Image, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
            { label: 'Add Category', href: '/admin/categories/new', icon: Tag, color: 'text-orange-600 bg-orange-50 hover:bg-orange-100' },
            { label: 'Add Event', href: '/admin/events', icon: CalendarDays, color: 'text-sky-600 bg-sky-50 hover:bg-sky-100' },
            { label: 'View Messages', href: '/admin/contact-messages', icon: MessageSquare, color: 'text-red-600 bg-red-50 hover:bg-red-100' },
          ].map(action => {
            const Icon = action.icon
            return (
              <Link key={action.label} href={action.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-center ${action.color}`}>
                <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                  <Icon size={18} />
                </div>
                <span className="text-xs font-medium leading-tight">{action.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Bottom 3 columns ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Messages */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#b8974a' }} />
              <h3 className="text-sm font-semibold text-gray-800">Messages</h3>
              {unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {unreadMessages}
                </span>
              )}
            </div>
            <Link href="/admin/contact-messages" className="text-xs font-sans transition-colors hover:text-amber-600" style={{ color: '#b8974a' }}>View All</Link>
          </div>
          {recentMessages.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {recentMessages.map(msg => (
                <Link key={msg.id} href="/admin/contact-messages" className="block px-5 py-3.5 hover:bg-amber-50 transition-colors">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-gray-800 truncate">{msg.name}</p>
                        {msg.status === 'UNREAD' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{msg.message.substring(0, 45)}...</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <MessageSquare size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No messages yet</p>
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <h3 className="text-sm font-semibold text-gray-800">Recent Products</h3>
            </div>
            <Link href="/admin/products" className="text-xs font-sans hover:text-amber-600 transition-colors" style={{ color: '#b8974a' }}>View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProducts.map(product => {
              const imgs: string[] = (() => { try { const p = product.images; if (Array.isArray(p)) return p; return JSON.parse(p as any || '[]') } catch { return [] } })()
              return (
                <Link key={product.id} href={`/admin/products/${product.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-amber-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                    {imgs[0]
                      ? <img src={imgs[0]} alt={product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">—</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.brand?.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${product.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {product.isPublished ? 'Live' : 'Draft'}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Brands + Events */}
        <div className="space-y-4">
          {/* Recent Brands */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-amber-500" />
                <h3 className="text-sm font-semibold text-gray-800">Recent Brands</h3>
              </div>
              <Link href="/admin/brands" className="text-xs hover:text-amber-600 transition-colors" style={{ color: '#b8974a' }}>View All</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentBrands.map(brand => (
                <Link key={brand.id} href={`/admin/brands/${brand.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-amber-50 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{brand.name}</p>
                    <p className="text-xs text-gray-400">{brand.type === 'JEWELLERY' ? 'Jewellery' : 'Watch'}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${brand.status ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {brand.status ? 'Active' : 'Inactive'}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-purple-500" />
                <h3 className="text-sm font-semibold text-gray-800">Events</h3>
              </div>
              <Link href="/admin/events" className="text-xs hover:text-amber-600 transition-colors" style={{ color: '#b8974a' }}>View All</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentEvents.length > 0 ? recentEvents.map(event => (
                <Link key={event.id} href="/admin/events" className="flex items-center gap-3 px-5 py-3 hover:bg-amber-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex flex-col items-center justify-center flex-shrink-0 text-white text-center"
                    style={{ backgroundColor: '#b8974a' }}>
                    <span className="text-xs font-bold leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-[8px] leading-none opacity-80 uppercase">
                      {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{event.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(event.date)}</p>
                  </div>
                </Link>
              )) : (
                <div className="px-5 py-6 text-center">
                  <p className="text-xs text-gray-400">No events</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer note ───────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 mt-2 pt-4 pb-2 text-center">
        <p className="text-xs text-gray-400 font-sans">Amiri Gems Admin Panel — All data synced with database</p>
      </div>
    </div>
  )
}