import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const tickets = await prisma.ticket.findMany({
            orderBy: { created_at: 'desc' },
        })
        return NextResponse.json(tickets)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { subject } = await req.json()
        const ticket = await prisma.ticket.create({
            data: { subject: subject || 'New Conversation', status: 'Open' },
        })
        return NextResponse.json(ticket)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
    }
}