'use server'

import { BracketsManager, helpers } from 'brackets-manager'
import { Seeding } from 'brackets-model'
import { db } from '@/lib/db'
import type { CreateTournamentType } from '@/schemas/createTournament'
import { CreateTournamentSchema } from '@/schemas/createTournament'
import { Prisma } from '@prisma/client'
import { User } from 'next-auth'

import { Participant } from '@/types/tournament/types'

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

let participantData: Seeding = [
  {
    id: 1,
    tournament_id: 1,
    name: 'Player 1',
  },
  {
    id: 2,
    tournament_id: 1,
    name: 'Player 2',
  },
]

participantData = helpers.balanceByes(participantData)

export default createTournament
