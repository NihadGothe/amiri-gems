import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.event.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const data = sanitize(body)
    const item = await prisma.event.update({ where: { id: params.id }, data })
    return NextResponse.json(item)
  } catch (error: any) {
    console.error('Event PUT error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.event.update({ where: { id: params.id }, data: { isDeleted: true } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
