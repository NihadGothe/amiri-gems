'use client'
// components/public/Footer.tsx
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MapPin, Phone, Printer, Mail } from 'lucide-react'
import { formatDateShort } from '@/lib/utils'
import Image from "next/image";
interface Event {
  id: string
  title: string
  slug: string
  date: string
  mainImage?: string
}

export default function Footer() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetch('/api/events?featured=true&limit=2')
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data.slice(0, 2) : []))
      .catch(() => {})
  }, [])

  return (
    <footer className="ag-footer">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Recent Events */}
          <div>
            <h3 className="text-xs font-sans font-semibold tracking-widest uppercase text-white/90 mb-6">
              Events
            </h3>
            <div className="flex flex-col gap-4">
              {events.length > 0 ? events.map(event => (
                <Link key={event.id} href={`/events/${event.slug}`} className="flex items-center gap-3 group">
                  {event.mainImage ? (
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={event.mainImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded bg-white/10 flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-white/60">AG</span>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-white group-hover:text-gold-light transition-colors font-sans font-medium">
                      {event.title}
                    </p>
                    <p className="text-xs text-white/60 mt-0.5">
                      {formatDateShort(event.date)}
                    </p>
                  </div>
                </Link>
              )) : (
                <>
                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-white/10" />
                    <div>
                      <p className="text-xs text-white font-sans">Qatar National Day</p>
                      <p className="text-xs text-white/60">December 18, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-white/10" />
                    <div>
                      <p className="text-xs text-white font-sans">Doha Jewellery & Watches Exhibition</p>
                      <p className="text-xs text-white/60">05 Feb 2024</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xs font-sans font-semibold tracking-widest uppercase text-white/90 mb-6">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <MapPin size={13} className="text-gold-light flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/80 font-sans leading-relaxed">
                  Barwa Al Sadd<br />
                  Suhaim Bin Hamad Street<br />
                  P.O. Box 376, Doha - Qatar
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={13} className="text-gold-light flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/80 font-sans">+974 4452 0000</p>
                  <p className="text-xs text-white/80 font-sans">+974 4452 0014</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Printer size={13} className="text-gold-light flex-shrink-0" />
                <p className="text-xs text-white/80 font-sans">+974 4444 3607</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={13} className="text-gold-light flex-shrink-0" />
                <a href="mailto:info@amirigems.net" className="text-xs text-white/80 font-sans hover:text-gold-light transition-colors">
                  info@amirigems.net
                </a>
              </div>
            </div>
          </div>

          {/* Logo + Tagline */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              {/* Amiri Gems Icon */}
            <Image
              src="/images/home/amiri-gems-icon.png"
              alt="Amiri Gems Icon"
              width={78}
              height={78}
              className="object-contain opacity-95 brightness-110"
            />
            </div>
            <p className="text-xs text-white/75 font-sans leading-loose max-w-xs">
              Amiri Gems jewellery is crafted to meet uncompromising quality standards and is composed of the finest quality, rigorously-sourced materials. With exceptional expertise and extraordinary attention to detail, the artisans at Amiri Gems Jewellery produce delectable jewellery pieces, cherished by the buyers and lovingly passed from generation to generation.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50 font-sans">
            © {new Date().getFullYear()} Amiri Gems. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/heritage" className="text-xs text-white/50 hover:text-white/80 font-sans transition-colors">Heritage</Link>
            <Link href="/jewellery" className="text-xs text-white/50 hover:text-white/80 font-sans transition-colors">Jewellery</Link>
            <Link href="/watches" className="text-xs text-white/50 hover:text-white/80 font-sans transition-colors">Watches</Link>
            <Link href="/contact" className="text-xs text-white/50 hover:text-white/80 font-sans transition-colors">Contact</Link>
            <Link href="/boutiques" className="text-xs text-white/50 hover:text-white/80 font-sans transition-colors">Boutiques</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
