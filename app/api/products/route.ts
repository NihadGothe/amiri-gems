import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function safeStringify(v: any): string | null {
  if (!v) return null
  if (typeof v === 'string') return v
  return JSON.stringify(v)
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type     = searchParams.get('type')
    const brandId  = searchParams.get('brandId')
    const featured = searchParams.get('featured')
    const deleted  = searchParams.get('deleted')
    const page     = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit    = Math.min(100, parseInt(searchParams.get('limit') || '15'))

    const where: any = { isDeleted: deleted === 'true' ? true : false }
    if (type)                where.type       = type
    if (brandId)             where.brandId    = brandId
    if (featured === 'true') where.isFeatured = true

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          brand:    { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])
    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit), limit })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { id, createdAt, updatedAt, brand, category, ...data } = body
    const product = await prisma.product.create({
      data: {
        ...data,
        categoryId:     data.categoryId && data.categoryId !== '' ? data.categoryId : null,
        sku:            data.sku && data.sku !== '' ? data.sku : null,
        images:         safeStringify(data.images),
        specifications: safeStringify(data.specifications),
        price:          data.price && data.price !== '' ? parseFloat(data.price) : null,
        salePrice:      data.salePrice && data.salePrice !== '' ? parseFloat(data.salePrice) : null,
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Product POST error:', error?.message)
    return NextResponse.json({ error: error?.message || 'Failed to create product' }, { status: 400 })
  }
}
