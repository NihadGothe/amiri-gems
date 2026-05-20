import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const deleted  = searchParams.get('deleted')
    const page     = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit    = Math.min(100, parseInt(searchParams.get('limit') || '50'))
    const paginate = searchParams.get('paginate') === 'true'

    const where: any = { isDeleted: deleted === 'true' ? true : false }
    if (searchParams.get('status') === 'true') where.status = true
    if (searchParams.get('status') === 'false') where.status = false

    if (paginate) {
      const [total, categories] = await Promise.all([
        prisma.category.count({ where }),
        prisma.category.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }], skip: (page - 1) * limit, take: limit }),
      ])
      return NextResponse.json({ categories, total, page, pages: Math.ceil(total / limit), limit })
    }

    const categories = await prisma.category.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
    return NextResponse.json(categories)
  } catch { return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { id, createdAt, updatedAt, ...data } = body
    const category = await prisma.category.create({ data })
    return NextResponse.json(category, { status: 201 })
  } catch { return NextResponse.json({ error: 'Failed to create category' }, { status: 500 }) }
}