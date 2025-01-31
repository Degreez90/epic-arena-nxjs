import React from 'react'
import DoubleEliminationGroup from '@/components/Tournament/Group/DoubleEliminationGroup'

const DoubleEliminationStage = (stage: any) => {
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
