import { NextRequest, NextResponse } from 'next/server'
import { reportScore } from '@/actions/tournament/report-score'
import { getTournamentManager } from '@/data/Tournaments/tournaments'
import {
  autoResolveByeMatches,
  reportMatchGameScore,
} from '@/lib/bracketHelpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tournamentId,
      matchId,
      opponent1Score,
      opponent2Score,
      gameNumber,
    } = body

    if (!tournamentId || matchId === undefined) {
      return NextResponse.json(
        { error: 'Tournament ID and Match ID are required' },
        { status: 400 },
      )
    }

    // If a specific game number is provided, report just that game.
    // Uses direct storage updates (does NOT auto-advance the winner).
    if (gameNumber !== undefined) {
      const manager = await getTournamentManager(tournamentId)
      const match = await manager.storage.select('match', matchId)

      if (!match) {
        return NextResponse.json({ error: 'Match not found' }, { status: 404 })
      }

      try {
        await reportMatchGameScore(
          tournamentId,
          manager,
          match,
          opponent1Score,
          opponent2Score,
        )
      } catch (gameError) {
        console.error('Error updating match game:', gameError)
        return NextResponse.json(
          { error: (gameError as Error).message },
          { status: 400 },
        )
      }

      // Resolve any BYE matches that may have been unlocked
      await autoResolveByeMatches(tournamentId)

      return NextResponse.json({ success: 'Game score updated successfully' })
    }

    // Otherwise use the standard reportScore which auto-detects Bo1 vs Bo3
    const result = await reportScore({
      tournamentId,
      matchId,
      opponent1Score,
      opponent2Score,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: result.success })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
