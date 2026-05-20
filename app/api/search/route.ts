// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const searchTerm = `%${q}%`

    const [brands, events, boutiques, products] = await Promise.all([
      prisma.brand.findMany({
        where: {
          status: true,
          OR: [
            { name: { contains: q } },
            { shortDescription: { contains: q } },
          ],
        },
        take: 5,
        select: { id: true, name: true, slug: true, type: true, logo: true },
      }),
      prisma.event.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q } },
            { location: { contains: q } },
            { shortDescription: { contains: q } },
          ],
        },
        take: 5,
        select: { id: true, title: true, slug: true, date: true, mainImage: true },
      }),
      prisma.boutique.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: q } },
            { city: { contains: q } },
            { address: { contains: q } },
          ],
        },
        take: 4,
        select: { id: true, name: true, slug: true, city: true, country: true },
      }),
      prisma.product.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: q } },
            { shortDescription: { contains: q } },
          ],
        },
        take: 6,
        include: { brand: { select: { name: true, slug: true } } },
      }),
    ])

    const results = [
      ...brands.map(b => ({
        type: b.type === 'JEWELLERY' ? 'Jewellery Brand' : 'Watch Brand',
        id: b.id,
        title: b.name,
        url: `/brands/${b.slug}`,
        image: b.logo,
      })),
      ...events.map(e => ({
        type: 'Event',
        id: e.id,
        title: e.title,
        url: `/events/${e.slug}`,
        image: e.mainImage,
        subtitle: new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      })),
      ...boutiques.map(b => ({
        type: 'Boutique',
        id: b.id,
        title: b.name,
        url: `/boutiques/${b.slug}`,
        subtitle: `${b.city}, ${b.country}`,
      })),
      ...products.map(p => ({
        type: p.type === 'JEWELLERY' ? 'Jewellery' : 'Watch',
        id: p.id,
        title: p.name,
        url: `/brands/${p.brand.slug}`,
        subtitle: p.brand.name,
      })),
    ]

    return NextResponse.json({ results, query: q })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
}
