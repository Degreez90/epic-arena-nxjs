import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Tournament } from '@/models/tournament'
import { getAllTournaments } from '@/data/Tournaments/tournaments'

export async function GET() {
  try {
    await connectDB()

    const tournaments = await getAllTournaments()

    if (!tournaments) {
      return NextResponse.json(
        { success: false, error: 'Error Fetching Tournaments' },
        { status: 400 }
      )
    }

    const data = await Tournament.find({})

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Tournaments not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
