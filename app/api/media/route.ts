import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const deleted  = searchParams.get('deleted')
    const type     = searchParams.get('type')
    const page     = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit    = Math.min(100, parseInt(searchParams.get('limit') || '12'))
    const paginate = searchParams.get('paginate') === 'true'
    const where: any = { isDeleted: deleted === 'true' ? true : false }
    if (type) where.type = type
    if (paginate) {
      const [total, media] = await Promise.all([
        prisma.media.count({ where }),
        prisma.media.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      ])
      return NextResponse.json({ media, total, page, pages: Math.ceil(total / limit), limit })
    }
    const media = await prisma.media.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(media)
  } catch { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { id, createdAt, updatedAt, ...data } = body
    const clean = {
      ...data,
      date:        data.date ? new Date(data.date).toISOString() : null,
      image:       data.image       || null,
      videoUrl:    data.videoUrl    || null,
      sourceUrl:   data.sourceUrl   || null,
      description: data.description || null,
    }
    const item = await prisma.media.create({ data: clean })
    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create' }, { status: 500 })
  }
}