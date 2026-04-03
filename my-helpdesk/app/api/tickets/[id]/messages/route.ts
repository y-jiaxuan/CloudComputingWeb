import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params

  const messages = await prisma.message.findMany({
    where: { ticket_id: Number(id) },
    orderBy: { created_at: 'asc' },
  })
  return NextResponse.json(messages)
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const { role, content } = await req.json()
  const message = await prisma.message.create({
    data: {
      ticket_id: Number(id),
      role,
      content,
    },
  })
  return NextResponse.json(message)
}
