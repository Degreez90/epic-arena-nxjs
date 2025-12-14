import Hero from '@/components/Hero/Hero'
import Games from '@/components/Games/Games'
import TournamentList from '@/components/Tournament/TournamentList'
import { ITournament, TournamentType } from '@/models/tournament'
import { getAllTournaments } from '@/data/Tournaments/tournaments'

export default async function Home() {
  const tournaments: ITournament[] = await getAllTournaments()
  if (!tournaments) {
    throw new Error('Error fetching tournaments')
  }
  return (
    <div>
      <Hero />
      <TournamentList Tournaments={tournaments} />
      <Games />
    </div>
  )
}
