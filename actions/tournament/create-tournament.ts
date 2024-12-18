'use server'
import { db } from '@/lib/db'
import type { CreateTournamentType } from '@/schemas/createTournament'
import { CreateTournamentSchema } from '@/schemas/createTournament'
import { Prisma } from '@prisma/client'

//TODO:: finish create tounament
const createTournament = async (data: CreateTournamentType) => {
  const validatedData = CreateTournamentSchema.parse(data)

  const tournament: Prisma.TournamentCreateInput = {
    name: validatedData.tName,
    description: validatedData.description,
    stages: {
      create: [
        {
          type: validatedData.type,
          number: 1,
          name: '',
        },
      ],
    },
  }
}

export default createTournament
