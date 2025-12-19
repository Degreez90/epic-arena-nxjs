'use client'
import React from 'react'
import { MatchFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'

interface LoserBracketProps {
  round: any
  roundIndex: number
  totalRounds: number
}

const LoserBracket: React.FC<LoserBracketProps> = ({
  round,
  roundIndex,
  totalRounds,
}) => {
  const matchCount = round.matches.length

  // Fixed gaps - no complex calculations
  const gapBetweenMatches = 20 // Fixed gap between match cards in the same round
  const gapBetweenRounds = 16 // Fixed gap between rounds
  const cardHeight = 88 // Height of match card
  const connectorOffset = 44 // Center point of the match card for connectors

  // Determine if this is a loser major round for connector logic
  const isLoserMajorRound = roundIndex % 2 === 0

  return (
    <div className='flex flex-col relative' style={{ marginRight: `${gapBetweenRounds}px` }}>
      {/* Round Label */}
      <div className='mb-4 text-center'>
        <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
          Round {roundIndex + 1}
        </h4>
      </div>

      {/* Matches */}
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

export default LoserBracket
