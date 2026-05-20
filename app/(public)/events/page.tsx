// app/(public)/events/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { MapPin, Calendar } from 'lucide-react'
import JewelleryHeroSlider from '@/components/public/JewelleryHeroSlider'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Discover upcoming and recent Amiri Gems events, exhibitions and exclusive showcases.',
}

export default async function EventsPage() {
  const [events, sliders] = await Promise.all([
    prisma.event.findMany({
      where: { isPublished: true, isDeleted: false },
      orderBy: { date: 'desc' },
    }),
    prisma.slider.findMany({
      where: { placement: 'EVENTS', isActive: true, isDeleted: false },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  return (
    <>
      {/* ── Hero Slider ─────────────────────────────────────────────────── */}
      {sliders.length > 0 ? (
        <JewelleryHeroSlider slides={sliders.map(s => ({
          id: s.id,
          image: s.image,
          title: s.title || undefined,
          subtitle: s.subtitle || undefined,
          ctaText: s.ctaText || undefined,
          ctaLink: s.ctaLink || undefined,
        }))} />
      ) : (
        <div className="relative w-full" style={{ height: '40vh', minHeight: 280 }}>
          <img src="/images/sliders/ssx-7507-jpg.jpg" alt="Events" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="luxury-label text-xs text-gold mb-3">Amiri Gems</p>
            <h1 className="font-serif text-white text-5xl md:text-7xl font-light tracking-widest uppercase">Events</h1>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <div key={event.id} className="group bg-white shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative overflow-hidden" style={{ height: 240 }}>
                  <img
                    src={event.mainImage || '/images/sliders/ssx-7507-jpg.jpg'}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                  {event.isFeatured && (
                    <div className="absolute top-3 left-3 bg-gold px-3 py-1">
                      <span className="text-white luxury-label text-xs">Featured</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5 text-gold">
                      <Calendar size={13} />
                      <span className="luxury-label text-xs">{formatDate(event.date)}</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-gray-800 text-xl font-light mb-2 leading-snug">
                    {event.title}
                  </h3>
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-gray-500 mb-3">
                      <MapPin size={12} />
                      <span className="text-xs font-sans">{event.location}</span>
                    </div>
                  )}
                  {event.shortDescription && (
                    <p className="text-xs text-gray-600 font-sans leading-relaxed mb-4 line-clamp-2">
                      {event.shortDescription}
                    </p>
                  )}
                  <Link
                    href={`/events/${event.slug}`}
                    className="luxury-label text-xs text-gold hover:text-gold-dark transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-serif text-gray-400 text-2xl font-light">No events scheduled</p>
            <p className="text-sm text-gray-400 font-sans mt-2">Check back soon for upcoming exhibitions and events.</p>
          </div>
        )}
      </section>
    </>
  )
}
