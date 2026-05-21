import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function safeJson(v: any): any {
  if (!v) return undefined
  if (typeof v === 'object') return v
  try { return JSON.parse(v) } catch { return undefined }
}

function cleanBoutique(data: any) {
  const { id, createdAt, updatedAt, ...rest } = data
  return {
    ...rest,
    latitude:     rest.latitude  ? parseFloat(rest.latitude)  : null,
    longitude:    rest.longitude ? parseFloat(rest.longitude) : null,
    openingHours: rest.openingHours ? (typeof rest.openingHours === 'string' ? rest.openingHours : JSON.stringify(rest.openingHours)) : null,
    brands:       safeJson(rest.brands),
    services:     safeJson(rest.services),
    galleryImages: Array.isArray(rest.galleryImages) ? JSON.stringify(rest.galleryImages) : rest.galleryImages || null,
    email:        rest.email    || null,
    whatsapp:     rest.whatsapp || null,
    phone:        rest.phone    || null,
    city:         rest.city     || null,
    country:      rest.country  || null,
    address:      rest.address  || null,
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.boutique.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] } })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }) }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const item = await prisma.boutique.update({ where: { id: params.id }, data: cleanBoutique(body) })
    return NextResponse.json(item)
  } catch (error: any) {
    console.error('Boutique PUT:', error?.message)
    return NextResponse.json({ error: error?.message || 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.boutique.update({ where: { id: params.id }, data: { isDeleted: true } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Failed to delete' }, { status: 500 }) }
}
