'use client'
import React, { useEffect } from 'react'
import DoubleEliminationStage from '@/components/Tournament/Stage/DoubleEliminationStage'
import useTournamentStore from '@/store/useTournamentStore'

interface TournamentBracketProps {
  tournamentDataForUI: {
    _id: any
    name: any
    description: any
    participants: any
    stages: any
    groups: any
    rounds: any
    matches: any
    match_games: any
    games: any
    status: any
    player: any
  }
  tournament: any
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({
  tournamentDataForUI,
  tournament,
}) => {
  const { setTournamentData } = useTournamentStore()

  useEffect(() => {
    if (tournament) setTournamentData(tournament)
  }, [tournament, setTournamentData])

  console.log('tournamentDataForUI from bracket: ', tournamentDataForUI)

  const stage = tournamentDataForUI.stages[0]
  return (
    <div>
      <DoubleEliminationStage stage={stage} />
    </div>
  )
}

export default TournamentBracket
