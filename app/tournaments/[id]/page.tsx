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

  if (!id || id.trim() === '') {
    return <div>Invalid tournament ID</div>
  }

  const tournament: SerializedTournament | null = await getTournamentById(id)

  if (!tournament) {
    return <div>Tournament not found</div>
  }

  // Check if tournament has bracket data
  if (
    !tournament.match ||
    !tournament.round ||
    !tournament.group ||
    !tournament.stage
  ) {
    return (
      <Container>
        <div className='text-center py-12'>
          <h1 className='text-2xl font-bold mb-4'>{tournament.name}</h1>
          <p className='text-muted-foreground mb-6'>
            This tournament bracket is not yet set up. Please check back later
            or contact the tournament organizer.
          </p>
        </div>
      </Container>
    )
  }

  //todo:: use this to make brackets ( move into TournamentDetails component)
  const formatToUIModel = categorizeData(
    addParcticipantNameInMatch(tournament as any)
  )

  const tournamentDataForUI = formatToUIModel

  console.log('tournamentDataForUI: ', tournamentDataForUI)

  return (
    <Container>
      <div className='w-full max-w-7xl mx-auto'>
        <TournamentBracket tournamentDataForUI={tournamentDataForUI} />
      </div>
    </Container>
  )
}

export default TournamentDetailsPage
