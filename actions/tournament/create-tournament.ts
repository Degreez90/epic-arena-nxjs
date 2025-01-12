'use server'
import { db } from '@/lib/db'
import type { CreateTournamentType } from '@/schemas/createTournament'
import { CreateTournamentSchema } from '@/schemas/createTournament'
import { Prisma } from '@prisma/client'
import { User } from 'next-auth'

//TODO:: finish create tounament
export const createTournament = async (
  data: CreateTournamentType,
  user: User
) => {
  const validatedData = CreateTournamentSchema.parse(data)

  const tournament = {
    _id: Date.now().toString(),
    tournamentName: validatedData.tName,
    description: validatedData.description,
    type: validatedData.type,
    thirdPlaceMatch: validatedData.thirdPlaceMatch,
    seedOrdering: validatedData.seedOrdering,
    createdBy: user.id,
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
