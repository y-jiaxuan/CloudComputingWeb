import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const tickets = await prisma.ticket.findMany({
            orderBy: { created_at: 'desc' },
        })
        
        // Ensure the response is always an array to prevent frontend crashes
        return NextResponse.json(Array.isArray(tickets) ? tickets : [])
    } catch (err) {
        console.error('Prisma GET Error:', err)
        // Return an empty array as a fallback so .map() doesn't fail
        return NextResponse.json([]) 
    }
}

export async function POST(req: Request) {
    try {
        const { subject } = await req.json()
        const ticket = await prisma.ticket.create({
            data: { 
                subject: subject || 'New Conversation', 
                status: 'Open' 
            },
        })
        return NextResponse.json(ticket)
    } catch (err) {
        console.error('Prisma POST Error:', err)
        return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
    }
}