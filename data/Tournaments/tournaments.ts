import { connectDB } from '@/lib/mongodb'
import { ITournament, TournamentType } from '@/models/tournament'
import { Tournament } from '@/models/tournament'

export const getAllTournaments = async () => {
  await connectDB()

  const tournaments: TournamentType[] = await Tournament.find({})

  return tournaments
}

export const getTournamentById = async (id: number) => {
  await connectDB()

  const tournament = await Tournament.findOne({
    _id: id,
  })

  console.log('here: ', tournament)

  return tournament
}
