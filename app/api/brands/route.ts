import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BrandSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type     = searchParams.get('type')
    const status   = searchParams.get('status')
    const deleted  = searchParams.get('deleted')
    const page     = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit    = Math.min(100, parseInt(searchParams.get('limit') || '50'))
    const paginate = searchParams.get('paginate') === 'true'

    const where: any = { isDeleted: deleted === 'true' ? true : false }
    if (type) where.type = type
    if (status !== null && status !== '') where.status = status === 'true'

    if (paginate) {
      const [total, brands] = await Promise.all([
        prisma.brand.count({ where }),
        prisma.brand.findMany({
          where,
          include: { _count: { select: { products: true } } },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          skip: (page - 1) * limit,
          take: limit,
        }),
      ])
      return NextResponse.json({ brands, total, page, pages: Math.ceil(total / limit), limit })
    }

    const brands = await prisma.brand.findMany({
      where,
      include: { _count: { select: { products: true } } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })
    return NextResponse.json(brands)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { id, createdAt, updatedAt, ...rest } = body
    const data = BrandSchema.parse(rest)
    const brand = await prisma.brand.create({
      data: {
        ...data,
        heroImages:    JSON.stringify(body.heroImages    || []),
        galleryImages: JSON.stringify(body.galleryImages || []),
      },
    })
    return NextResponse.json(brand, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.errors || 'Failed to create brand' }, { status: 400 })
  }
}
