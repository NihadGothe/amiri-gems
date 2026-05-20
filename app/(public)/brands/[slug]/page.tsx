'use client'
// app/public/brands/[slug]/page.tsx - Client component for slider
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'

interface Brand {
  id: string
  name: string
  slug: string
  type: string
  shortDescription?: string
  fullDescription?: string
  logo?: string
  heroImages: string
  galleryImages: string
  products: Product[]
}

interface Product {
  id: string
  name: string
  slug: string
  images: string
  shortDescription?: string
  brand: { name: string; slug: string }
}

const brandHeroImages: Record<string, string[]> = {
  'adler': [
    '/images/jewellery/adler-papagayo-9b.jpg',
    '/images/sliders/shutterstock-1172392699.jpg',
  ],
  'amrapali': [
    '/images/jewellery/adler-15june2023-73084.jpg',
    '/images/jewellery/131327-pearl-earrings.jpg',
  ],
  'chatila': [
    '/images/jewellery/137345-shinsei-earrings.jpg',
    '/images/products/10a.jpg',
  ],
  'h-moser-cie': [
    '/images/watches/hmoser-6500-1200-streamliner-small-seconds-st-aquablue-sdt-w.jpg',
    '/images/watches/hautlence-ad50-st01-linear-series-2-detail-dial-pressa4.jpg',
  ],
  'hautlence': [
    '/images/watches/hautlence-ad50-st01-linear-series-2-detail-dial-pressa4.jpg',
    '/images/watches/hmoser-6500-1200-streamliner-small-seconds-st-aquablue-sdt-w.jpg',
  ],
  'default': [
    '/images/jewellery/adler-papagayo-9b.jpg',
  ],
}

export default function BrandPage() {
  const params = useParams()
  const slug = params.slug as string
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch(`/api/brands/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setBrand(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  // Determine hero slides
  const getHeroImages = (): string[] => {
    if (!brand) return brandHeroImages.default
    const stored: string[] = parseJsonArr(brand.heroImages)
    if (stored.length > 0) return stored
    return brandHeroImages[slug] || brandHeroImages.default
  }

  const heroImages = getHeroImages()

  useEffect(() => {
    if (heroImages.length <= 1) return
    const t = setInterval(() => setCurrentSlide(c => (c + 1) % heroImages.length), 5000)
    return () => clearInterval(t)
  }, [heroImages.length])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg width="32" height="28" viewBox="0 0 80 70" fill="none" className="animate-pulse">
            <polygon points="40,2 75,25 75,45 40,68 5,45 5,25" stroke="#B8974A" strokeWidth="1.5" fill="none"/>
          </svg>
          <p className="luxury-label text-xs text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="font-serif text-3xl text-gray-600 font-light">Brand Not Found</h1>
        <Link href="/jewellery" className="btn-luxury">Back to Jewellery</Link>
      </div>
    )
  }

  function parseJsonArr(v: any): string[] {
    if (!v) return []
    if (Array.isArray(v)) return v.filter(Boolean)
    try { const p = JSON.parse(v); return Array.isArray(p) ? p.filter(Boolean) : [] } catch { return [] }
  }

  const gallery: string[] = parseJsonArr(brand.galleryImages)

  return (
    <>
      {/* Full-width Hero Slider — matches PDF design exactly */}
      <div className="relative w-full overflow-hidden" style={{ height: '90vh', minHeight: 500 }}>
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={img} alt={brand.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          </div>
        ))}

        {/* Brand name overlay — bottom left, matching PDF */}
        <div className="absolute bottom-16 left-10 md:left-16 max-w-sm">
          <h1 className="font-serif text-white text-4xl md:text-5xl font-light tracking-wide mb-3">
            {brand.name}
          </h1>
          {brand.shortDescription && (
            <p className="text-white/85 font-serif italic text-sm leading-relaxed mb-6">
              {brand.shortDescription}
            </p>
          )}
          <Link
            href="/contact"
            className="btn-luxury inline-block"
          >
            SHOP NOW
          </Link>
        </div>

        {/* Slider controls */}
        {heroImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide(c => (c - 1 + heroImages.length) % heroImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentSlide(c => (c + 1) % heroImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-colors"
            >
              ›
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`rounded-full transition-all ${i === currentSlide ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Full description */}
      {brand.fullDescription && brand.fullDescription !== brand.shortDescription && (
        <section className="py-16 max-w-3xl mx-auto px-6 text-center">
          <div className="w-10 h-px bg-gold mx-auto mb-8" />
          <p className="text-sm text-gray-600 font-sans leading-loose">{brand.fullDescription}</p>
        </section>
      )}

      {/* Products */}
      {/* {brand.products && brand.products.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="section-heading gold-underline pb-2">Collection</h2>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {brand.products.map(product => {
                const imgs: string[] = (() => { try { return JSON.parse(product.images || '[]') } catch { return [] } })()
                const img = imgs[0] || '/images/jewellery/adler-papagayo-9b.jpg'
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group block bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative overflow-hidden" style={{ paddingTop: '100%' }}>
                      <img
                        src={img}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-gray-800 text-base font-light">{product.name}</h3>
                      {product.shortDescription && (
                        <p className="text-xs text-gray-500 font-sans mt-1 line-clamp-2">{product.shortDescription}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )} */}

      {/* Gallery */}
      {/* {gallery.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-6">
          <h2 className="section-heading gold-underline pb-2">Gallery</h2>
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
      )} */}

      {/* CTA */}
      <section className="py-20 bg-navy text-white text-center">
        <div className="max-w-xl mx-auto px-6">
          <p className="luxury-label text-xs text-gold mb-4">Amiri Gems</p>
          <h2 className="font-serif text-white text-3xl font-light mb-4">
            Discover {brand.name} in Boutique
          </h2>
          <div className="w-10 h-px bg-gold mx-auto mb-6" />
          <p className="text-sm text-white/70 font-sans mb-8">
            Visit one of our exclusive boutiques in Doha to explore the full collection.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/boutiques" className="btn-luxury-outline inline-block">Find our Boutique</Link>
            <Link href="/contact" className="btn-luxury inline-block">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
