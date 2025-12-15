import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Tournament } from '@/models/tournament'

export async function GET(req: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    const tournamentId = Number(searchParams.get('tournamentId'))
    console.log('tournamentId: ', tournamentId)

    if (!tournamentId || isNaN(tournamentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tournamentId' },
        { status: 400 }
      )
    }
    console.log('Fetching tournament data...')
    const data = await Tournament.findOne({ _id: tournamentId })

    console.log('data: ', data)

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Tournament not found' },
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
