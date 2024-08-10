'use server'
import { db } from '@/lib/db'
import type { CreateTournamentType } from '@/schemas/createTournament'
import { CreateTournamentSchema } from '@/schemas/createTournament'

//TODO:: finish create tounament
const createTournament = async (data: CreateTournamentType) => {
  const validatedData = CreateTournamentSchema.parse(data)

  const tournament = await db.tournament.create({
    data: {
      name: validatedData.tName,
      type: validatedData.type,
      thirdPlaceMatch: validatedData.thirdPlaceMatch,
    },
  })
}

export default createTournament
