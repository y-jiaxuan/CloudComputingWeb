import { Pool } from 'pg'
import { NextResponse } from 'next/server'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false }
})

export async function GET() {
  const result = await pool.query(
    'SELECT * FROM "Ticket" ORDER BY created_at DESC'
  )
  return NextResponse.json(result.rows)
}

export async function POST(req: Request) {
  const { subject } = await req.json()
  const result = await pool.query(
    'INSERT INTO "Ticket" (subject, status) VALUES ($1, $2) RETURNING *',
    [subject, 'Open']
  )
  return NextResponse.json(result.rows[0])
}