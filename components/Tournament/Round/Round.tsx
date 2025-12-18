import React from 'react'
import { BackConnector } from './Connector'
import { FrontConnector } from './Connector'
import Match from '@/components/Tournament/Match/Match'
import { MatchFrontend, RoundFrontend } from '@/types/tournament/tournament'

interface RoundProps {
  round: RoundFrontend
  roundIndex: number
  gapBetweenRounds: { sm: number; md: number }
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

  function getRoundName(
    roundIndex: number,
    roundLength: number,
    isLastRound: boolean
  ) {
    if (!(isLoserGroup || isGrandFinalGroup)) {
      return getMainRoundName(roundIndex, roundLength, isLastRound)
    }
    if (isLoserGroup) return getLoserBracketRoundName(roundIndex, isLastRound)
    if (isGrandFinalGroup) return getGrandFinalRoundName(isLastRound)
  }

  function getMainRoundName(
    roundIndex: number,
    roundLength: number,
    isLastRound: boolean
  ) {
    if (isLastRound) return 'Final Round'
    if (roundIndex === 0) return 'Round 1'
    if (roundLength > 2) {
      if (roundIndex === roundLength - 2) return 'Semi Final'
      return `Round ${roundIndex + 1}`
    }
  }

  // Function to get the name of the loser bracket round
  function getLoserBracketRoundName(roundIndex: number, isLastRound: boolean) {
    if (isLastRound) return 'LB Final Round'
    return `LB Round ${roundIndex + 1}`
  }

  // Function to get the name of the grand final round
  function getGrandFinalRoundName(isLastRound: boolean) {
    if (isLastRound || roundLength === 1) return 'Grand Final'
    return `GF Round 1`
  }

  return (
    <div 
      className={`flex flex-col pb-4 round`}
      style={roundIndex > 0 ? { marginTop: `${80 + roundIndex * 40}px` } : {}}
    >
      <div className='mb-5 bg-slate-400 h-10 w-52 flex items-center rounded-md justify-center'>
        <h2 className='text-xs sm:text-sm md:text-base font-bold text-gray-800 tracking-wide'>
          {getRoundName(roundIndex, roundLength, isLastRound)}
        </h2>
      </div>
      <div className='flex gap-[60px] flex-col flex-1'>
        {round.matches.map((match: MatchFrontend, matchIndex: number) => (
          <div key={matchIndex} className='flex flex-1'>
            <div className='relative flex items-center h-full'>
              <BackConnector
                roundIndex={roundIndex}
                gapBetweenRounds={gapBetweenRounds}
                isLoserGroup={isLoserGroup || isGrandFinalGroup}
              />
            </div>
            <div className='flex items-center w-full'>
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
