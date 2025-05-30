import Hero from '@/components/Hero/Hero'
import Games from '@/components/Games/Games'
import TournamentList from '@/components/Tournament/TournamentList'
import { TournamentType } from '@/models/tournament'
import { getAllTournaments } from '@/data/Tournaments/tournaments'

export default async function Home() {
  const tournaments: TournamentType[] = await getAllTournaments()
  if (!tournaments) {
    throw new Error('Error fetching tournaments')
  }
  return (
    <div>
      <TournamentList Tournaments={tournaments} />
      <Games />
    </div>
  )
}
