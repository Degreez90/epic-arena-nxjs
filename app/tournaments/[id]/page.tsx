import TournamentDetails from '@/components/Tournament/TournamentDetails'
import { getTournamentById } from '@/data/Tournaments/tournaments'
import { addParcticipantNameInMatch } from '@/data/Tournaments/dataProcessors'
import { categorizeData } from '@/data/Tournaments/dataProcessors'
import TournamentBracket from '@/components/Tournament/TournamentBracket'
import { SerializedTournament } from '@/types/tournament/tournament'
import Container from '@/components/Container'

const TournamentDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const tournamentId = Number(id)

  if (isNaN(tournamentId)) {
    return <div>Invalid tournament ID</div>
  }
  const tournament: SerializedTournament | null = await getTournamentById(
    tournamentId
  )

  if (!tournament) {
    return <div>Tournament not found</div>
  }

  //todo:: use this to make brackets ( move into TournamentDetails component)
  const formatToUIModel = categorizeData(addParcticipantNameInMatch(tournament))

  const tournamentDataForUI = formatToUIModel

  console.log('tournamentDataForUI: ', tournamentDataForUI)

  return (
    <Container>
      <div className='flex justify-center'>
        {/* <TournamentDetails key={tournament._id} tournament={tournament} /> */}
        <TournamentBracket tournamentDataForUI={tournamentDataForUI} />
      </div>
    </Container>
  )
}

export default TournamentDetailsPage
