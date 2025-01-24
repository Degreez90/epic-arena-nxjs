'use server'
import { db } from '@/lib/db'
import { Tournament, tournamentStageType } from '@/models/tournament'
import type { CreateTournamentType } from '@/schemas/createTournament'
import { CreateTournamentSchema } from '@/schemas/createTournament'
import { currentUser } from '@/lib/auth'

import { MyDB } from '@/lib/MyDB'
import { BracketsManager } from 'brackets-manager'
import { InputStage, StageType, SeedOrdering } from 'brackets-model'

//TODO:: finish create tounament
const createTournament = async (data: CreateTournamentType) => {
  try {
    const validatedData = CreateTournamentSchema.parse(data)

    const user = await currentUser()

    if (!user) {
      throw new Error('User not found')
    }

    const tournament = new Tournament({
      _id: Date.now(),
      name: validatedData.tournamentName,
      description: validatedData.description,
      createdBy: user.id,
    })

    await tournament.save()

    const myDB = await MyDB.build(tournament._id)
    const manager = new BracketsManager(myDB)

    const participants = [
      { id: 7, name: 'Seed 1', tournament_id: tournament._id },
      { id: 55, name: 'Seed 2', tournament_id: tournament._id },
      { id: 53, name: 'Seed 3', tournament_id: tournament._id },
      { id: 523, name: 'Seed 4', tournament_id: tournament._id },
      { id: 123, name: 'Seed 5', tournament_id: tournament._id },
      { id: 353, name: 'Seed 6', tournament_id: tournament._id },
      { id: 354, name: 'Seed 7', tournament_id: tournament._id },
      { id: 355, name: 'Seed 8', tournament_id: tournament._id },
    ]

    const inputStage: InputStage = {
      tournamentId: Number(tournament._id),
      name: tournament.name,
      type: validatedData.type as StageType,
      seeding: participants,
      settings: {
        seedOrdering: [validatedData.seedOrdering as SeedOrdering],
      },
    }

    if (validatedData.type === 'double_elimination') {
      inputStage.settings = inputStage.settings || {}
      inputStage.settings.grandFinal = 'double'
    } else if (validatedData.type === 'single_elimination') {
      inputStage.settings = inputStage.settings || {}
      if (participants.length > 2) inputStage.settings.consolationFinal = true
    }

    await manager.create.stage(inputStage)
    return { success: 'Tournament Created' }
  } catch (error) {
    console.error('Error creating tournament:', error)
    return { error: (error as Error).message }
  }
}

export default createTournament
