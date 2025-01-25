import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Tournament } from '@/models/tournament'

export async function GET(req: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    const tournamentId = Number(searchParams.get('tournamentId'))
    console.log('tournamentId: ', tournamentId)

    if (!tournamentId) {
      return NextResponse.json(
        { success: false, error: 'tournamentId is required' },
        { status: 400 }
      )
    }

    const data = await Tournament.findOne({ _id: tournamentId })

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
