import Hero from '@/components/hero/Hero'
import Games from '@/components/games/Games'
import TournamentList from '@/components/Tournament/TournamentList'
import { getAllTournaments } from '@/data/Tournaments/tournaments'

export default async function Home() {
  const tournaments = await getAllTournaments()
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
