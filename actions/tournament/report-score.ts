'use server'

import { currentUser } from '@/lib/auth'
import {
  getTournamentById,
  getTournamentManager,
  updateTournamentMatch,
} from '@/data/Tournaments/tournaments'
import { ParticipantResult } from 'brackets-model'

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
  data: ReportScoreRequest
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

    // Build the updated match data
    const updatedMatch = {
      ...match,
      status: data.status || 'completed',
      opponent1: {
        ...match.opponent1,
        score: data.opponent1Score ?? match.opponent1?.score,
      } as ParticipantResult,
      opponent2: {
        ...match.opponent2,
        score: data.opponent2Score ?? match.opponent2?.score,
      } as ParticipantResult,
    }

    // Update the match
    const success = await updateTournamentMatch(
      data.tournamentId,
      data.matchId,
      updatedMatch
    )

    if (!success) {
      return { error: 'Failed to update match score' }
    }

    return { success: 'Match score updated successfully' }
  } catch (error) {
    console.error('Error reporting score:', error)
    return { error: (error as Error).message }
  }
}

export default reportScore
