'use client'
// app/public/page.tsx — data-driven luxury homepage

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDateShort } from '@/lib/utils'

interface SliderItem {
  id: string
  title?: string
  subtitle?: string
  image: string
  ctaText?: string
  ctaLink?: string
  sortOrder: number
}

interface BrandItem {
  id: string
  name: string
  slug: string
  type: 'JEWELLERY' | 'WATCH'
  logo?: string
  shortDescription?: string
  heroImages?: string
}

interface CategoryItem {
  id: string
  name: string
  slug: string
  description?: string
  bannerImage?: string
}

interface ContentBlockItem {
  key: string
  title?: string
  content?: string
  image?: string
  metadata?: any
}

function parseImgs(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  try {
    const p = JSON.parse(v)
    return Array.isArray(p) ? p : []
  } catch {
    return []
  }
}

// Replace your HeroSliderLoading function with this:

function HeroSliderLoading() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '92vh', minHeight: 500, background: '#0f1d35' }}
    >
      {/* Radial gold glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(184,151,74,0.10) 0%, transparent 70%)'
      }} />

      {/* Corner brackets */}
      {[
        'top-5 left-5 border-t border-l',
        'top-5 right-5 border-t border-r',
        'bottom-5 left-5 border-b border-l',
        'bottom-5 right-5 border-b border-r',
      ].map((cls, i) => (
        <div key={i} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: 'rgba(184,151,74,0.25)' }} />
      ))}

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">

        {/* Rotating diamond */}
        <div className="relative flex items-center justify-center mb-6" style={{ width: 72, height: 72 }}>
          <div className="absolute inset-0 rounded-full animate-pulse" style={{ border: '1px solid rgba(184,151,74,0.35)' }} />
          <div className="absolute rounded-full animate-pulse" style={{ inset: 8, border: '0.5px solid rgba(184,151,74,0.2)', animationDelay: '0.4s' }} />
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none"
            className="animate-spin"
            style={{ animationDuration: '6s', animationTimingFunction: 'linear' }}>
            <polygon points="20,4 36,14 36,26 20,36 4,26 4,14" stroke="#b8974a" strokeWidth="1" fill="none" opacity="0.6" />
            <polygon points="20,4 36,14 20,20" fill="rgba(184,151,74,0.15)" />
            <polygon points="20,20 36,14 36,26" fill="rgba(184,151,74,0.08)" />
            <circle cx="20" cy="20" r="2" fill="#b8974a" opacity="0.9" />
          </svg>
        </div>

        <p className="luxury-label text-xs text-gold tracking-[0.4em] uppercase mb-3">
          Amiri Gems
        </p>

        <h1 className="font-serif text-white/90 text-4xl md:text-5xl font-light tracking-[0.22em] uppercase mb-2">
          The Collection
        </h1>

        <p className="font-serif text-white/40 text-lg font-light tracking-[0.3em] uppercase mb-7">
        Jewellery & Watches
        </p>

        {/* Gold divider */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="h-px w-16 animate-pulse" style={{ background: 'linear-gradient(to right, transparent, #b8974a, transparent)' }} />
          <div className="w-1 h-1 rounded-full opacity-80" style={{ background: '#b8974a' }} />
          <div className="h-px w-16 animate-pulse" style={{ background: 'linear-gradient(to right, #b8974a, transparent)', animationDelay: '0.3s' }} />
        </div>
      
        {/* Shimmer bars */}
        <div className="flex flex-col items-center gap-2.5">
          {[180, 120, 90].map((w, i) => (
            <div key={i} className="h-px rounded animate-pulse"
              style={{ width: w, background: 'linear-gradient(to right, transparent, rgba(184,151,74,0.4), transparent)', animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>

      {/* Bottom label */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 luxury-label text-xs text-white/20 tracking-[0.3em] uppercase">
        Doha · Qatar
      </p>
    </div>
  )
}

function HeroSlider({ slides, loading }: { slides: SliderItem[]; loading: boolean }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return

    const t = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, 5500)

    return () => clearInterval(t)
  }, [slides.length])

  if (loading) return <HeroSliderLoading />

  if (!slides.length) {
    return (
      <div className="relative w-full bg-navy" style={{ height: '60vh', minHeight: 400 }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="luxury-label text-xs text-gold tracking-[0.3em] uppercase mb-3">
            Amiri Gems
          </p>
          <h2 className="font-serif text-white/80 text-3xl font-light mb-4">
            No active sliders
          </h2>
          <p className="text-white/45 text-sm font-sans">
            Please configure homepage sliders from admin panel.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '92vh', minHeight: 500 }}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title || 'Amiri Gems Slider'}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

          <div className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-20">
            <div
              className={`transition-all duration-700 ${
                i === current ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              {slide.subtitle && (
                <p className="text-white/80 font-sans text-xs tracking-widest uppercase mb-3">
                  {slide.subtitle}
                </p>
              )}

              {slide.title && (
                <h1 className="font-serif text-white text-3xl md:text-5xl font-light italic mb-6 max-w-3xl">
                  {slide.title}
                </h1>
              )}

              {slide.ctaText && slide.ctaLink && (
                <Link href={slide.ctaLink} className="btn-luxury inline-block">
                  {slide.ctaText}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-0.5 transition-all ${
                  i === current ? 'bg-gold w-10' : 'bg-white/50 w-6'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrent(c => (c - 1 + slides.length) % slides.length)}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-20"
            aria-label="Previous slide"
          >
            ‹
          </button>

          <button
            onClick={() => setCurrent(c => (c + 1) % slides.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-20"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}

function JewelleryWatchesSection({
  jewelleryImage,
  watchesImage,
}: {
  jewelleryImage: string
  watchesImage: string
}) {
  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-serif text-gray-800 text-4xl md:text-5xl font-light tracking-[0.22em] uppercase leading-tight mb-4">
            The World of Amiri Gems <br className="hidden md:block" />
            Watches & Jewellery
          </p>

          <h2 className="luxury-label text-xs text-gold tracking-[0.3em] uppercase">
            Explore Our Curated Collections Of Watches And Jewellery
          </h2>

          <div className="w-12 h-px bg-gold mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/jewellery" className="group block">
            <div className="relative overflow-hidden" style={{ height: '55vh', minHeight: 380 }}>
              <img
                src={jewelleryImage}
                alt="Jewellery"
                className="w-full h-full object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500" />
            </div>

            <div className="pt-6 pb-2 text-center">
              <p className="luxury-label text-xs text-gold tracking-widest mb-2">Amiri Gems</p>
              <h3 className="font-serif text-gray-800 text-3xl font-light tracking-widest uppercase mb-3 group-hover:text-gold transition-colors">
                Jewellery
              </h3>
              <div className="w-8 h-px bg-gold mx-auto mb-4" />
              <p className="text-sm text-gray-500 font-sans leading-relaxed max-w-xs mx-auto mb-6">
                Discover our Exclusive Jewellery Collections.
              </p>
              <span className="btn-luxury inline-block">Explore</span>
            </div>
          </Link>

          <Link href="/watches" className="group block">
            <div className="relative overflow-hidden" style={{ height: '55vh', minHeight: 380 }}>
              <img
                src={watchesImage}
                alt="Watches"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500" />
            </div>

            <div className="pt-6 pb-2 text-center">
              <p className="luxury-label text-xs text-gold tracking-widest mb-2">Swiss Excellence</p>
              <h3 className="font-serif text-gray-800 text-3xl font-light tracking-widest uppercase mb-3 group-hover:text-gold transition-colors">
                Watches
              </h3>
              <div className="w-8 h-px bg-gold mx-auto mb-4" />
              <p className="text-sm text-gray-500 font-sans leading-relaxed max-w-xs mx-auto mb-6">
                Explore our Watch Collections.
              </p>
              <span className="btn-luxury inline-block">Explore</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

function BrandsGrid({ brands }: { brands: BrandItem[] }) {
  if (!brands.length) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="section-heading gold-underline pb-2">Our Brands</h2>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-gray-200">
          {brands.map(brand => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="bg-white flex items-center justify-center p-4 min-h-[90px] hover:bg-cream transition-colors"
            >
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="max-h-10 max-w-full object-contain" />
              ) : (
                <span
                  className="font-serif text-gray-700 text-center break-all leading-tight"
                  style={{ fontSize: '11px', letterSpacing: '0.04em' }}
                >
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function HeritagePreview({ heritageBlock }: { heritageBlock: ContentBlockItem | null }) {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="luxury-label text-xs text-gold mb-4">Since 1994</p>
          <h2 className="font-serif text-gray-800 text-4xl font-light leading-tight mb-6">
            The Home of Luxury<br />Diamonds and Watches
          </h2>
          <div className="w-12 h-px bg-gold mb-6" />
          <p className="text-sm text-gray-600 font-sans leading-loose mb-8">
            {heritageBlock?.content ||
              'In 1994, captivated by his passion for fine jewellery and timepieces, His Excellency Sheikh Nawaf Bin Nasser Al Thani founded Amiri Gems to cater to the needs of gemstone and jewellery enthusiasts in Qatar.'}
          </p>
          <Link href="/heritage" className="btn-luxury inline-block">
            Our Heritage
          </Link>
        </div>

        <div className="relative">
          <img
            src="/images/sliders/shutterstock-1172392699.jpg"
            alt="Amiri Gems Boutique"
            className="w-full object-cover shadow-xl"
            style={{ height: 480 }}
          />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-gold opacity-30" />
          <div className="absolute -top-4 -right-4 w-24 h-24 border border-gold opacity-30" />
        </div>
      </div>
    </section>
  )
}

function FounderSection({ founderBlock }: { founderBlock: ContentBlockItem | null }) {
  return (
    <section className="py-20 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <div className="relative">
          <img
            src={founderBlock?.image || '/images/founder/gope-shahani.jpg'}
            alt="Gope Shahani"
            className="w-full max-h-[560px] object-cover shadow-2xl"
          />
          <div className="absolute -bottom-4 -right-4 w-28 h-28 border border-gold/50" />
        </div>

        <div>
          <p className="luxury-label text-xs text-gold mb-4">Founder & Leadership</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">
            {founderBlock?.title || 'Gope Shahani'}
          </h2>
          <p className="luxury-label text-xs text-white/50 mb-4">CEO — Amiri Gems</p>
          <div className="w-12 h-px bg-gold mb-6" />
          <p className="text-white/75 font-sans text-sm leading-loose mb-8">
            {founderBlock?.content ||
              'A refined leadership presence behind Amiri Gems, guiding the brand with a deep appreciation for fine jewellery, rare timepieces, craftsmanship, and client experience in Qatar.'}
          </p>
          <Link href="/heritage" className="btn-luxury-outline inline-block">
            Discover Our Story
          </Link>
        </div>
      </div>
    </section>
  )
}

function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/products?featured=true&limit=4')
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .catch(() => setProducts([]))
  }, [])

  if (!products.length) return null

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="section-heading gold-underline pb-2">Featured</h2>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => {
            const img = parseImgs(p.images)[0]

            return (
              <Link key={p.id} href={`/products/${p.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden bg-white shadow-sm">
                  {img && (
                    <img
                      src={img}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gold tracking-widest uppercase font-sans">{p.brand?.name}</p>
                  <h3 className="font-serif text-base text-gray-800 mt-1 line-clamp-2">{p.name}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function EventsPreview() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/events?limit=3&published=true')
      .then(r => r.json())
      .then(d => setEvents(Array.isArray(d) ? d.slice(0, 3) : []))
      .catch(() => setEvents([]))
  }, [])

  if (!events.length) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <h2 className="section-heading gold-underline text-left pb-2">Events</h2>
          <Link href="/events" className="luxury-label text-xs text-gold hover:text-gold-dark transition-colors">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map(event => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group bg-cream overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={event.mainImage || '/images/sliders/ssx-7373-jpg.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <p className="luxury-label text-xs text-gold mb-2">{formatDateShort(event.date)}</p>
                <h3 className="font-serif text-gray-800 text-lg font-light mb-1">{event.title}</h3>
                {event.location && <p className="text-xs text-gray-500 font-sans mb-3">{event.location}</p>}
                <span className="luxury-label text-xs text-gold hover:text-gold-dark transition-colors">
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function BoutiquesPreview() {
  const [boutiques, setBoutiques] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/boutiques')
      .then(r => r.json())
      .then(d => setBoutiques(Array.isArray(d) ? d : []))
      .catch(() => setBoutiques([]))
  }, [])

  return (
    <section className="py-16 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="luxury-label text-xs text-gold mb-4">Qatar</p>
        <h2 className="font-serif text-white text-4xl font-light mb-3">Find our Boutique</h2>
        <div className="w-12 h-px bg-gold mx-auto mb-8" />

        {boutiques.length > 0 && (
          <p className="text-sm text-white/70 font-sans mb-6">
            Visit us at one of our {boutiques.length} exclusive boutique locations across Doha & Oman
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {boutiques.map(b => (
            <span
              key={b.id}
              className="px-4 py-1.5 border border-white/20 text-xs font-sans text-white/80 tracking-wider"
            >
              {b.name}
            </span>
          ))}
        </div>

        <Link href="/boutiques" className="btn-luxury-outline inline-block">
          Locate a Boutique
        </Link>
      </div>
    </section>
  )
}

export default function HomePage() {
  const [sliders, setSliders] = useState<SliderItem[]>([])
  const [sliderLoading, setSliderLoading] = useState(true)
  const [jewelleryBrands, setJewelleryBrands] = useState<BrandItem[]>([])
  const [watchBrands, setWatchBrands] = useState<BrandItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [heritageBlock, setHeritageBlock] = useState<ContentBlockItem | null>(null)
  const [founderBlock, setFounderBlock] = useState<ContentBlockItem | null>(null)
  const [jewelleryImage, setJewelleryImage] = useState('/images/jewellery/jewellery-1.png')
  const [watchesImage, setWatchesImage] = useState('/images/watches/watch-1.jpg')

  useEffect(() => {
    let mounted = true

    async function loadHomeData() {
      try {
        setSliderLoading(true)

        const [s, jb, wb, cat, blocks] = await Promise.all([
          fetch('/api/sliders?placement=HOME').then(r => (r.ok ? r.json() : [])),
          fetch('/api/brands?type=JEWELLERY&status=true').then(r => (r.ok ? r.json() : [])),
          fetch('/api/brands?type=WATCH&status=true').then(r => (r.ok ? r.json() : [])),
          fetch('/api/categories?status=true').then(r => (r.ok ? r.json() : [])),
          fetch('/api/content').then(r => (r.ok ? r.json() : [])),
        ])

        if (!mounted) return

        setSliders(Array.isArray(s) ? s : [])
        setJewelleryBrands(Array.isArray(jb) ? jb : [])
        setWatchBrands(Array.isArray(wb) ? wb : [])
        setCategories(Array.isArray(cat) ? cat : [])

        if (Array.isArray(blocks)) {
          setHeritageBlock(blocks.find((b: any) => b.key === 'heritage_intro') || null)
          setFounderBlock(blocks.find((b: any) => b.key === 'ceo_name') || null)

          const jwImg = blocks.find((b: any) => b.key === 'home_jewellery_image')
          const wtImg = blocks.find((b: any) => b.key === 'home_watches_image')

          if (jwImg?.image) setJewelleryImage(jwImg.image)
          if (wtImg?.image) setWatchesImage(wtImg.image)
        }
      } catch (error) {
        console.error('Home page loading error:', error)

        if (!mounted) return

        setSliders([])
        setJewelleryBrands([])
        setWatchBrands([])
        setCategories([])
      } finally {
        if (mounted) {
          setSliderLoading(false)
        }
      }
    }

    loadHomeData()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      <HeroSlider slides={sliders} loading={sliderLoading} />
      <JewelleryWatchesSection jewelleryImage={jewelleryImage} watchesImage={watchesImage} />
      <BrandsGrid brands={jewelleryBrands} />
      <FeaturedProducts />
      <HeritagePreview heritageBlock={heritageBlock} />
      <FounderSection founderBlock={founderBlock} />
      <EventsPreview />
      <BoutiquesPreview />
    </>
  )
}