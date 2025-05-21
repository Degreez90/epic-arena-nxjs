import {
  CustomParticipantFrontend,
  MatchFrontend,
  OrganizedTournamentData,
  SerializedTournament,
} from '@/types/tournament/tournament'

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

export const categorizeData = (tournamentData: any) => {
  console.log('tournamentData: ', tournamentData)
  const organizedData = {
    _id: tournamentData._id,
    name: tournamentData.name,
    description: tournamentData.description,
    participants: tournamentData.participant,
    stages: tournamentData.stage,
    groups: tournamentData.group,
    rounds: tournamentData.round,
    matches: tournamentData.match,
    match_games: tournamentData.match_game,
    games: tournamentData.game,
    status: tournamentData.status,
    player: tournamentData.player,
  }
  console.log('organizedData: ', organizedData)

  // create participants property in matches and add 'opponent1' and 'opponent2'
  organizedData.matches.forEach((match: any) => {
    match.participants = [match.opponent1, match.opponent2]
  })

  // collect matches into group for each round.
  organizedData.rounds.forEach((round: any) => (round.matches = []))
  for (let round of organizedData.rounds) {
    for (let match of organizedData.matches)
      if (match.round_id === round.id) round.matches.push({ ...match })
  }
  delete organizedData.matches

  // collect rounds into groups for each group.
  organizedData.groups.forEach((group: any) => (group.rounds = []))
  for (let group of organizedData.groups) {
    for (let round of organizedData.rounds)
      if (round.group_id === group.id) group.rounds.push(round)
  }
  delete organizedData.rounds

  // collect groups into stage
  organizedData.stages.forEach((stage: any) => (stage.groups = []))
  for (let stage of organizedData.stages) {
    for (let group of organizedData.groups)
      if (group.stage_id === stage.id) stage.groups.push(group)
  }
  delete organizedData.groups

  console.log('organizedData after: ', organizedData)

  return organizedData
}
