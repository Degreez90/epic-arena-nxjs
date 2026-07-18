'use server'

import { currentUser } from '@/lib/auth'
import {
  getTournamentById,
  getTournamentManager,
} from '@/data/Tournaments/tournaments'
import {
  autoResolveByeMatches,
  reportMatchGameScore,
} from '@/lib/bracketHelpers'

export interface ReportScoreRequest {
  tournamentId: string
  matchId: number
  opponent1Score?: number | null
  opponent2Score?: number | null
  status?: 'pending' | 'ongoing' | 'completed'
}

export interface ReportScoreResponse {
  success?: string
  error?: string
}

/**
 * Report a match score in a tournament
 */
export const reportScore = async (
  data: ReportScoreRequest,
): Promise<ReportScoreResponse> => {
  const user = await currentUser()

  if (!user) {
    return { error: 'User not found' }
  }

  try {
    // Verify tournament exists and user has permission
    const tournament = await getTournamentById(data.tournamentId)
    if (!tournament) {
      return { error: 'Tournament not found' }
    }

    if (tournament.createdBy !== user.id && user.role !== 'admin') {
      return { error: 'You do not have permission to update this tournament' }
    }

    // Get the match
    const manager = await getTournamentManager(data.tournamentId)
    const match = await manager.storage.select('match', data.matchId)

    if (!match) {
      return { error: 'Match not found' }
    }

    // Only update if both scores are provided
    if (data.opponent1Score == null || data.opponent2Score == null) {
      return { error: 'Both scores must be provided' }
    }

    // Tied scores are not allowed in elimination matches
    if (data.opponent1Score === data.opponent2Score) {
      return { error: 'Scores cannot be tied in an elimination match' }
    }

    // For best-of-N matches (child_count > 0), report each game individually
    // via match_games. The brackets-manager auto-aggregates child game
    // results and advances the winner when the series is decided.
    const isBoSeries = (match.child_count ?? 0) > 0

    if (isBoSeries) {
      // Best-of series: report the current game's score via match_game.
      // Uses direct storage updates (not manager.update.matchGame()) so
      // scores are recorded but the winner is NOT auto-advanced.
      // Advancement must be done separately by an admin.
      await reportMatchGameScore(
        data.tournamentId,
        manager,
        match,
        data.opponent1Score,
        data.opponent2Score,
      )
    } else {
      // Single match (Bo1): save scores via direct storage update.
      // This bypasses manager.update.match() which would auto-advance
      // the winner. Advancement must be done separately by an admin
      // via advanceWinner().
      await manager.storage.update('match', match.id, {
        opponent1: {
          ...match.opponent1,
          score: data.opponent1Score,
        },
        opponent2: {
          ...match.opponent2,
          score: data.opponent2Score,
        },
      } as any)
    }

    // Auto-resolve any remaining BYE vs BYE matches that may have been
    // unlocked upstream by this score report, ensuring bracket progression
    await autoResolveByeMatches(data.tournamentId)

    return { success: 'Match score updated successfully' }
  } catch (error) {
    console.error('Error reporting score:', error)
    return { error: (error as Error).message }
  }
}

export default reportScore
