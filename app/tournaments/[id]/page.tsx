import TournamentDetails from '@/components/Tournament/TournamentDetails'
import { getTournamentById } from '@/data/Tournaments/tournaments'
import { addParcticipantNameInMatch } from '@/data/Tournaments/dataProcessors'
import { categorizeData } from '@/data/Tournaments/dataProcessors'
import TournamentBracket from '@/components/Tournament/TournamentBracket'

const TournamentDetailsPage = async ({
  params: { id },
}: {
  params: { id: string }
}) => {
  const tournamentId = Number(id)
  const tournament = await getTournamentById(tournamentId)

  //todo:: use this to make brackets ( move into TournamentDetails component)
  // const formatToUIModel = categorizeData(addParcticipantNameInMatch(tournament))

  // const tournamentDataForUI = formatToUIModel

  // For the current use of brackets-viewer
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
      {/* <TournamentBracket tournamentDataforUI={tournamentDataForUI} /> */}
    </div>
  )
}

export default TournamentDetailsPage
