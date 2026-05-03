import prisma from '@/lib/prisma'
import type {
  Prisma,
  Tournament,
  Game,
  TournamentParticipant,
} from '@prisma/client'
import { BracketsManager } from 'brackets-manager'
import { MyDB } from '@/lib/MyDB'
import {
  InputStage,
  StageType,
  SeedOrdering,
  Participant as BracketsParticipant,
} from 'brackets-model'

export type TournamentDTO = Tournament & {
  _id: string
  game?: Game | null
  participants?: TournamentParticipant[]
}

const toDTO = (
  t: Tournament & { game?: Game | null; participants?: TournamentParticipant[] }
): TournamentDTO => ({
  ...t,
  _id: t.id,
})

/**
 * Get all tournaments
 */
export const getAllTournaments = async (): Promise<TournamentDTO[]> => {
  const tournaments = await prisma.tournament.findMany({
    include: {
      game: true,
      participants: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return tournaments.map(toDTO)
}

/**
 * Get a tournament by ID
 */
export const getTournamentById = async (
  id: string | number
): Promise<TournamentDTO | null> => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: String(id) },
    include: {
      game: true,
      participants: true,
    },
  })
  if (!tournament) return null
  return toDTO(tournament)
}

/**
 * Get tournaments by creator
 */
export const getTournamentsByCreator = async (
  createdBy: string
): Promise<TournamentDTO[]> => {
  const tournaments = await prisma.tournament.findMany({
    where: { createdBy },
    orderBy: { createdAt: 'desc' },
  })
  return tournaments.map(toDTO)
}

/**
 * Get tournaments by status
 */
export const getTournamentsByStatus = async (
  status: string
): Promise<TournamentDTO[]> => {
  const tournaments = await prisma.tournament.findMany({
    where: { status },
    orderBy: { createdAt: 'desc' },
  })
  return tournaments.map(toDTO)
}

/**
 * Create a new tournament
 */
export const createTournament = async (
  data: Prisma.TournamentCreateInput
): Promise<TournamentDTO> => {
  const tournament = await prisma.tournament.create({ data })
  return toDTO(tournament)
}

/**
 * Update a tournament
 */
export const updateTournament = async (
  id: string,
  data: Prisma.TournamentUpdateInput
): Promise<TournamentDTO> => {
  const tournament = await prisma.tournament.update({
    where: { id },
    data,
  })
  return toDTO(tournament)
}

/**
 * Delete a tournament
 */
export const deleteTournament = async (id: string): Promise<boolean> => {
  try {
    await prisma.tournament.delete({
      where: { id },
    })
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get the brackets manager instance for a tournament
 */
export const getTournamentManager = async (
  tournamentId: string
): Promise<BracketsManager> => {
  const db = await MyDB.build(tournamentId)
  return new BracketsManager(db)
}

/**
 * Get all participants in a tournament
 */
export const getTournamentParticipants = async (
  tournamentId: string
): Promise<BracketsParticipant[]> => {
  const manager = await getTournamentManager(tournamentId)
  const participants = await manager.storage.select('participant', {
    tournament_id: Number(tournamentId),
  })
  return participants || []
}

/**
 * Add participants to a tournament
 */
export const addTournamentParticipants = async (
  tournamentId: string,
  participants: Omit<BracketsParticipant, 'id'>[]
): Promise<boolean> => {
  try {
    const manager = await getTournamentManager(tournamentId)
    const result = await manager.storage.insert('participant', participants)
    return result !== false
  } catch (error) {
    console.error('Error adding participants:', error)
    return false
  }
}

/**
 * Get all stages in a tournament
 */
export const getTournamentStages = async (
  tournamentId: string
): Promise<any[]> => {
  const manager = await getTournamentManager(tournamentId)
  const stages = await manager.storage.select('stage', {
    tournament_id: tournamentId,
  })
  return stages || []
}

/**
 * Get all matches in a tournament
 */
export const getTournamentMatches = async (
  tournamentId: string
): Promise<any[]> => {
  const manager = await getTournamentManager(tournamentId)
  const matches = await manager.storage.select('match', {
    stage_id: tournamentId,
  })
  return matches || []
}

/**
 * Get a specific match by ID
 */
export const getTournamentMatch = async (
  tournamentId: string,
  matchId: number
): Promise<any | null> => {
  const manager = await getTournamentManager(tournamentId)
  const match = await manager.storage.select('match', matchId)
  return match || null
}

/**
 * Update a match (report scores)
 */
export const updateTournamentMatch = async (
  tournamentId: string,
  matchId: number,
  matchData: any
): Promise<boolean> => {
  try {
    const manager = await getTournamentManager(tournamentId)
    const result = await manager.storage.update('match', matchId, matchData)
    return result
  } catch (error) {
    console.error('Error updating match:', error)
    return false
  }
}

/**
 * Get tournament progress/statistics
 */
export const getTournamentProgress = async (
  tournamentId: string
): Promise<any> => {
  try {
    const manager = await getTournamentManager(tournamentId)
    const stages = await manager.storage.select('stage')
    const matches = await manager.storage.select('match')
    const participants = await manager.storage.select('participant')

    if (!stages || !matches || !participants) {
      return {
        totalParticipants: 0,
        totalMatches: 0,
        completedMatches: 0,
        pendingMatches: 0,
        stages: 0,
        progress: 0,
      }
    }

    const completedMatches = matches.filter(
      (m: any) => m.status === 'completed'
    ).length
    const pendingMatches = matches.filter(
      (m: any) => m.status === 'pending'
    ).length
    const progress =
      matches.length > 0
        ? Math.round((completedMatches / matches.length) * 100)
        : 0

    return {
      totalParticipants: participants.length,
      totalMatches: matches.length,
      completedMatches,
      pendingMatches,
      stages: stages.length,
      progress,
    }
  } catch (error) {
    console.error('Error getting tournament progress:', error)
    return null
  }
}

/**
 * Get bracket data for a stage
 */
export const getStageBracket = async (
  tournamentId: string,
  stageId: number
): Promise<any> => {
  try {
    const manager = await getTournamentManager(tournamentId)
    const stage = await manager.storage.select('stage', stageId)
    const groups = await manager.storage.select('group', { stage_id: stageId })
    const rounds = await manager.storage.select('round', { stage_id: stageId })
    const matches = await manager.storage.select('match', { stage_id: stageId })

    return {
      stage,
      groups,
      rounds,
      matches,
    }
  } catch (error) {
    console.error('Error getting stage bracket:', error)
    return null
  }
}
