import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const where: any = {}
    if (status) where.status = status
    const messages = await prisma.contactMessage.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(messages)
  } catch { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }
    const contact = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
      },
    })
    return NextResponse.json({ success: true, id: contact.id }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
