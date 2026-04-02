import { Pool } from 'pg'
import { NextResponse } from 'next/server'

// Ensure your .env has DATABASE_URL set correctly
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false } // Required for AWS RDS connections
})

export async function GET() {
  try {
    // DIAGNOSTIC CHECK: This confirms exactly which DB and User RDS is seeing
    const diag = await pool.query('SELECT current_database(), current_user');
    console.log("--- RDS Connection Verified ---");
    console.log("Connected to DB Name:", diag.rows[0].current_database);
    console.log("Logged in as User:", diag.rows[0].current_user);
    console.log("-------------------------------");

    // Fetching the tickets for the UI & Ticket Tracking component 
    const result = await pool.query(
      'SELECT * FROM "Ticket" ORDER BY created_at DESC'
    );
    
    return NextResponse.json(result.rows)
  } catch (err: any) {
    console.error("Database Connection Error:", err.message)
    
    // Providing detailed error feedback helps identify if it's a 
    // Permission (P1010) or a Networking/Security Group issue.
    return NextResponse.json({ 
      error: 'Failed to fetch tickets', 
      details: err.message 
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { subject } = await req.json()
    
    // 'Open' is the default status as per the Project Proposal [cite: 18]
    const result = await pool.query(
      'INSERT INTO "Ticket" (subject, status) VALUES ($1, $2) RETURNING *',
      [subject || 'New Conversation', 'Open']
    )
    
    return NextResponse.json(result.rows[0])
  } catch (err: any) {
    console.error("Insert Error:", err.message)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}