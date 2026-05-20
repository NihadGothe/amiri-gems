import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { parseJsonField } from '@/lib/utils'

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { brand: true, category: true },
  })

  if (!product || !product.isPublished) notFound()

  const images = parseJsonField<string[]>(product.images, [])
  const mainImage = images[0] || '/images/sliders/ssx-7373-jpg.jpg'
  const backHref = product.type === 'WATCH' ? `/watches/${product.brand.slug}` : `/jewellery/${product.category?.slug || 'high-jewellery'}`

  return (
    <main className="bg-white">
      <section className="grid min-h-[80vh] grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[420px] bg-black">
          <img src={mainImage} alt={product.name} className="absolute inset-0 h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="flex items-center px-6 py-16 lg:px-16">
          <div className="max-w-xl">
            <p className="luxury-label mb-4 text-xs text-gold">{product.brand.name}</p>
            <h1 className="font-serif text-4xl font-light text-gray-900 md:text-5xl">{product.name}</h1>
            <div className="my-6 h-px w-14 bg-gold" />
            {product.shortDescription && <p className="font-sans text-sm leading-loose text-gray-600">{product.shortDescription}</p>}
            {product.fullDescription && product.fullDescription !== product.shortDescription && (
              <p className="mt-4 font-sans text-sm leading-loose text-gray-600">{product.fullDescription}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-luxury">Enquire Now</Link>
              <Link href={backHref} className="btn-luxury-outline !text-gray-800">Back to Collection</Link>
            </div>
          </div>
        </div>
      </section>

      {images.length > 1 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="section-heading gold-underline pb-2">Gallery</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {images.map((image) => (
              <img key={image} src={image} alt={product.name} className="aspect-square w-full object-cover" />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
