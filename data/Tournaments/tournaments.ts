import { connectDB } from '@/lib/mongodb'
import { ITournament, TournamentType } from '@/models/tournament'
import { Tournament } from '@/models/tournament'
import { Console } from 'console'

export const getAllTournaments = async () => {
  await connectDB()

  const tournaments: ITournament[] = await Tournament.find({})

  return tournaments
}

export const getTournamentById = async (id: number) => {
  await connectDB()

  const tournament = await Tournament.findOne({
    _id: id,
  }).lean()

  console.log('here: ', tournament)
  if (!tournament) return null

  // Convert ObjectId to string
  return serialize(tournament)

  //* serialize tournament
  function serialize(obj: any): any {
    if (obj == null) return obj
    if (typeof obj !== 'object') return obj

    // Handle ObjectId
    if (obj._bsontype === 'ObjectID' || obj._bsontype === 'ObjectId') {
      return obj.toString()
    }

    // Handle Date
    if (obj instanceof Date) {
      return obj.toISOString()
    }

    if (Array.isArray(obj)) {
      return obj.map(serialize)
    }

    // Recursively serialize all object properties
    const result: any = {}
    for (const key in obj) {
      result[key] = serialize(obj[key])
    }
    return result
  }
}
