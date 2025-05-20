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
  const tournament: any | null = await getTournamentById(tournamentId)

  if (!tournament) {
    return <div>Tournament not found</div>
  }

  //todo:: use this to make brackets ( move into TournamentDetails component)
  const formatToUIModel = categorizeData(addParcticipantNameInMatch(tournament))

  const tournamentDataForUI = formatToUIModel

  console.log('tournamentDataForUI: ', tournamentDataForUI)

  console.log('tournament: ', tournament)
  return (
    <div>
      <TournamentDetails key={tournament._id} tournament={tournament} />
      <TournamentBracket
        tournamentDataForUI={tournamentDataForUI}
        tournament={tournament}
      />
    </div>
  )
}

export default TournamentDetailsPage
