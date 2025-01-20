'use server'
import { db } from '@/lib/db'
import { Tournament } from '@/models/tournament'
import type { CreateTournamentType } from '@/schemas/createTournament'
import { CreateTournamentSchema } from '@/schemas/createTournament'
import { Prisma } from '@prisma/client'
import { currentUser } from '@/lib/auth'

import { MyDB } from '@/lib/MyDB'
import { BracketsManager } from 'brackets-manager'

//TODO:: finish create tounament
const createTournament = async (data: CreateTournamentType) => {
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
}

export default createTournament
