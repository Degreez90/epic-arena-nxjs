import React from 'react'
import DoubleEliminationGroup from '@/components/Tournament/Group/DoubleEliminationGroup'
import { StageFrontend } from '@/types/tournament/tournament'

const DoubleEliminationStage = ({ stage }: { stage: StageFrontend }) => {
  console.log('stage: ', stage)
  const [winnerGroup, loserGroup, grandFinalRound] = stage.groups

  return (
    <div>
      <div>
        <DoubleEliminationGroup group={winnerGroup} />
        {grandFinalRound && <DoubleEliminationGroup group={grandFinalRound} />}
      </div>

      {loserGroup && (
        <div>
          <DoubleEliminationGroup group={loserGroup} isLoserGroup />
        </div>
      )}
      {grandFinalRound && (
        <div>
          <DoubleEliminationGroup group={grandFinalRound} isGrandFinalGroup />
        </div>
      )}
    </div>
  )
}

export default DoubleEliminationStage
