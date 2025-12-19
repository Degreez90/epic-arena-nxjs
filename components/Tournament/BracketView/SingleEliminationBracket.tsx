'use client'
import React from 'react'
import { StageFrontend, MatchFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'

interface SingleEliminationBracketProps {
  stage: StageFrontend
}

const SingleEliminationBracket: React.FC<SingleEliminationBracketProps> = ({
  stage,
}) => {
  const mainGroup = stage.groups[0]
  const consolationGroup = stage.groups[1]
  const isConsolationPresent = stage.settings?.consolationFinal

  return (
    <div className='w-full overflow-x-auto pb-8'>
      <div className='min-w-max p-4'>
        {/* Main Bracket with Connectors */}
        <div className='flex gap-12 md:gap-16'>
          {mainGroup.rounds.map((round, roundIdx) => (
            <BracketRound
              key={roundIdx}
              round={round}
              roundIndex={roundIdx}
              totalRounds={mainGroup.rounds.length}
            />
          ))}
        </div>

        {/* Third Place Match */}
        {isConsolationPresent && consolationGroup?.rounds[0] && (
          <div className='mt-12 pt-8 border-t'>
            <h3 className='text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide text-center'>
              Third Place Match
            </h3>
            <div className='flex justify-center'>
              <div className='w-48'>
                <MatchCard match={consolationGroup.rounds[0].matches[0]} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface BracketRoundProps {
  round: any
  roundIndex: number
  totalRounds: number
}

const BracketRound: React.FC<BracketRoundProps> = ({
  round,
  roundIndex,
  totalRounds,
}) => {
  const roundNames = ['Round 1', 'Round 2', 'Semifinals', 'Finals']
  const matchCount = round.matches.length

  // Calculate gap between matches to create proper tournament bracket spacing
  // Round 1: 20px (as requested)
  // Each subsequent round doubles the gap to align with previous round's matches
  const baseGap = 20
  const gapBetweenMatches = baseGap * Math.pow(2, roundIndex)
  
  const gapBetweenRounds = 64 // Fixed gap between rounds
  const cardHeight = 88 // Height of match card

  return (
    <div className='flex flex-col relative' style={{ marginRight: `${gapBetweenRounds}px` }}>
      {/* Round Label */}
      <div className='mb-4 text-center'>
        <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
          {roundNames[roundIndex] || `Round ${roundIndex + 1}`}
        </h4>
      </div>

      {/* Matches with proper vertical spacing */}
      <div className='flex flex-col' style={{ gap: `${gapBetweenMatches}px` }}>
        {round.matches.map((match: MatchFrontend, idx: number) => (
          <div key={idx}>
            <div className='w-48'>
              <MatchCard match={match} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SingleEliminationBracket
