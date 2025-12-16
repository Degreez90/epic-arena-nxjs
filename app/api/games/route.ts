import { NextResponse, NextRequest } from 'next/server'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const createdBy = searchParams.get('createdBy')

    const where = createdBy ? { createdBy } : {}

    const games = await prisma.game.findMany({
      where,
      include: {
        user: { select: { id: true, userName: true } },
        tournaments: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: games })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, genre, rules, images } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Game name is required' },
        { status: 400 }
      )
    }

    const game = await prisma.game.create({
      data: {
        name,
        description,
        genre,
        rules,
        images: images || [],
        createdBy: user.id,
      },
    })

    return NextResponse.json({ success: true, data: game })
  } catch (error) {
    console.error('Create game error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
