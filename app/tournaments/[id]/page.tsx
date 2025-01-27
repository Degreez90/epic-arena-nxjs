import TournamentDetails from '@/components/Tournament/TournamentDetails'
import { getTournamentById } from '@/data/Tournaments/tournaments'

const TournamentDetailsPage = async ({
  params: { id },
}: {
  params: { id: string }
}) => {
  const tournamentId = Number(id)
  const tournament = await getTournamentById(tournamentId)

  const serializedTournament = JSON.parse(
    JSON.stringify(tournament, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString() // Convert Date to string
      }
      return value
    })
  )
  console.log('tournament: ', serializedTournament)
  return (
    <div>
      <TournamentDetails
        key={serializedTournament._id}
        tournament={serializedTournament}
      />
    </div>
  )
}

export default TournamentDetailsPage
