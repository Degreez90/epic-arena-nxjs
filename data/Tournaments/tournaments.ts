import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { TournamentType } from '@/models/tournament'
import { Tournament } from '@/models/tournament'

export const getAllTournaments = async () => {
  await connectDB()

  const tournaments: TournamentType[] = await Tournament.find({})

  return tournaments
}
