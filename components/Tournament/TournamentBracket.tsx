'use client'
import React, { useEffect } from 'react'
import DoubleEliminationStage from '@/components/Tournament/Stage/DoubleEliminationStage'
import useTournamentStore from '@/store/useTournamentStore'
import { SerializedTournament } from '@/types/tournament/tournament'
import { TournamentBracketProps } from '@/types/tournament/tournament'

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
