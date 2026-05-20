'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Navigation, Search } from 'lucide-react'

interface Boutique {
  id: string; name: string; slug: string; city?: string; country?: string
  address?: string; phone?: string; email?: string; whatsapp?: string
  openingHours?: any; latitude?: number; longitude?: number; galleryImages?: any
}

function parseHours(raw?: any): Record<string, string> {
  if (!raw) return {}
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw
  try { return JSON.parse(raw) } catch { return {} }
}

function firstGalleryImage(raw?: any): string {
  if (!raw) return ''
  const arr = Array.isArray(raw) ? raw : (() => { try { return JSON.parse(raw) } catch { return [] } })()
  return arr[0] || ''
}

function BoutiqueCard({ boutique, index }: { boutique: Boutique; index: number }) {
  const hours = parseHours(boutique.openingHours)
  const coverImage = firstGalleryImage(boutique.galleryImages)
  const hoursEntries = Object.entries(hours)

  return (
    <div className="group bg-white border border-gray-100 hover:border-gold/30 transition-all duration-300 hover:shadow-xl overflow-hidden flex flex-col w-full">
      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 200 }}>
        {coverImage ? (
          <img src={coverImage} alt={boutique.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy via-navy/90 to-black flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-px bg-gold mx-auto mb-3" />
              <p className="font-serif text-white/60 text-xs tracking-widest uppercase">Amiri Gems</p>
              <div className="w-12 h-px bg-gold mx-auto mt-3" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
          <MapPin size={12} className="text-gold" />
          <span className="text-white text-xs font-sans tracking-wider">{boutique.city || 'Doha'}, {boutique.country || 'Qatar'}</span>
        </div>
        <div className="absolute top-4 right-4 w-8 h-8 bg-gold/90 flex items-center justify-center">
          <span className="text-white text-xs font-sans font-semibold">{String(index + 1).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-gray-800 text-xl font-light mb-1 group-hover:text-gold transition-colors">{boutique.name}</h3>
        <div className="w-8 h-px bg-gold mb-4" />

        {/* Info — flex-1 so all cards stretch same height */}
        <div className="space-y-2.5 flex-1">
          {boutique.address && (
            <div className="flex items-start gap-2.5">
              <MapPin size={13} className="text-gold mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600 font-sans leading-relaxed line-clamp-2">{boutique.address}</p>
            </div>
          )}
          {boutique.phone && (
            <div className="flex items-center gap-2.5">
              <Phone size={13} className="text-gold shrink-0" />
              <a href={`tel:${boutique.phone.replace(/\s/g, '')}`} className="text-xs text-gray-600 font-sans hover:text-gold transition-colors">{boutique.phone}</a>
            </div>
          )}
          {boutique.email && (
            <div className="flex items-center gap-2.5">
              <Mail size={13} className="text-gold shrink-0" />
              <a href={`mailto:${boutique.email}`} className="text-xs text-gray-600 font-sans hover:text-gold transition-colors truncate">{boutique.email}</a>
            </div>
          )}
          {hoursEntries.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Clock size={13} className="text-gold mt-0.5 shrink-0" />
              <div>
                {hoursEntries.slice(0, 2).map(([day, time]) => (
                  <p key={day} className="text-xs text-gray-500 font-sans leading-relaxed">
                    <span className="text-gray-700">{day}:</span> {String(time)}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions — always pinned to bottom, always same line */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-4">
          <Link
            href={`/boutiques/${boutique.slug}`}
            className="flex-1 text-center text-xs font-sans tracking-widest uppercase py-2.5 border border-gold text-gold hover:bg-gold hover:text-white transition-all duration-200 flex items-center justify-center whitespace-nowrap"
          >
            View Details
          </Link>
          <a
            href={boutique.latitude && boutique.longitude
              ? `https://maps.google.com/?q=${boutique.latitude},${boutique.longitude}`
              : `https://maps.google.com/?q=${encodeURIComponent(boutique.name + ' ' + (boutique.address || 'Doha Qatar'))}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-sans tracking-widest uppercase py-2.5 border border-gray-200 text-gray-600 hover:border-gold hover:text-gold transition-all duration-200 whitespace-nowrap"
          >
            <Navigation size={11} /> Directions
          </a>
        </div>
      </div>
    </div>
  )
}

export default function BoutiquesPage() {
  const [boutiques, setBoutiques] = useState<Boutique[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/boutiques')
      .then(r => r.json())
      .then(data => { setBoutiques(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = boutiques.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.city?.toLowerCase().includes(search.toLowerCase()) ||
    b.address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Hero */}
      <div className="relative w-full" style={{ height: '40vh', minHeight: 280 }}>
        <img src="/images/sliders/shutterstock-1172392699.jpg" alt="Our Boutiques" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="luxury-label text-xs text-gold mb-3">Doha, Qatar</p>
          <h1 className="font-serif text-white text-5xl md:text-7xl font-light tracking-widest uppercase mb-3">Our Boutiques</h1>
          <div className="w-12 h-px bg-gold" />
        </div>
      </div>

      {/* Intro */}
      <div className="bg-navy py-10 text-center">
        <p className="text-white/70 font-sans text-sm max-w-xl mx-auto leading-loose px-6">
          Visit us at one of our exclusive boutique locations across Doha — each offering a curated selection of the world's finest jewellery and Swiss timepieces.
        </p>
      </div>

      {/* Search */}
      <div className="bg-cream py-8">
        <div className="max-w-md mx-auto px-6">
          <div className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Search boutiques..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-white text-sm font-sans outline-none focus:border-gold transition-colors" />
          </div>
        </div>
      </div>

      {/* Grid — items-stretch ensures equal height cards */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20"><p className="font-serif text-gray-400 text-xl font-light">No boutiques found</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ alignItems: 'stretch' }}>
              {filtered.map((boutique, i) => (
                <div key={boutique.id} className="flex">
                  <BoutiqueCard boutique={boutique} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to add images note — admin tip section */}
      <section className="py-16 bg-navy text-white text-center">
        <div className="max-w-xl mx-auto px-6">
          <p className="luxury-label text-xs text-gold mb-4">Get In Touch</p>
          <h2 className="font-serif text-3xl font-light mb-3">Plan Your Visit</h2>
          <div className="w-10 h-px bg-gold mx-auto mb-6" />
          <p className="text-sm text-white/70 font-sans leading-loose mb-8">
            Our team of experts is ready to assist you in finding the perfect piece. Book a private appointment or simply walk in.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-luxury">Contact Us</Link>
            <a href="https://wa.me/97444520000" target="_blank" rel="noopener noreferrer" className="btn-luxury-outline inline-flex items-center gap-2">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </>
  )
}
