// app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const blocks = await prisma.contentBlock.findMany({ orderBy: { key: 'asc' } })
    return NextResponse.json(blocks)
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const block = await prisma.contentBlock.create({
      data: {
        key: body.key,
        title: body.title,
        content: body.content,
        image: body.image,
        metadata: body.metadata ? JSON.stringify(body.metadata) : undefined,
      },
    })
    return NextResponse.json(block, { status: 201 })
  } catch { return NextResponse.json({ error: 'Failed to create' }, { status: 500 }) }
}
