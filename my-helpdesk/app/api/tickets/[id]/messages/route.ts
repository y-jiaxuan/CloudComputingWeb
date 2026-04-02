import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const messages = await prisma.message.findMany({
    where: { ticket_id: Number(params.id) },
    orderBy: { created_at: 'asc' },
  })
  return NextResponse.json(messages)
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { role, content } = await req.json()
  const message = await prisma.message.create({
    data: {
      ticket_id: Number(params.id),
      role,
      content,
    },
  })
  return NextResponse.json(message)
}