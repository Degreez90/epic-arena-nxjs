import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const gameId = searchParams.get('gameId')
    const userId = searchParams.get('userId')

    const where: any = {}

    if (status) where.status = status
    if (type) where.type = type
    if (gameId) where.gameId = gameId
    if (userId) where.createdBy = userId

    const data = await prisma.tournament.findMany({
      where,
      include: {
        game: true,
        user: {
          select: { id: true, userName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
