'use client'
// components/public/Header.tsx
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, ChevronDown } from 'lucide-react'
import SearchModal from './SearchModal'

const jewelleryDropdown = [
  { label: 'High Jewellery', href: '/jewellery/high-jewellery' },
  { label: 'Bridal',         href: '/jewellery/bridal' },
  { label: 'Rings',          href: '/jewellery/rings' },
  { label: 'Earrings',       href: '/jewellery/earrings' },
  { label: 'Bracelets',      href: '/jewellery/bracelets' },
  { label: 'Pendants',       href: '/jewellery/pendants' },
  { label: 'All Jewellery',  href: '/jewellery' },
]

const mediaDropdown = [
  { label: 'News', href: '/media#news' },
  { label: 'Magazines', href: '/media#magazines' },
  { label: 'Exhibitions', href: '/media#exhibitions' },
  { label: 'TV Commercial', href: '/media#tv-commercial' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [jewelleryOpen, setJewelleryOpen] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)
  const [mobileJewelleryOpen, setMobileJewelleryOpen] = useState(false)
  const pathname = usePathname()
  const jewelleryRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 py-1.5 px-6 flex items-center justify-end">
        {/* <div className="flex items-center gap-1">
          <Link href="/ar" className="text-xs text-gray-500 font-sans tracking-widest hover:text-gray-700 transition-colors">
            العربية
          </Link>
        </div> */}
        <div className="flex items-center gap-4">
          <Link href="https://pinterest.com" target="_blank" aria-label="Pinterest" className="text-gray-400 hover:text-gold transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
          </Link>
          <Link href="https://instagram.com/amirigems" target="_blank" aria-label="Instagram" className="text-gray-400 hover:text-gold transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </Link>
          <Link href="https://facebook.com/amirigems" target="_blank" aria-label="Facebook" className="text-gray-400 hover:text-gold transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100'}`}>
       <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
          {/* Left nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/heritage"
              className={`luxury-label text-xs hover:text-gold transition-colors ${isActive('/heritage') ? 'text-gold' : 'text-gray-600'}`}
            >
              Heritage
            </Link>

            {/* Jewellery dropdown */}
            <div ref={jewelleryRef} className="relative" onMouseEnter={() => setJewelleryOpen(true)} onMouseLeave={() => setJewelleryOpen(false)}>
              <Link
                href="/jewellery"
                className={`luxury-label text-xs hover:text-gold transition-colors flex items-center gap-1 ${isActive('/jewellery') ? 'text-gold' : 'text-gray-600'}`}
              >
                Jewellery
                <ChevronDown size={10} className={`transition-transform ${jewelleryOpen ? 'rotate-180' : ''}`} />
              </Link>
              {jewelleryOpen && (
                <div className="absolute top-full left-0 mt-0 w-52 bg-white shadow-xl border border-gray-100 animate-slide-down z-50">
                  {jewelleryDropdown.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-5 py-3 luxury-label text-xs text-gray-600 hover:bg-cream hover:text-gold border-b border-gray-50 last:border-0 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/watches"
              className={`luxury-label text-xs hover:text-gold transition-colors ${isActive('/watches') ? 'text-gold' : 'text-gray-600'}`}
            >
              Watches
            </Link>
          </div>

          {/* Center logo */}
            <Link
              href="/"
              className="flex flex-col items-center group absolute left-1/2 -translate-x-1/2"
            >
              <Image
                src="/images/home/amiri-gems-gold.png"
                alt="Amiri Gems"
                width={220}
                height={90}
                priority
                className="object-contain"
              />
            </Link>
          {/* Right nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/events"
              className={`luxury-label text-xs hover:text-gold transition-colors ${isActive('/events') ? 'text-gold' : 'text-gray-600'}`}
            >
              Events
            </Link>

            {/* Media dropdown */}
            <div ref={mediaRef} className="relative" onMouseEnter={() => setMediaOpen(true)} onMouseLeave={() => setMediaOpen(false)}>
              <Link
                href="/media"
                className={`luxury-label text-xs hover:text-gold transition-colors flex items-center gap-1 ${isActive('/media') ? 'text-gold' : 'text-gray-600'}`}
              >
                Media
                <ChevronDown size={10} className={`transition-transform ${mediaOpen ? 'rotate-180' : ''}`} />
              </Link>
              {mediaOpen && (
                <div className="absolute top-full right-0 mt-0 w-44 bg-white shadow-xl border border-gray-100 animate-slide-down z-50">
                  {mediaDropdown.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-5 py-3 luxury-label text-xs text-gray-600 hover:bg-cream hover:text-gold border-b border-gray-50 last:border-0 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className={`luxury-label text-xs hover:text-gold transition-colors ${isActive('/contact') ? 'text-gold' : 'text-gray-600'}`}
            >
              Contacts
            </Link>

            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-500 hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-4 ml-auto">
            <button onClick={() => setSearchOpen(true)} className="text-gray-600 hover:text-gold" aria-label="Search">
              <Search size={18} />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-600 hover:text-gold" aria-label="Menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-down">
            <div className="px-6 py-4 flex flex-col gap-0">
              <Link href="/heritage" className="luxury-label text-xs text-gray-600 hover:text-gold py-3 border-b border-gray-50 block">Heritage</Link>

              <div>
                <button
                  onClick={() => setMobileJewelleryOpen(!mobileJewelleryOpen)}
                  className="luxury-label text-xs text-gray-600 hover:text-gold py-3 border-b border-gray-50 flex items-center justify-between w-full"
                >
                  Jewellery
                  <ChevronDown size={10} className={`transition-transform ${mobileJewelleryOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileJewelleryOpen && (
                  <div className="pl-4 bg-gray-50">
                    {jewelleryDropdown.map(item => (
                      <Link key={item.href} href={item.href} className="luxury-label text-xs text-gray-500 hover:text-gold py-2.5 border-b border-gray-100 block">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/watches" className="luxury-label text-xs text-gray-600 hover:text-gold py-3 border-b border-gray-50 block">Watches</Link>
              <Link href="/events" className="luxury-label text-xs text-gray-600 hover:text-gold py-3 border-b border-gray-50 block">Events</Link>
              <Link href="/media" className="luxury-label text-xs text-gray-600 hover:text-gold py-3 border-b border-gray-50 block">Media</Link>
              <Link href="/boutiques" className="luxury-label text-xs text-gray-600 hover:text-gold py-3 border-b border-gray-50 block">Boutiques</Link>
              <Link href="/contact" className="luxury-label text-xs text-gray-600 hover:text-gold py-3 block">Contacts</Link>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}