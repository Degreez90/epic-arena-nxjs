'use server'

import { currentUser } from '@/lib/auth'
import { getTournamentManager } from '@/data/Tournaments/tournaments'
import { Status } from 'brackets-model'
import { findParentMatch } from '@/lib/bracketHelpers'

export interface AdvanceWinnerResponse {
  success?: string
  error?: string
}

/**
 * Admin-only: manually advance the winner of a match to the next round.
 * Uses the brackets-manager library to determine the winner from scores,
 * mark the match as completed, and auto-advance the winner.
 *
 * For the final match (no parent round), declares the tournament champion.
 */
export async function advanceWinner(
  tournamentId: string,
  matchId: number,
): Promise<AdvanceWinnerResponse> {
  // 1. Admin check
  const user = await currentUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }
  if (user.role !== 'admin') {
    return { error: 'Only admins can advance winners' }
  }

  try {
    const manager = await getTournamentManager(tournamentId)

    // 2. Get the match
    const match = await manager.storage.select('match', matchId)
    if (!match) {
      return { error: 'Match not found' }
    }

    // 3. Validate scores are present
    const score1 = (match.opponent1 as any)?.score ?? -1
    const score2 = (match.opponent2 as any)?.score ?? -1

    if (score1 < 0 || score2 < 0) {
      return { error: 'Both scores must be set before advancing' }
    }
    if (score1 === score2) {
      return { error: 'Cannot determine a winner from a tie score' }
    }

    // 4. Check if this is the final match before updating
    const parentMatch = await findParentMatch(manager, match)

    // 5. Use the library to complete the match and auto-advance the winner.
    // Passing status: Status.Completed lets brackets-manager determine the
    // winner from scores and propagate them to the next round.
    await manager.update.match({
      id: match.id,
      status: Status.Completed,
      opponent1: { score: score1 },
      opponent2: { score: score2 },
    })

    if (!parentMatch) {
      // Final match — determine champion name
      const opp1Wins = score1 > score2
      const winnerName =
        (opp1Wins
          ? (match.opponent1 as any)?.name
          : (match.opponent2 as any)?.name) || 'Unknown'
      return { success: `Champion declared: ${winnerName}` }
    }

    return { success: 'Winner advanced to next round' }
  } catch (error) {
    console.error('Error advancing winner:', error)
    return { error: (error as Error).message }
  }
}
