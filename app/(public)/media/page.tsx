// app/(public)/media/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import JewelleryHeroSlider from '@/components/public/JewelleryHeroSlider'

export const metadata: Metadata = {
  title: 'Media',
  description: 'News, magazines, exhibitions and media coverage of Amiri Gems.',
}

export default async function MediaPage() {
  const [news, magazines, exhibitions, tvCommercials, sliders] = await Promise.all([
    prisma.media.findMany({ where: { isPublished: true, isDeleted: false, type: 'NEWS' }, orderBy: { date: 'desc' }, take: 6 }),
    prisma.media.findMany({ where: { isPublished: true, isDeleted: false, type: 'MAGAZINE' }, orderBy: { date: 'desc' }, take: 6 }),
    prisma.media.findMany({ where: { isPublished: true, isDeleted: false, type: 'EXHIBITION' }, orderBy: { date: 'desc' }, take: 6 }),
    prisma.media.findMany({ where: { isPublished: true, isDeleted: false, type: 'TV_COMMERCIAL' }, orderBy: { date: 'desc' }, take: 4 }),
    prisma.slider.findMany({ where: { placement: 'MEDIA' as any, isActive: true, isDeleted: false }, orderBy: { sortOrder: 'asc' } }),
  ])

  const MediaCard = ({ item }: { item: any }) => {
    const cardContent = (
      <div className={`group bg-white border border-gray-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col ${item.sourceUrl ? 'cursor-pointer' : ''}`}>
        {item.videoUrl ? (
          <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={item.videoUrl.replace('watch?v=', 'embed/')}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative overflow-hidden" style={{ height: 220 }}>
            <img
              src={item.image || '/images/jewellery/adler-papagayo-9b.jpg'}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {item.type === 'MAGAZINE' && (
              <div className="absolute top-3 left-3 px-2 py-0.5 text-xs font-sans tracking-widest uppercase" style={{ backgroundColor: 'rgba(184,151,74,0.9)', color: '#fff' }}>
                Magazine
              </div>
            )}
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          {item.date && <p className="luxury-label text-xs text-gold mb-2">{formatDate(item.date)}</p>}
          <h3 className="font-serif text-gray-800 text-base font-light leading-snug flex-1">{item.title}</h3>
          {item.description && <p className="text-xs text-gray-500 font-sans mt-2 line-clamp-2">{item.description}</p>}
          {item.sourceUrl && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <span className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-gold hover:text-gold-dark transition-colors">
                Read Feature →
              </span>
            </div>
          )}
        </div>
      </div>
    )

    if (item.sourceUrl) {
      return (
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
          {cardContent}
        </a>
      )
    }
    return <div className="h-full">{cardContent}</div>
  }

  const Section = ({ id, title, items }: { id: string; title: string; items: any[] }) => {
    if (items.length === 0) return null
    return (
      <section id={id} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-heading gold-underline pb-2">{title}</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => <MediaCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* ── Hero Slider ─────────────────────────────────────────────────── */}
      {sliders.length > 0 ? (
        <JewelleryHeroSlider slides={sliders.map(s => ({
          id: s.id, image: s.image,
          title: s.title || undefined, subtitle: s.subtitle || undefined,
          ctaText: s.ctaText || undefined, ctaLink: s.ctaLink || undefined,
        }))} />
      ) : (
        <div className="relative w-full" style={{ height: '35vh', minHeight: 240 }}>
          <img src="/images/sliders/mg-0288.jpg" alt="Media" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="font-serif text-white text-5xl md:text-7xl font-light tracking-widest uppercase">Media</h1>
          </div>
        </div>
      )}

      {/* Nav tabs */}
      <div className="sticky top-16 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-6 overflow-x-auto">
          {[
            { id: 'news', label: 'News' },
            { id: 'magazines', label: 'Magazines' },
            { id: 'exhibitions', label: 'Exhibitions' },
            { id: 'tv-commercial', label: 'TV Commercial' },
          ].map(tab => (
            <a key={tab.id} href={`#${tab.id}`}
              className="flex-shrink-0 py-4 luxury-label text-xs text-gray-600 hover:text-gold border-b-2 border-transparent hover:border-gold transition-all">
              {tab.label}
            </a>
          ))}
        </div>
      </div>

      <Section id="news" title="News" items={news} />
      <Section id="magazines" title="Magazines" items={magazines} />
      <Section id="exhibitions" title="Exhibitions" items={exhibitions} />
      <Section id="tv-commercial" title="TV Commercials" items={tvCommercials} />

      {news.length === 0 && magazines.length === 0 && exhibitions.length === 0 && tvCommercials.length === 0 && (
        <div className="py-32 text-center">
          <p className="font-serif text-gray-400 text-2xl font-light">Media content coming soon</p>
        </div>
      )}
    </>
  )
}