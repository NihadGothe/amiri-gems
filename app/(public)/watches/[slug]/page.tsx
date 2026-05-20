'use client'
// app/public/watches/[slug]/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function WatchBrandPage() {
  const params = useParams()
  const slug = params.slug as string
  const [brand, setBrand] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch(`/api/brands/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setBrand(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  const watchHeroImages: Record<string, string[]> = {
    'h-moser-cie': [
      '/images/watches/hmoser-6500-1200-streamliner-small-seconds-st-aquablue-sdt-w.jpg',
      '/images/watches/hmoser-3804-1208-pioneer-tourbillon-arctic-blue-40mm-sdt-w.jpg',
    ],
    'hautlence': [
      '/images/watches/hautlence-ad50-st01-linear-series-2-detail-dial-pressa4.jpg',
      '/images/watches/hautlence-ab80-st00-sphere-series-1-detail-crown-b-pressa4.jpg',
    ],
  }

  const heroImages = (() => {
    if (!brand) return watchHeroImages[slug] || ['/images/watches/hmoser-6500-1200-streamliner-small-seconds-st-aquablue-sdt-w.jpg']
    const raw = brand.heroImages
    const stored: string[] = (() => {
      if (!raw) return []
      if (Array.isArray(raw)) return raw.filter(Boolean)
      try { const p = JSON.parse(raw); return Array.isArray(p) ? p.filter(Boolean) : [] } catch { return [] }
    })()
    return stored.length > 0 ? stored : (watchHeroImages[slug] || ['/images/watches/hmoser-6500-1200-streamliner-small-seconds-st-aquablue-sdt-w.jpg'])
  })()

  useEffect(() => {
    if (heroImages.length <= 1) return
    const t = setInterval(() => setCurrentSlide(c => (c + 1) % heroImages.length), 5000)
    return () => clearInterval(t)
  }, [heroImages.length])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <svg width="32" height="28" viewBox="0 0 80 70" fill="none">
            <polygon points="40,2 75,25 75,45 40,68 5,45 5,25" stroke="#B8974A" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
      </div>
    )
  }

  if (!brand) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="font-serif text-3xl text-gray-600 font-light">Brand Not Found</h1>
      <Link href="/watches" className="btn-luxury">Back to Watches</Link>
    </div>
  )

  const products = brand.products || []

  // Handle both string and already-parsed array from Prisma Json field
  const gallery: string[] = (() => {
    const raw = brand.galleryImages
    if (!raw) return []
    if (Array.isArray(raw)) return raw.filter(Boolean)
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p.filter(Boolean) : [] } catch { return [] }
  })()

  return (
    <>
      {/* Hero Slider */}
      <div className="relative w-full overflow-hidden bg-black" style={{ height: '90vh', minHeight: 500 }}>
        {heroImages.map((img: string, i: number) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={img} alt={brand.name} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          </div>
        ))}

        <div className="absolute bottom-16 left-10 md:left-16 max-w-sm">
          <h1 className="font-serif text-white text-4xl md:text-5xl font-light italic tracking-wide mb-2">
            {brand.name}
          </h1>
          {brand.shortDescription && (
            <p className="text-white/80 font-serif italic text-sm leading-relaxed mb-6">
              {brand.shortDescription}
            </p>
          )}
          <Link href="/contact" className="btn-luxury inline-block">Discover More</Link>
        </div>

        {heroImages.length > 1 && (
          <>
            <button onClick={() => setCurrentSlide(c => (c - 1 + heroImages.length) % heroImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors">‹</button>
            <button onClick={() => setCurrentSlide(c => (c + 1) % heroImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors">›</button>
          </>
        )}
      </div>

      {/* Full description */}
      {brand.fullDescription && (
        <section className="py-16 max-w-3xl mx-auto px-6 text-center">
          <div className="w-10 h-px bg-gold mx-auto mb-8" />
          <p className="text-sm text-gray-600 font-sans leading-loose">{brand.fullDescription}</p>
        </section>
      )}

      {/* Products / Collection */}
      {products.length > 0 && (
        <section className="py-16 bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-center font-serif text-white text-3xl font-light tracking-widest uppercase mb-10">
              Collection
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => {
                const imgs: string[] = (() => { try { return JSON.parse(product.images || '[]') } catch { return [] } })()
                const img = imgs[0] || '/images/watches/hmoser-6500-1200-streamliner-small-seconds-st-aquablue-sdt-w.jpg'
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                    <div className="relative overflow-hidden mb-4" style={{ paddingTop: '75%' }}>
                      <img src={img} alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                    <p className="text-white font-serif text-lg font-light">{product.name}</p>
                    {product.shortDescription && (
                      <p className="text-white/60 text-xs font-sans mt-1 line-clamp-2">{product.shortDescription}</p>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-6">
          <h2 className="section-heading gold-underline pb-2 text-center">Gallery</h2>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {gallery.map((img, i) => (
              <div key={i} className="relative overflow-hidden group" style={{ paddingTop: '100%' }}>
                <img
                  src={img}
                  alt={`${brand.name} gallery ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-navy text-white text-center">
        <div className="max-w-xl mx-auto px-6">
          <p className="luxury-label text-xs text-gold mb-4">Swiss Excellence</p>
          <h2 className="font-serif text-white text-3xl font-light mb-4">Experience {brand.name}</h2>
          <div className="w-10 h-px bg-gold mx-auto mb-6" />
          <p className="text-sm text-white/70 font-sans mb-8">Visit our boutiques to discover the complete {brand.name} collection.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/boutiques" className="btn-luxury-outline">Find our Boutique</Link>
            <Link href="/contact" className="btn-luxury">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
