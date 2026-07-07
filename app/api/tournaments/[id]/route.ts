import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { deleteTournament } from '@/data/Tournaments/tournaments'

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: tournamentId } = await context.params

    const data = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    })

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Tournament not found' },
        { status: 404 },
      )
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id },
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 },
      )
    }

    if (tournament.createdBy !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await deleteTournament(id)

    return NextResponse.json({ message: 'Tournament deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete tournament' },
      { status: 500 },
    )
  }
}
