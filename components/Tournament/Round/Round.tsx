import React from 'react'
import { BackConnector } from './Connector'

interface RoundProps {
  round: any
  roundIndex: number
  gapBetweenRounds: any
  isLoserGroup?: boolean
  roundLength: number
  isGrandFinalGroup?: boolean
}

const Round: React.FC<RoundProps> = ({
  round,
  roundIndex,
  gapBetweenRounds,
  isLoserGroup = false,
  roundLength,
  isGrandFinalGroup = false,
}) => {
  const isLastRound = roundLength - 1 === roundIndex

  function getRoundName(roundIndex: any, roundLength: any, isLastRound: any) {
    if (!(isLoserGroup || isGrandFinalGroup)) {
      return getMainRoundName(roundIndex, roundLength, isLastRound)
    }
    if (isLoserGroup) return getLoserBracketRoundName(roundIndex, isLastRound)
    if (isGrandFinalGroup) return getGrandFinalRoundName(isLastRound)
  }

  function getMainRoundName(
    roundIndex: any,
    roundLength: any,
    isLastRound: any
  ) {
    if (isLastRound) return 'Final Round'
    if (roundIndex === 0) return 'Round 1'
    if (roundLength > 2) {
      if (roundIndex === roundLength - 2) return 'Semi Final'
      return `Round ${roundIndex + 1}`
    }
  }
  function getLoserBracketRoundName(roundIndex: any, isLastRound: any) {
    if (isLastRound) return 'LB Final Round'
    return `LB Round ${roundIndex + 1}`
  }
  function getGrandFinalRoundName(isLastRound: any) {
    if (isLastRound || roundLength === 1) return 'Grand Final'
    return `GF Round 1`
  }

  return (
    <div className='flex flex-col pb-4'>
      <div className='mb-5 bg-slate-600 h-40 flex items-center justify-center'>
        <h2 className='text-xs'>
          {getRoundName(roundIndex, roundLength, isLastRound)}
        </h2>{' '}
        {/* Name of the round */}
      </div>
      <div className='flex gap-[15] flex-col flex-1'>
        {round.matches.map((match: any, matchIndex: any) => (
          <div key={matchIndex} className='flex flex-1'>
            <div className='relative flex items-center h-full'>
              <BackConnector
                roundIndex={roundIndex}
                gapBetweenRounds={gapBetweenRounds}
                isLoserGroup={isLoserGroup || isGrandFinalGroup}
              />
            </div>
            <div className='flex items-center'>
              <Match match={match} />
            </div>
            <div className='relative flex items-center h-full'>
              <FrontConnector
                matchIndex={matchIndex}
                gapBetweenRounds={gapBetweenRounds}
                isLastRound={isLastRound}
                isLoserGroup={isLoserGroup || isGrandFinalGroup}
                roundIndex={roundIndex}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Round
