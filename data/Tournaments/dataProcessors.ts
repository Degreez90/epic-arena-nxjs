import {
  CustomParticipantFrontend,
  GroupFrontend,
  MatchFrontend,
  OrganizedTournamentData,
  RoundFrontend,
  SerializedTournament,
  StageFrontend,
} from '@/types/tournament/tournament'
import { Round, Group, Stage } from 'brackets-model'

export const addParcticipantNameInMatch = (
  tournamentData: SerializedTournament
) => {
  const getParticipantName = (Id: number) => {
    const participant = tournamentData.participant.find(
      (participant: CustomParticipantFrontend) => participant.id === Id
    )
    if (!participant) return 'N/A'
    return participant.name
  }

  const updatedData = {
    ...tournamentData,
    match: tournamentData.match.map((match: MatchFrontend) => ({
      ...match,
      opponent1: match.opponent1
        ? { ...match.opponent1, name: getParticipantName(match.opponent1.id) }
        : null,
      opponent2: match.opponent2
        ? { ...match.opponent2, name: getParticipantName(match.opponent2.id) }
        : null,
    })),
  }

  return updatedData
}

export const categorizeData = (
  tournamentData: SerializedTournament
): OrganizedTournamentData => {
  // 1. Add participants to matches
  const matches: MatchFrontend[] = (
    tournamentData.match as MatchFrontend[]
  ).map((match) => ({
    ...match,
    participants: [match.opponent1, match.opponent2],
  }))

  // 2. Nest matches into rounds
  const rounds: RoundFrontend[] = (tournamentData.round as Round[]).map(
    (round) => ({
      ...round,
      matches: matches.filter((match) => match.round_id === round.id),
    })
  )

  // 3. Nest rounds into groups
  const groups: GroupFrontend[] = (tournamentData.group as Group[]).map(
    (group) => ({
      ...group,
      rounds: rounds.filter((round) => round.group_id === group.id),
    })
  )

  // 4. Nest groups into stages
  const stages: StageFrontend[] = (tournamentData.stage as Stage[]).map(
    (stage) => ({
      ...stage,
      groups: groups.filter((group) => group.stage_id === stage.id),
    })
  )

  // 5. Return the final object
  return {
    _id: tournamentData._id,
    name: tournamentData.name,
    description: tournamentData.description,
    participants: tournamentData.participant,
    stages,
    match_games: tournamentData.match_game,
    games: tournamentData.game,
    status: tournamentData.status,
    player: tournamentData.player,
  }
}
