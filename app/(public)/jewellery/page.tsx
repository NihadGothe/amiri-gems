// app/(public)/jewellery/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import JewelleryHeroSlider from '@/components/public/JewelleryHeroSlider'

export const metadata: Metadata = {
  title: 'Jewellery',
  description: 'Discover our exclusive collection of luxury jewellery at Amiri Gems.',
}

export default async function JewelleryPage() {
  const [brands, sliders, categories] = await Promise.all([
    prisma.brand.findMany({
      where: { type: 'JEWELLERY', status: true, isDeleted: false },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.slider.findMany({
      where: { placement: 'JEWELLERY', isActive: true, isDeleted: false },
      orderBy: { sortOrder: 'asc' },
    }),
    // Only fetch active, non-deleted categories — fully controlled from admin
    prisma.category.findMany({
      where: { status: true, isDeleted: false },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  return (
    <>
      {/* ── Hero Slider ───────────────────────────────────────────────────── */}
      {sliders.length > 0 ? (
        <JewelleryHeroSlider slides={sliders.map(s => ({
          id: s.id, image: s.image,
          title: s.title || undefined, subtitle: s.subtitle || undefined,
          ctaText: s.ctaText || undefined, ctaLink: s.ctaLink || undefined,
        }))} />
      ) : (
        <div className="relative w-full overflow-hidden" style={{ height: '55vh', minHeight: 360 }}>
          <img src="/images/jewellery/DSC_0520.jpg" alt="Jewellery" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="luxury-label text-xs text-gold mb-3 tracking-widest">Amiri Gems</p>
            <h1 className="font-serif text-white text-4xl md:text-6xl font-light tracking-widest uppercase">Jewellery</h1>
            <div className="w-12 h-px bg-gold mt-4" />
          </div>
        </div>
      )}

      {/* ── Categories Grid — fully from DB ───────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="luxury-label text-xs text-gold tracking-widest mb-2">Collections</p>
              <h2 className="font-serif text-gray-800 text-4xl font-light tracking-widest uppercase">Our Jewellery</h2>
              <div className="w-10 h-px bg-gold mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/jewellery/${cat.slug}`}
                  className="group relative overflow-hidden block bg-gray-100"
                  style={{ paddingTop: '85%' }}
                >
                  <img
                    src={cat.bannerImage || '/images/jewellery/adler-papagayo-9b.jpg'}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="w-6 h-px bg-gold mb-3" />
                    <h3 className="font-serif text-white text-xl font-light tracking-widest uppercase mb-3">
                      {cat.name}
                    </h3>
                    <span className="inline-flex items-center gap-2 text-xs font-sans text-white/70 tracking-widest uppercase group-hover:text-gold transition-colors">
                      Discover More
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Brands Grid ───────────────────────────────────────────────────── */}
      {brands.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="luxury-label text-xs text-gold tracking-widest mb-2">Exclusive Partners</p>
              <h2 className="font-serif text-gray-800 text-4xl font-light tracking-widest uppercase">Our Brands</h2>
              <div className="w-10 h-px bg-gold mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-gray-200">
              {brands.map(brand => (
                <Link key={brand.id} href={`/brands/${brand.slug}`}
                  className="group bg-white flex flex-col items-center justify-center p-6 min-h-[110px] hover:bg-cream transition-colors">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name}
                      className="max-h-12 max-w-[120px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                  ) : (
                    <span className="font-serif text-gray-600 group-hover:text-gold transition-colors text-center leading-tight"
                      style={{ fontSize: brand.name.length > 12 ? '10px' : '13px', wordBreak: 'break-word' }}>
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}