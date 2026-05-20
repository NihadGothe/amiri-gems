// app/public/events/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { formatDate } from '@/lib/utils'
import { MapPin, Calendar, ArrowLeft } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } })
  return {
    title: event?.title || 'Event',
    description: event?.shortDescription || '',
  }
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } })
  if (!event || !event.isPublished) notFound()

  const gallery: string[] = (() => { try { return JSON.parse(event.galleryImages as string || '[]') } catch { return [] } })()

  const related = await prisma.event.findMany({
    where: { isPublished: true, isDeleted: false, NOT: { id: event.id } },
    orderBy: { date: 'desc' },
    take: 3,
  })

  return (
    <>
      {/* Hero */}
      <div className="relative w-full" style={{ height: '55vh', minHeight: 380 }}>
        <img
          src={event.mainImage || '/images/sliders/ssx-7507-jpg.jpg'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {/* Stronger gradient overlay for readability */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.25) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-end justify-end text-center pb-12 px-6">
          <div className="w-full max-w-3xl mx-auto">
            <p className="luxury-label text-xs text-gold mb-3 tracking-widest">{formatDate(event.date)}</p>
            <h1 className="font-serif text-white text-4xl md:text-6xl font-light leading-tight mb-4 drop-shadow-lg">
              {event.title}
            </h1>
            {event.location && (
              <div className="flex items-center justify-center gap-1.5 text-white/80 mt-2">
                <MapPin size={13} />
                <span className="text-sm font-sans">{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <Link href="/events" className="flex items-center gap-2 text-xs font-sans text-gray-500 hover:text-gold transition-colors">
          <ArrowLeft size={12} />
          Back to Events
        </Link>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            {event.fullDescription ? (
              <div className="text-sm text-gray-700 font-sans leading-loose whitespace-pre-line">
                {event.fullDescription}
              </div>
            ) : event.shortDescription ? (
              <p className="text-sm text-gray-700 font-sans leading-loose">{event.shortDescription}</p>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-gray-100 p-6">
              <h3 className="luxury-label text-xs text-gray-500 mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar size={14} className="text-gold mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-sans text-gray-700">{formatDate(event.date)}</span>
                </div>
                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin size={14} className="text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-sans text-gray-700">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
            <Link href="/contact" className="btn-luxury block text-center">
              Enquire Now
            </Link>
          </div>
        </div>
      </article>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-16 bg-cream max-w-7xl mx-auto px-6">
          <h2 className="section-heading gold-underline pb-2">Gallery</h2>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {gallery.map((img, i) => (
              <div key={i} className="overflow-hidden" style={{ paddingTop: '75%', position: 'relative' }}>
                <img src={img} alt={`Event gallery ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Events */}
      {related.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-6">
          <h2 className="section-heading gold-underline pb-2">Other Events</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map(ev => (
              <Link key={ev.id} href={`/events/${ev.slug}`} className="group">
                <div className="overflow-hidden mb-3" style={{ height: 180 }}>
                  <img
                    src={ev.mainImage || '/images/sliders/ssx-7507-jpg.jpg'}
                    alt={ev.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="luxury-label text-xs text-gold mb-1">{formatDate(ev.date)}</p>
                <h3 className="font-serif text-gray-800 text-base font-light group-hover:text-gold transition-colors">
                  {ev.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}