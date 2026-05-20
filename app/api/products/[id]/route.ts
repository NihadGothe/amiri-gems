import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function safeStringify(v: any): string | null {
  if (!v) return null
  if (typeof v === 'string') return v
  return JSON.stringify(v)
}

function cleanData(data: any) {
  // Convert empty strings to null for optional fields
  return {
    ...data,
    categoryId:     data.categoryId     && data.categoryId !== ''     ? data.categoryId     : null,
    sku:            data.sku            && data.sku !== ''            ? data.sku            : null,
    price:          data.price          && data.price !== ''          ? parseFloat(data.price)     : null,
    salePrice:      data.salePrice      && data.salePrice !== ''      ? parseFloat(data.salePrice) : null,
    images:         safeStringify(data.images),
    specifications: safeStringify(data.specifications),
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
      include: {
        brand:    { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { id, createdAt, updatedAt, brand, category, ...data } = body

    // Partial update (toggle only)
    const allowedPartial = ['isPublished', 'isFeatured', 'isDeleted', 'stock']
    const isPartial = Object.keys(data).every(k => allowedPartial.includes(k))

    const updateData = isPartial ? data : cleanData(data)

    const product = await prisma.product.update({ where: { id: params.id }, data: updateData })
    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Product PUT error:', error?.message)
    return NextResponse.json({ error: error?.message || 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.product.update({ where: { id: params.id }, data: { isDeleted: true } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
