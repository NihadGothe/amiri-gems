import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BrandSchema } from '@/lib/validations'

function safeStringify(v: any): string | null {
  if (!v) return null
  if (typeof v === 'string') return v
  return JSON.stringify(v)
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const brand = await prisma.brand.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
      include: {
        products: { where: { isPublished: true, isDeleted: false }, orderBy: { createdAt: 'desc' }, take: 20 },
        _count: { select: { products: true } },
      },
    })
    if (!brand) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(brand)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { id, createdAt, updatedAt, _count, products, ...rest } = body

    const allowedPartial = ['status', 'isDeleted', 'sortOrder']
    const isPartial = Object.keys(rest).every(k => allowedPartial.includes(k))

    let updateData: any
    if (isPartial) {
      updateData = rest
    } else {
      try {
        const data = BrandSchema.parse(rest)
        updateData = {
          ...data,
          logo:          rest.logo          || null,
          heroImages:    safeStringify(rest.heroImages    || []),
          galleryImages: safeStringify(rest.galleryImages || []),
          seoTitle:      rest.seoTitle      || null,
          seoDescription: rest.seoDescription || null,
        }
      } catch (e: any) {
        return NextResponse.json({ error: e.errors || 'Validation failed' }, { status: 400 })
      }
    }

    const brand = await prisma.brand.update({ where: { id: params.id }, data: updateData })
    return NextResponse.json(brand)
  } catch (error: any) {
    console.error('Brand PUT error:', error?.message)
    return NextResponse.json({ error: error?.message || 'Failed to update brand' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.brand.update({ where: { id: params.id }, data: { isDeleted: true } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 })
  }
}
