import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.contentBlock.findFirst({ where: { OR: [{ id: params.id }, { key: params.id }] } })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }) }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { id, createdAt, updatedAt, key, ...data } = body
    const clean = {
      ...data,
      image:   data.image   || null,
      title:   data.title   || null,
      content: data.content || null,
    }
    const item = await prisma.contentBlock.update({ where: { id: params.id }, data: clean })
    return NextResponse.json(item)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update' }, { status: 500 })
  }
}
