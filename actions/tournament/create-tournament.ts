'use server'
import { db } from '@/lib/db'
import type { CreateTournamentType } from '@/schemas/createTournament'
import { CreateTournamentSchema } from '@/schemas/createTournament'
import { Prisma } from '@prisma/client'

//TODO:: finish create tounament
const createTournament = async (data: CreateTournamentType) => {
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

export default createTournament
