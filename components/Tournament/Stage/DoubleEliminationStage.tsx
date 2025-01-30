import React from 'react'

const DoubleEliminationStage = (stage: any) => {
  const [winnerGroup, loserGroup, grandFinalRound] = stage.groups

  return (
    <div>
      <DoubleEliminationStage group={winnerGroup} />
      {grandFinalRound && <DoubleEliminationStage group={grandFinalRound} />}
    </div>
  )
}

export default DoubleEliminationStage
