'use server'

import type { CreateTournamentType } from '@/schemas/createTournament'
import { CreateTournamentSchema } from '@/schemas/createTournament'
import { currentUser } from '@/lib/auth'
import {
  createTournament as createTournamentService,
  getTournamentManager,
  addTournamentParticipants,
  updateTournament as updateTournamentService,
} from '@/data/Tournaments/tournaments'
import { BracketsManager } from 'brackets-manager'
import {
  InputStage,
  StageType,
  SeedOrdering,
  Participant,
} from 'brackets-model'
import { autoResolveByeMatches } from '@/lib/bracketHelpers'

export interface TournamentResponse {
  success?: string
  error?: string
  tournamentId?: string
}

const createTournament = async (
  data: CreateTournamentType,
): Promise<TournamentResponse> => {
  const parsed = CreateTournamentSchema.safeParse(data)

  if (!parsed.success) {
    const flattened = parsed.error.flatten()
    const firstFieldError =
      Object.values(flattened.fieldErrors).flat()[0] ||
      'Invalid tournament data'
    return { error: firstFieldError }
  }

  const validatedData = parsed.data

  const user = await currentUser()

  if (!user) {
    return { error: 'User not found' }
  }

  if (user.role !== 'admin') {
    return { error: 'You do not have permission to create a tournament' }
  }

  try {
    // Create tournament in database
    const tournament = await createTournamentService({
      name: validatedData.tournamentName,
      description: validatedData.description,
      user: { connect: { id: user.id } },
      status: 'pending',
    })

    // Initialize bracket data
    const manager = await getTournamentManager(tournament.id)

    // Create dummy participants for testing
    // In a real application, these would come from user input or API
    const participants: Omit<Participant, 'id'>[] = [
      { name: 'Seed 1', tournament_id: Number(tournament.id) },
      { name: 'Seed 2', tournament_id: Number(tournament.id) },
      { name: 'Seed 3', tournament_id: Number(tournament.id) },
      { name: 'Seed 4', tournament_id: Number(tournament.id) },
      { name: 'Seed 5', tournament_id: Number(tournament.id) },
      { name: 'Seed 6', tournament_id: Number(tournament.id) },
      { name: 'Seed 7', tournament_id: Number(tournament.id) },
      { name: 'Seed 8', tournament_id: Number(tournament.id) },
    ]

    // Add participants to tournament
    await addTournamentParticipants(tournament.id, participants)

    // Create the tournament stage
    const inputStage: InputStage = {
      tournamentId: Number(tournament.id),
      name: tournament.name,
      type: validatedData.type as StageType,
      seeding: participants.map((p, i) => ({ ...p, id: i + 1 })),
      settings: {},
    }

    if (validatedData.seedOrdering) {
      inputStage.settings = {
        ...inputStage.settings,
        seedOrdering: [validatedData.seedOrdering as SeedOrdering],
      }
    }

    // Support best-of-N (Bo3, Bo5, etc.) via matchesChildCount
    // When matchesChildCount > 0, each match becomes a series of child games.
    // The brackets-manager auto-aggregates results and advances the winner.
    if (validatedData.bestOf && validatedData.bestOf > 1) {
      inputStage.settings = inputStage.settings || {}
      inputStage.settings.matchesChildCount = validatedData.bestOf
    }

    if (validatedData.type === 'double_elimination') {
      inputStage.settings = inputStage.settings || {}
      inputStage.settings.grandFinal = 'double'
    } else if (validatedData.type === 'single_elimination') {
      inputStage.settings = inputStage.settings || {}
      if (participants.length > 2) inputStage.settings.consolationFinal = true
    }

    await manager.create.stage(inputStage)

    // Auto-resolve BYE vs BYE matches so bracket progresses
    await autoResolveByeMatches(tournament.id)

    // Update tournament status
    await updateTournamentService(tournament.id, { status: 'progress' })

    return {
      success: 'Tournament Created Successfully',
      tournamentId: tournament.id,
    }
  } catch (error) {
    console.error('Error creating tournament:', error)
    return { error: (error as Error).message }
  }
}

export default createTournament
