'use server'
import { db } from '@/lib/db'
import type { CreateTournamentType } from '@/schemas/createTournament'
import { CreateTournamentSchema } from '@/schemas/createTournament'
import { Prisma } from '@prisma/client'

//TODO:: finish create tounament
export const createTournament = async (data: CreateTournamentType) => {
  const validatedData = CreateTournamentSchema.parse(data)

  const tournament = {
    _id: Date.now().toString(),
    tName: validatedData.tName,
    description: validatedData.description,
    type: validatedData.type,
    thirdPlaceMatch: validatedData.thirdPlaceMatch,
    seedOrdering: validatedData.seedOrdering,
  }
}

const ParticipantData = {
  participants: [
    {
      name: 'Player 1',
      seed: 1,
    },
    {
      name: 'Player 2',
      seed: 2,
    },
  ],
}

export default createTournament
