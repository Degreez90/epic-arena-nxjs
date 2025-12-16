/**
 * Bracket Management Helpers
 * Provides utility functions for managing tournament brackets using brackets-manager
 */

import { getTournamentManager } from '@/data/Tournaments/tournaments'
import { BracketsManager } from 'brackets-manager'
import {
  Participant,
  Stage,
  Group,
  Round,
  Match,
  MatchGame,
  Status,
} from 'brackets-model'

/**
 * Get complete bracket structure for a tournament
 */
export async function getBracketStructure(tournamentId: string) {
  try {
    const manager = await getTournamentManager(tournamentId)

    const stages = await manager.storage.select('stage')
    const groups = await manager.storage.select('group')
    const rounds = await manager.storage.select('round')
    const matches = await manager.storage.select('match')
    const matchGames = await manager.storage.select('match_game')
    const participants = await manager.storage.select('participant')

    return {
      stages: stages || [],
      groups: groups || [],
      rounds: rounds || [],
      matches: matches || [],
      matchGames: matchGames || [],
      participants: participants || [],
    }
  } catch (error) {
    console.error('Error getting bracket structure:', error)
    throw error
  }
}

/**
 * Get a specific stage with all its bracket data
 */
export async function getStageWithBracket(
  tournamentId: string,
  stageId: number
) {
  try {
    const manager = await getTournamentManager(tournamentId)

    const stage = await manager.storage.select('stage', stageId)
    const groups = await manager.storage.select('group', { stage_id: stageId })
    const rounds = await manager.storage.select('round', { stage_id: stageId })
    const matches = await manager.storage.select('match', { stage_id: stageId })
    const matchGames = await manager.storage.select('match_game', {
      stage_id: stageId,
    })

    if (!stage) {
      throw new Error('Stage not found')
    }

    return {
      stage,
      groups: groups || [],
      rounds: rounds || [],
      matches: matches || [],
      matchGames: matchGames || [],
    }
  } catch (error) {
    console.error('Error getting stage bracket:', error)
    throw error
  }
}

/**
 * Get all groups for a stage
 */
export async function getGroupsInStage(tournamentId: string, stageId: number) {
  try {
    const manager = await getTournamentManager(tournamentId)
    const groups = await manager.storage.select('group', { stage_id: stageId })
    return groups || []
  } catch (error) {
    console.error('Error getting groups:', error)
    throw error
  }
}

/**
 * Get all rounds in a group
 */
export async function getRoundsInGroup(
  tournamentId: string,
  groupId: number
): Promise<Round[]> {
  try {
    const manager = await getTournamentManager(tournamentId)
    const rounds = await manager.storage.select('round', { group_id: groupId })
    return rounds || []
  } catch (error) {
    console.error('Error getting rounds:', error)
    throw error
  }
}

/**
 * Get all matches in a round
 */
export async function getMatchesInRound(
  tournamentId: string,
  roundId: number
): Promise<Match[]> {
  try {
    const manager = await getTournamentManager(tournamentId)
    const matches = await manager.storage.select('match', { round_id: roundId })
    return matches || []
  } catch (error) {
    console.error('Error getting matches:', error)
    throw error
  }
}

/**
 * Get all matches in a group
 */
export async function getMatchesInGroup(
  tournamentId: string,
  groupId: number
): Promise<Match[]> {
  try {
    const manager = await getTournamentManager(tournamentId)
    const matches = await manager.storage.select('match', { group_id: groupId })
    return matches || []
  } catch (error) {
    console.error('Error getting matches in group:', error)
    throw error
  }
}

/**
 * Get all match games for a match
 */
export async function getMatchGames(
  tournamentId: string,
  matchId: number
): Promise<MatchGame[]> {
  try {
    const manager = await getTournamentManager(tournamentId)
    const matchGames = await manager.storage.select('match_game', {
      parent_id: matchId,
    })
    return matchGames || []
  } catch (error) {
    console.error('Error getting match games:', error)
    throw error
  }
}

/**
 * Get match details with all related data
 */
export async function getMatchDetails(tournamentId: string, matchId: number) {
  try {
    const manager = await getTournamentManager(tournamentId)

    const match = await manager.storage.select('match', matchId)
    if (!match) {
      throw new Error('Match not found')
    }

    const matchGames = await manager.storage.select('match_game', {
      parent_id: matchId,
    })
    const round = await manager.storage.select('round', match.round_id)
    const group = await manager.storage.select('group', match.group_id)

    return {
      match,
      matchGames: matchGames || [],
      round,
      group,
    }
  } catch (error) {
    console.error('Error getting match details:', error)
    throw error
  }
}

/**
 * Get tournament standings/rankings
 */
