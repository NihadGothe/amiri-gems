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
    latitude:      rest.latitude  ? parseFloat(rest.latitude)  : null,
    longitude:     rest.longitude ? parseFloat(rest.longitude) : null,
    openingHours:  safeJson(rest.openingHours),
    brands:        safeJson(rest.brands),
    services:      safeJson(rest.services),
    galleryImages: Array.isArray(rest.galleryImages) ? JSON.stringify(rest.galleryImages) : rest.galleryImages || null,
    sortOrder:     typeof rest.sortOrder === 'number' ? rest.sortOrder : 0,
    email:         rest.email    || null,
    whatsapp:      rest.whatsapp || null,
    phone:         rest.phone    || null,
    city:          rest.city     || null,
    country:       rest.country  || null,
    address:       rest.address  || null,
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const deleted = searchParams.get('deleted')
    const where: any = { isDeleted: deleted === 'true' ? true : false }
    const boutiques = await prisma.boutique.findMany({ where, orderBy: { sortOrder: 'asc' } })
    return NextResponse.json(boutiques)
  } catch { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const boutique = await prisma.boutique.create({ data: cleanBoutique(body) })
    return NextResponse.json(boutique, { status: 201 })
  } catch (error: any) {
    console.error('Boutique POST:', error?.message)
    return NextResponse.json({ error: error?.message || 'Failed to create' }, { status: 500 })
  }
}