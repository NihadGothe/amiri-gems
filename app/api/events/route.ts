import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function sanitize(body: any) {
  const { id, createdAt, updatedAt, ...data } = body
  // Convert date string to ISO DateTime
  if (data.date && typeof data.date === 'string') {
    data.date = new Date(data.date).toISOString()
  }
  // Stringify galleryImages if it's an array
  if (Array.isArray(data.galleryImages)) {
    data.galleryImages = JSON.stringify(data.galleryImages)
  }
  return data
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const deleted  = searchParams.get('deleted')
    const page     = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit    = Math.min(100, parseInt(searchParams.get('limit') || '10'))
    const paginate = searchParams.get('paginate') === 'true'

    const where: any = { isDeleted: deleted === 'true' ? true : false }
    if (searchParams.get('published') === 'true') where.isPublished = true

    if (paginate) {
      const [total, events] = await Promise.all([
        prisma.event.count({ where }),
        prisma.event.findMany({ where, orderBy: { date: 'desc' }, skip: (page - 1) * limit, take: limit }),
      ])
      return NextResponse.json({ events, total, page, pages: Math.ceil(total / limit), limit })
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'desc' },
      take: parseInt(searchParams.get('limit') || '50'),
    })
    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const data = sanitize(body)
    const event = await prisma.event.create({ data })
    return NextResponse.json(event, { status: 201 })
  } catch (error: any) {
    console.error('Event POST error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create event' }, { status: 500 })
  }
}