import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userQuery } = await request.json()

    if (!userQuery || userQuery.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Search for user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { userName: { contains: userQuery, mode: 'insensitive' } },
          { email: { contains: userQuery, mode: 'insensitive' } },
        ],
      },
    })

    if (!user) {
      return NextResponse.json({ tournaments: [] })
    }

    // Get tournaments created by the user
    const createdTournaments = await prisma.tournament.findMany({
      where: { createdBy: user.id },
      include: {
        game: true,
        user: {
          select: { id: true, userName: true, email: true },
        },
      },
    })

    // Get all tournaments the user is participating in
    const participantTournaments: any[] = []
    // TODO: Add tournament participant queries after migration

    // Combine and deduplicate
    const allTournaments = [
      ...createdTournaments,
      ...participantTournaments
        .map((pt: any) => pt.tournament)
        .filter((t: any) => !createdTournaments.some((ct) => ct.id === t.id)),
    ]

    return NextResponse.json({
      user: { id: user.id, userName: user.userName, email: user.email },
      tournaments: allTournaments,
      totalCount: allTournaments.length,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
