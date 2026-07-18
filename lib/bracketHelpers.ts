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
  stageId: number,
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
  groupId: number,
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
  roundId: number,
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
  groupId: number,
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
  matchId: number,
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
          match.opponent2?.id === participant.id,
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
        0,
      )

      const pointsAgainst = participantMatches.reduce(
        (sum: number, match: Match) => {
          if (match.opponent1?.id === participant.id) {
            return sum + (match.opponent2?.score ?? 0)
          }
          return sum + (match.opponent1?.score ?? 0)
        },
        0,
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
  limit: number = 5,
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
          match.status !== ('completed' as any),
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
  participantId: number,
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
          match.status === ('completed' as any),
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

/**
 * Auto-resolve matches involving BYE participants so the bracket progresses.
 * Handles three cases:
 *   1. BYE vs BYE → the first BYE wins 1-0 and advances
 *   2. User vs BYE → the real user wins 1-0 and advances
 *   3. BYE vs User → the real user wins 0-1 and advances
 *
 * Runs in a loop to handle cascading: resolving round 1 advances a
 * participant into round 2 which may again create a BYE match, etc.
 */
export async function autoResolveByeMatches(
  tournamentId: string | number,
): Promise<{ resolved: number }> {
  try {
    const manager = await getTournamentManager(String(tournamentId))

    // Build a participant lookup map. Match opponents are ParticipantResult
    // objects ({id, score, result}) which do NOT include a name. We must look
    // up the actual participant by ID to check if it's a named BYE.
    const participants = (await manager.storage.select('participant')) || []
    const participantById = new Map<number, any>()
    for (const p of participants) {
      participantById.set(p.id as number, p)
    }

    const isBye = (p: any): boolean => {
      // null/undefined = native brackets-manager BYE slot
      if (p === null || p === undefined) return true
      // { id: null } = TBD (to-be-determined), NOT a BYE — it's waiting for a
      // winner from a previous round. Do NOT resolve these prematurely.
      if (p.id === null || p.id === undefined) return false
      // Look up the actual participant — match opponents are ParticipantResult
      // objects without a name field, so p.name is always undefined on them.
      const participant = participantById.get(p.id as number)
      if (participant) {
        const name = (participant.name || '').toLowerCase()
        return name.includes('bye')
      }
      // Fallback: check name on the object itself (for Participant objects)
      const name = (p.name || '').toLowerCase()
      return name.includes('bye')
    }

    let totalResolved = 0

    // --- Heal pass: reset matches corrupted by old buggy code ---
    // Old code treated TBDs ({id: null}) as BYEs, giving them phony scores
    // and incorrect statuses. This pass resets those matches to clean state.
    {
      let healed = 0
      const allMatches = (await manager.storage.select('match')) || []
      for (const match of allMatches) {
        const opp1TbdScored =
          match.opponent1?.id === null &&
          ((match.opponent1 as any)?.score != null ||
           (match.opponent1 as any)?.result)
        const opp2TbdScored =
          match.opponent2?.id === null &&
          ((match.opponent2 as any)?.score != null ||
           (match.opponent2 as any)?.result)

        if (opp1TbdScored || opp2TbdScored) {
          const resetPayload: any = { status: Status.Locked }
          if (opp1TbdScored) {
            resetPayload.opponent1 = { id: null }
          }
          if (opp2TbdScored) {
            resetPayload.opponent2 = { id: null }
          }
          await manager.storage.update('match', match.id, resetPayload as any)
          healed++
        }
      }
      if (healed > 0) {
        totalResolved += healed
      }
    }

    let foundAny = true

    // Keep looping until no more BYE-related matches are pending.
    // Each pass re-fetches all matches so newly created BYE pairs
    // (from advancing a participant into a parent slot) are found.
    while (foundAny) {
      foundAny = false
      const allMatches = (await manager.storage.select('match')) || []
      const allRounds = (await manager.storage.select('round')) || []

      // round_id → Round
      const roundMap = new Map<number, any>()
      for (const r of allRounds) {
        roundMap.set(r.id as number, r)
      }

      for (const match of allMatches) {
        // Skip already completed or archived matches
        if (match.status === Status.Completed || match.status === Status.Archived) continue

        // Need at least one opponent present — both can't be missing
        if (!match.opponent1 && !match.opponent2) continue

        const opp1IsBye = isBye(match.opponent1)
        const opp2IsBye = isBye(match.opponent2)

        // Skip matches with no BYE involvement
        if (!opp1IsBye && !opp2IsBye) continue

        // Determine winner and loser
        let winner: any
        let updatePayload: any

        if (opp1IsBye && opp2IsBye) {
          // Case 1: BYE vs BYE → opponent1 wins 1-0
          winner = { ...match.opponent1 }
          updatePayload = {
            status: Status.Completed,
            opponent1: { ...match.opponent1, score: 1, result: 'win' },
            opponent2: { ...match.opponent2, score: 0, result: 'loss' },
          }
        } else if (opp1IsBye && !opp2IsBye && (match.opponent2 as any)?.id != null) {
          // Case 2: BYE vs Real Player → Player (opponent2) wins 0-1
          // Guard against TBD ({id: null}) — never resolve a BYE vs TBD
          winner = { ...match.opponent2 }
          updatePayload = {
            status: Status.Completed,
            opponent1: { ...match.opponent1, score: 0, result: 'loss' },
            opponent2: { ...match.opponent2, score: 1, result: 'win' },
          }
        } else if (!opp1IsBye && opp2IsBye && (match.opponent1 as any)?.id != null) {
          // Case 3: Real Player vs BYE → Player (opponent1) wins 1-0
          // Guard against TBD ({id: null}) — never resolve a BYE vs TBD
          winner = { ...match.opponent1 }
          updatePayload = {
            status: Status.Completed,
            opponent1: { ...match.opponent1, score: 1, result: 'win' },
            opponent2: { ...match.opponent2, score: 0, result: 'loss' },
          }
        } else {
          // BYE vs TBD or TBD vs BYE: not ready to resolve yet
          continue
        }

        // Resolve the match
        await manager.storage.update('match', match.id, updatePayload as any)
        totalResolved++
        foundAny = true

        // Advance the winner (whether real user or BYE) to the parent match
        // using the shared parent-match lookup helper.
        const parentMatch = await findParentMatch(manager, match)

        if (parentMatch) {
          // Strip score/result from winner when placing into parent slot.
          // Handle null BYE case: { ...null } === {} with no id, which
          // produces "N/A" in the UI. For a null BYE winner, advance a
          // proper TBD-style BYE participant (null) so the slot stays empty
          // but semantically represents a BYE.
          const advancingParticipant =
            winner && (winner as any).id != null
              ? ({ ...(winner as Record<string, unknown>), score: undefined, result: undefined } as any)
              : null

          const updateData: any = {}
          if (
            !parentMatch.opponent1 ||
            (parentMatch.opponent1 as any)?.id === null
          ) {
            updateData.opponent1 = advancingParticipant
          } else if (
            !parentMatch.opponent2 ||
            (parentMatch.opponent2 as any)?.id === null
          ) {
            updateData.opponent2 = advancingParticipant
          }
          if (Object.keys(updateData).length > 0) {
            await manager.storage.update(
              'match',
              parentMatch.id,
              updateData as any,
            )
            // Update the local reference so sibling resolutions in the same
            // loop pass see the filled slot and correctly use the other one.
            if (updateData.opponent1 !== undefined) {
              ;(parentMatch as any).opponent1 = advancingParticipant
            } else if (updateData.opponent2 !== undefined) {
              ;(parentMatch as any).opponent2 = advancingParticipant
            }
          }
        }
      }
    }

    return { resolved: totalResolved }
  } catch (error) {
    console.error('Error auto-resolving BYE matches:', error)
    return { resolved: 0 }
  }
}

/**
 * Report a score for a specific match game in a best-of series.
 *
 * For best-of-N matches, each game is reported individually. The brackets-manager
 * automatically aggregates child game results and advances the winner when the
 * required number of games is won.
 *
 * @param tournamentId The tournament ID
 * @param manager The brackets manager instance
 * @param match The parent match
 * @param opponent1Score Score for opponent 1 in this game
 * @param opponent2Score Score for opponent 2 in this game
 */
export async function reportMatchGameScore(
  tournamentId: string,
  manager: BracketsManager,
  match: Match,
  opponent1Score: number,
  opponent2Score: number,
): Promise<void> {
  // Get existing match games for this match
  const existingGames =
    (await manager.storage.select('match_game', {
      parent_id: match.id,
    })) || []

  // Determine which game number this is
  // Find the first pending/unplayed game, or use the last existing one
  let targetGame: MatchGame | null = null

  // Sort games by number (if available) or by ID
  const sortedGames = [...existingGames].sort((a, b) => {
    const numA = (a as any).number ?? a.id
    const numB = (b as any).number ?? b.id
    return numA - numB
  })

  // Find the first incomplete game (status !== Completed)
  for (const game of sortedGames) {
    if (game.status !== Status.Completed) {
      targetGame = game
      break
    }
  }

  if (!targetGame) {
    // If all existing games are completed, we need to report on the last one
    // (this shouldn't normally happen, but handle it gracefully)
    if (sortedGames.length > 0) {
      targetGame = sortedGames[sortedGames.length - 1]
    } else {
      // No match games exist - fall back to direct match update
      throw new Error('No match games available for this match')
    }
  }

  // Update the match game score using brackets-manager
  // This will automatically aggregate results and advance the winner if the series is decided
  await manager.update.matchGame({
    id: targetGame.id,
    opponent1: {
      ...targetGame.opponent1,
      score: opponent1Score,
    },
    opponent2: {
      ...targetGame.opponent2,
      score: opponent2Score,
    },
  })
}

/**
 * Check if a match is a best-of-N series (has child games)
 */
export async function isBestOfSeries(
  tournamentId: string,
  matchId: number,
): Promise<boolean> {
  const manager = await getTournamentManager(tournamentId)
  const match = await manager.storage.select('match', matchId)
  if (!match) return false
  return (match.child_count ?? 0) > 0
}

/**
 * Check if a tournament stage uses best-of format
 */
export async function isBestOfTournament(
  tournamentId: string,
): Promise<boolean> {
  const manager = await getTournamentManager(tournamentId)
  const stages = await manager.storage.select('stage')
  if (!stages || stages.length === 0) return false
  const stage = stages[0]
  return (stage.settings?.matchesChildCount ?? 0) > 0
}

/**
 * Find the parent match that the winner of the given match should advance to.
 * Returns null if this is the final match (no parent round exists).
 *
 * @param manager The brackets manager instance
 * @param match The current match whose winner needs to advance
 * @returns The parent match, or null if this is the final match
 */
export async function findParentMatch(
  manager: BracketsManager,
  match: Match,
): Promise<Match | null> {
  const allRounds = (await manager.storage.select('round')) || []
  const roundMap = new Map<number, any>()
  for (const r of allRounds) {
    roundMap.set(r.id as number, r)
  }

  const thisRound = roundMap.get(match.round_id as number)
  if (!thisRound) return null

  const parentRoundNumber = Number(thisRound.number) + 1
  const parentMatchNumber = Math.ceil(Number(match.number) / 2)

  const allMatches = (await manager.storage.select('match')) || []
  const parentMatch = allMatches.find((m: any) => {
    const r = roundMap.get(m.round_id as number)
    return (
      r &&
      Number(r.group_id) === Number(thisRound.group_id) &&
      Number(r.number) === parentRoundNumber &&
      Number(m.number) === parentMatchNumber
    )
  })

  return parentMatch || null
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
  autoResolveByeMatches,
  reportMatchGameScore,
  isBestOfSeries,
  isBestOfTournament,
  findParentMatch,
}
