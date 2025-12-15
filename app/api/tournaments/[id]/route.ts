import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_req: Request, context: { params: { id: string } }) {
  try {
    const tournamentId = context.params.id

    const data = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    })

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
