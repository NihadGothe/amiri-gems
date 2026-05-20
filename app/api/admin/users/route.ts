// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    const hashed = await bcrypt.hash(body.password, 12)
    const user = await prisma.user.create({
      data: { name: body.name, email: body.email, password: hashed, role: body.role, isActive: body.isActive },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    })
    return NextResponse.json(user, { status: 201 })
  } catch { return NextResponse.json({ error: 'Failed to create user' }, { status: 500 }) }
}
