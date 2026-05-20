// app/(public)/jewellery/[category]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.category } })
  return {
    title: category ? `${category.name} — Amiri Gems` : 'Jewellery',
    description: category?.description || 'Explore our luxury jewellery collection at Amiri Gems.',
  }
}

function parseImgs(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v.filter(Boolean)
  try { const p = JSON.parse(v); return Array.isArray(p) ? p.filter(Boolean) : [] } catch { return [] }
}

export default async function JewelleryCategoryPage({ params }: { params: { category: string } }) {
  const [category, allCategories] = await Promise.all([
    prisma.category.findFirst({
      where: { slug: params.category, isDeleted: false },
    }),
    prisma.category.findMany({
      where: { status: true, isDeleted: false },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
  ])

  if (!category) notFound()

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isPublished: true, isDeleted: false },
    include: { brand: { select: { name: true, slug: true } } },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  })

  // Hero image — from DB bannerImage or guaranteed fallback
  const fallbackImages: Record<string, string> = {
    'high-jewellery': '/images/jewellery/DSC_0520.jpg',
    'bridal':         '/images/jewellery/adler-papagayo-9b.jpg',
    'rings':          '/images/jewellery/ring-1.png',
    'earrings':       '/images/jewellery/131327-pearl-earrings.jpg',
    'bracelets':      '/images/jewellery/adler-15june2023-73084.jpg',
    'pendants':       '/images/jewellery/137345-shinsei-earrings.jpg',
  }
  const heroImg = category.bannerImage || fallbackImages[params.category] || '/images/jewellery/DSC_0520.jpg'

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: '50vh', minHeight: 320 }}>
        <img
          src={heroImg}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.40) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="luxury-label text-xs text-gold mb-3 tracking-widest" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' }}>Amiri Gems</p>
          <h1 className="font-serif text-white text-5xl md:text-6xl font-light tracking-widest uppercase">
            {category.name}
          </h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>
      </div>

      {/* ── Category Nav Pills ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-[72px] z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {allCategories.map(cat => (
              <Link
                key={cat.id}
                href={`/jewellery/${cat.slug}`}
                className={`flex-shrink-0 px-5 py-4 text-xs font-sans tracking-widest uppercase transition-colors border-b-2 ${
                  cat.slug === params.category
                    ? 'border-gold text-gold font-medium'
                    : 'border-transparent text-gray-500 hover:text-gold hover:border-gold/40'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="text-xs font-sans text-gray-400">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/jewellery" className="hover:text-gold transition-colors">Jewellery</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{category.name}</span>
        </nav>
      </div>

      {/* ── Description ───────────────────────────────────────────────────── */}
      {category.description && (
        <div className="max-w-2xl mx-auto px-6 pt-2 pb-10 text-center">
          <p className="text-sm text-gray-500 font-sans leading-loose">{category.description}</p>
        </div>
      )}

      {/* ── Products Grid ─────────────────────────────────────────────────── */}
      <section className="pb-20 max-w-7xl mx-auto px-6">
        {products.length > 0 ? (
          <>
            <p className="text-xs text-gray-400 font-sans mb-6">{products.length} piece{products.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => {
                const imgs = parseImgs(product.images)
                const img = imgs[0] || '/images/jewellery/adler-papagayo-9b.jpg'
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                    <div className="relative overflow-hidden bg-gray-50 mb-4" style={{ paddingTop: '100%' }}>
                      <img src={img} alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {product.isFeatured && (
                        <div className="absolute top-3 left-3 bg-gold text-white text-xs px-2 py-0.5 font-sans">
                          Featured
                        </div>
                      )}
                    </div>
                    <p className="luxury-label text-xs text-gold mb-1">{product.brand.name}</p>
                    <h3 className="font-serif text-gray-800 text-base font-light leading-snug">{product.name}</h3>
                    {product.price && (
                      <p className="text-sm text-gray-500 font-sans mt-1">
                        QAR {Number(product.price).toLocaleString()}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <div className="w-12 h-px bg-gold mx-auto mb-8" />
            <p className="font-serif text-gray-400 text-3xl font-light mb-3">Collection Coming Soon</p>
            <p className="text-sm text-gray-400 font-sans mb-8">
              Explore our {category.name} pieces at any of our boutique locations in Doha.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/boutiques" className="btn-luxury inline-block">Find a Boutique</Link>
              <Link href="/contact" className="btn-luxury-outline inline-block">Contact Us</Link>
            </div>
          </div>
        )}
      </section>
    </>
  )
}