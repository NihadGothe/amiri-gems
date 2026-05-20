// app/(public)/watches/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import JewelleryHeroSlider from '@/components/public/JewelleryHeroSlider'

export const metadata: Metadata = {
  title: 'Watches',
  description: 'Discover our exclusive selection of prestigious Swiss timepieces at Amiri Gems.',
}

function parseImgs(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v.filter(Boolean)
  try { const p = JSON.parse(v); return Array.isArray(p) ? p.filter(Boolean) : [] } catch { return [] }
}

const watchFallbacks: Record<string, string> = {
  'h-moser-cie': '/images/watches/hmoser-6500-1200-streamliner-small-seconds-st-aquablue-sdt-w.jpg',
  'hautlence':   '/images/watches/hautlence-ad50-st01-linear-series-2-detail-dial-pressa4.jpg',
}
const defaultWatch = '/images/watches/hmoser-6500-1200-streamliner-small-seconds-st-aquablue-sdt-w.jpg'

export default async function WatchesPage() {
  const [brands, sliders] = await Promise.all([
    prisma.brand.findMany({
      where: { type: 'WATCH', status: true, isDeleted: false },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.slider.findMany({
      where: { placement: 'WATCHES', isActive: true, isDeleted: false },
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
        <div className="relative w-full overflow-hidden" style={{ height: '60vh', minHeight: 380 }}>
          <img src={defaultWatch} alt="Watches" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="luxury-label text-xs text-gold mb-3 tracking-widest">Swiss Excellence</p>
            <h1 className="font-serif text-white text-4xl md:text-6xl font-light tracking-widest uppercase">Watches</h1>
            <div className="w-12 h-px bg-gold mt-4" />
          </div>
        </div>
      )}

      {/* ── Brand Cards Grid — same style as jewellery categories ─────────── */}
      {brands.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="luxury-label text-xs text-gold tracking-widest mb-2">Swiss Excellence</p>
              <h2 className="font-serif text-gray-800 text-4xl font-light tracking-widest uppercase">Our Watches</h2>
              <div className="w-10 h-px bg-gold mx-auto mt-4" />
            </div>

            {/* Brand image cards — same 3-col grid as jewellery */}
            <div className={`grid gap-4 ${brands.length === 1 ? 'grid-cols-1 max-w-lg mx-auto' : brands.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {brands.map(brand => {
                const heroImgs = parseImgs(brand.heroImages)
                const cardImg = heroImgs[0] || watchFallbacks[brand.slug] || defaultWatch
                return (
                  <Link
                    key={brand.id}
                    href={`/watches/${brand.slug}`}
                    className="group relative overflow-hidden block bg-gray-100"
                    style={{ paddingTop: '85%' }}
                  >
                    <img
                      src={cardImg}
                      alt={brand.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {brand.logo && (
                        <img src={brand.logo} alt={brand.name}
                          className="h-8 object-contain mb-3"
                          style={{ filter: 'brightness(10)' }} />
                      )}
                      <div className="w-6 h-px bg-gold mb-3" />
                      <h3 className="font-serif text-white text-xl font-light tracking-widest uppercase mb-3">
                        {brand.name}
                      </h3>
                      <span className="inline-flex items-center gap-2 text-xs font-sans text-white/70 tracking-widest uppercase group-hover:text-gold transition-colors">
                        Discover More
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── More Brands Coming Soon ───────────────────────────────────────── */}
      <section className="py-20 bg-navy text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="luxury-label text-xs text-gold tracking-widest mb-4">Expanding Collection</p>
          <h2 className="font-serif text-white text-3xl font-light tracking-widest uppercase mb-4">
            More Brands Coming Soon
          </h2>
          <div className="w-10 h-px bg-gold mx-auto mb-6" />
          <p className="text-white/60 font-sans text-sm leading-loose mb-10">
            We are continually expanding our selection of the world's finest Swiss timepieces. Visit our boutiques in Doha and Oman to discover our complete collection.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/boutiques" className="btn-luxury inline-block">Find our Boutique</Link>
            <Link href="/contact" className="btn-luxury-outline inline-block">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}