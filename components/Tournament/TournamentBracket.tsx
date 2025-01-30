import React from 'react'
import DoubleEliminationStage from '@/components/Tournament/Stage/DoubleEliminationStage'

const TournamentBracket = (tournamentDataForUI: any) => {
  const stage = tournamentDataForUI.stages[0]
  return (
    <div>
      <DoubleEliminationStage stage={stage} />
    </div>
  )
}

export default TournamentBracket
