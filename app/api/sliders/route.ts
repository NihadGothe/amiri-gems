import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const placement  = searchParams.get('placement')
    const deleted    = searchParams.get('deleted')
    const adminMode  = searchParams.get('admin') === 'true'  // admin panel passes this
    const page       = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit      = Math.min(100, parseInt(searchParams.get('limit') || '50'))
    const paginate   = searchParams.get('paginate') === 'true' || searchParams.has('page')

    const where: any = { isDeleted: deleted === 'true' ? true : false }
    if (placement) where.placement = placement
    // Public requests (homepage) — only show active sliders
    if (!adminMode) where.isActive = true

    if (paginate) {
      const [total, sliders] = await Promise.all([
        prisma.slider.count({ where }),
        prisma.slider.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }], skip: (page - 1) * limit, take: limit }),
      ])
      return NextResponse.json({ sliders, total, page, pages: Math.ceil(total / limit), limit })
    }

    const sliders = await prisma.slider.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })
    return NextResponse.json(sliders)
  } catch { return NextResponse.json({ error: 'Failed to fetch sliders' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { id, createdAt, updatedAt, ...data } = body
    const slider = await prisma.slider.create({ data })
    return NextResponse.json(slider, { status: 201 })
  } catch { return NextResponse.json({ error: 'Failed to create slider' }, { status: 500 }) }
}
