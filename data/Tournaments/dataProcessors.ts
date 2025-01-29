export const addParcticipantNameInMatch = (tournamentData: any) => {
  const getParticipantName = (Id: number) => {
    const participant = tournamentData.participant.find(
      (participant: any) => participant.id === Id
    )
    if (!participant) return 'N/A'
    return participant.name
  }

  const updatedData = tournamentData
  updatedData.foreach(updatedData.match, (match: any) => {
    match.opponent1Name = getParticipantName(match.opponent1)
    match.opponent2Name = getParticipantName(match.opponent2)
  })
  return tournamentData
}

export const categorizeData = (tournamentData: any) => {
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

  // create participants property in matches and add 'opponent1' and 'opponent2'
  organizedData.matches.forEach((match: any) => {
    match.participants = [match.opponent1, match.opponent2]
  })

  // collect matches into group
  organizedData.rounds.forEach((round: any) => (round.matches = []))
  for (let round of organizedData.rounds) {
    for (let match of organizedData.matches)
      if (match.round_id === round.id) round.matches.push({ ...match })
  }
  delete organizedData.matches

  // collect groups into round
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

  return organizedData
}
