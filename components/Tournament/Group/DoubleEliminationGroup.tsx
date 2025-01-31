import React from 'react'
import Round from '../Round/Round'

const styleConstants = {
  gapBetweenRounds: {
    sm: 4, //sm:gap-4
    md: 8, //md:gap-8
  },
}

const stylesGap = `flex sm:gap-${styleConstants.gapBetweenRounds.sm} md:gap-${styleConstants.gapBetweenRounds.md}`

const DoubleEliminationGroup = (
  group: any,
  isLoserGroup = false,
  isGrandFinalGroup = false
) => {
  let rounds = group.rounds
  if (isGrandFinalGroup) {
    const roundOneWinner = rounds[0].matches[0].opponent1
    const displayCount = roundOneWinner?.result === 'win' ? 1 : 2
    rounds = rounds.slice(0, displayCount)
  }

  return (
    <div>
      {isLoserGroup ? (
        <h2>Lower Bracket</h2>
      ) : isGrandFinalGroup ? (
        <h2>Grand Final</h2>
      ) : (
        <h2>Upper Bracket</h2>
      )}
      <div className={`${stylesGap} flex`}>
        {rounds.map((round: any, i: any, rounds: any) => {
          return (
            <Round
              key={i}
              round={round}
              roundIndex={i}
              roundLength={rounds.length}
              gapBetweenRounds={styleConstants.gapBetweenRounds}
              isLoserGroup={isLoserGroup}
              isGrandFinalGroup={isGrandFinalGroup}
            />
          )
        })}
      </div>
    </div>
  )
}

export default DoubleEliminationGroup