export async function getTournamentStandings(tournamentId: string) {
  try {
    const manager = await getTournamentManager(tournamentId)

    const participants = await manager.storage.select('participant')
    const matches = await manager.storage.select('match')

    if (!participants || !matches) {
      return []
    }

    // Calculate statistics for each participant
    const standings = participants.map((participant) => {
      const participantMatches = matches.filter(
        (match: Match) =>
          match.opponent1?.id === participant.id ||
          match.opponent2?.id === participant.id
      )

      const wins = participantMatches.filter((match: Match) => {
        if (match.opponent1?.id === participant.id) {
          return (
            match.status === ('completed' as any) &&
            (match.opponent1?.score ?? 0) > (match.opponent2?.score ?? 0)
          )
        }
        return (
          match.status === ('completed' as any) &&
          (match.opponent2?.score ?? 0) > (match.opponent1?.score ?? 0)
        )
      }).length

      const losses = participantMatches.filter((match: Match) => {
        if (match.opponent1?.id === participant.id) {
          return (
            match.status === ('completed' as any) &&
            (match.opponent1?.score ?? 0) < (match.opponent2?.score ?? 0)
          )
        }
        return (
          match.status === ('completed' as any) &&
          (match.opponent2?.score ?? 0) < (match.opponent1?.score ?? 0)
        )
      }).length

      const draws = participantMatches.filter((match: Match) => {
        return (
          match.status === ('completed' as any) &&
          match.opponent1?.score === match.opponent2?.score
        )
      }).length

      const pointsFor = participantMatches.reduce(
        (sum: number, match: Match) => {
          if (match.opponent1?.id === participant.id) {
            return sum + (match.opponent1?.score ?? 0)
          }
          return sum + (match.opponent2?.score ?? 0)
        },
        0
      )

      const pointsAgainst = participantMatches.reduce(
        (sum: number, match: Match) => {
          if (match.opponent1?.id === participant.id) {
            return sum + (match.opponent2?.score ?? 0)
          }
          return sum + (match.opponent1?.score ?? 0)
        },
        0
      )

      return {
        id: participant.id,
        name: participant.name,
        played: participantMatches.length,
        wins,
        losses,
        draws,
        pointsFor,
        pointsAgainst,
        pointDifference: pointsFor - pointsAgainst,
      }
    })

    // Sort by wins, then point difference
    return standings.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.pointDifference - a.pointDifference
    })
  } catch (error) {
    console.error('Error getting standings:', error)
    throw error
  }
}

/**
 * Get next matches for a participant
 */
export async function getParticipantNextMatches(
  tournamentId: string,
  participantId: number,
  limit: number = 5
) {
  try {
    const manager = await getTournamentManager(tournamentId)

    const matches = await manager.storage.select('match')
    if (!matches) return []

    const upcomingMatches = matches
      .filter(
        (match: Match) =>
          (match.opponent1?.id === participantId ||
            match.opponent2?.id === participantId) &&
          match.status !== ('completed' as any)
      )
      .slice(0, limit)

    return upcomingMatches
  } catch (error) {
    console.error('Error getting participant matches:', error)
    throw error
  }
}

/**
 * Get participant match history
 */
export async function getParticipantMatchHistory(
  tournamentId: string,
  participantId: number
) {
  try {
    const manager = await getTournamentManager(tournamentId)

    const matches = await manager.storage.select('match')
    if (!matches) return []

    return matches
      .filter(
        (match: Match) =>
          (match.opponent1?.id === participantId ||
            match.opponent2?.id === participantId) &&
          match.status === ('completed' as any)
      )
      .map((match: Match) => {
        const isOpponent1 = match.opponent1?.id === participantId
        return {
          matchId: match.id,
          opponent: isOpponent1 ? match.opponent2 : match.opponent1,
          score: isOpponent1
            ? `${match.opponent1?.score} - ${match.opponent2?.score}`
            : `${match.opponent2?.score} - ${match.opponent1?.score}`,
          result: isOpponent1
            ? (match.opponent1?.score ?? 0) > (match.opponent2?.score ?? 0)
              ? 'win'
              : 'loss'
            : (match.opponent2?.score ?? 0) > (match.opponent1?.score ?? 0)
            ? 'win'
            : 'loss',
        }
      })
  } catch (error) {
    console.error('Error getting match history:', error)
    throw error
  }
}

/**
 * Get tournament statistics
 */
export async function getTournamentStats(tournamentId: string) {
  try {
    const manager = await getTournamentManager(tournamentId)

    const stages = await manager.storage.select('stage')
    const matches = await manager.storage.select('match')
    const participants = await manager.storage.select('participant')

    const completedMatches =
      matches?.filter((m: Match) => m.status === ('completed' as any)).length ??
      0
    const pendingMatches =
      matches?.filter((m: Match) => m.status === ('pending' as any)).length ?? 0
    const totalMatches = matches?.length ?? 0

    return {
      totalStages: stages?.length ?? 0,
      totalParticipants: participants?.length ?? 0,
      totalMatches,
      completedMatches,
      pendingMatches,
      completionPercentage:
        totalMatches > 0
          ? Math.round((completedMatches / totalMatches) * 100)
          : 0,
    }
  } catch (error) {
    console.error('Error getting tournament stats:', error)
    throw error
  }
}

export default {
  getBracketStructure,
  getStageWithBracket,
  getGroupsInStage,
  getRoundsInGroup,
  getMatchesInRound,
  getMatchesInGroup,
  getMatchGames,
  getMatchDetails,
  getTournamentStandings,
  getParticipantNextMatches,
  getParticipantMatchHistory,
  getTournamentStats,
}
