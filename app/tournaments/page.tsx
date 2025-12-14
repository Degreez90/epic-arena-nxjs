import React from 'react'
import TournamentList from '@/components/Tournament/TournamentList'
import { getAllTournaments } from '@/data/Tournaments/tournaments'
import { ITournament, TournamentType } from '@/models/tournament'
const page = async () => {
  const tournaments: ITournament[] = await getAllTournaments()

  if (!tournaments) {
    throw new Error('Error fetching tournaments')
  }

  return (
    <div>
      <TournamentList Tournaments={tournaments} />
    </div>
  )
}

export default page
