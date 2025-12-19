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

      {/* Matches with Connectors */}
      <div className='flex flex-col' style={{ gap: `${gapBetweenMatches}px` }}>
        {round.matches.map((match: MatchFrontend, idx: number) => (
          <div key={idx} className='relative'>
            <div className='w-48'>
              <MatchCard match={match} />
            </div>

            {/* Right Connector - horizontal dotted line */}
            {roundIndex < totalRounds - 1 && (
              <div
                className='absolute left-full h-px border-t-2 border-dotted border-border'
                style={{
                  width: 'calc(var(--round-gap, 4rem) / 2)',
                  top: `${connectorOffset}px`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Vertical Connectors */}
      {roundIndex < totalRounds - 1 && (
        <svg
          className='absolute top-0 pointer-events-none'
          style={{
            left: 'calc(100% + calc(var(--round-gap, 4rem) / 2))',
            width: 'calc(var(--round-gap, 4rem) / 2)',
            height: '100%',
          }}
        >
          {round.matches.map((_: any, idx: number) => {
            // For loser major rounds, connect pairs
            const shouldConnect = isLoserMajorRound

            if (shouldConnect && idx % 2 === 0 && idx + 1 < matchCount) {
              // Simple calculation: each match is spaced by (cardHeight + gapBetweenMatches)
              const match1Top = idx * (cardHeight + gapBetweenMatches)
              const match2Top = (idx + 1) * (cardHeight + gapBetweenMatches)
              
              const match1Anchor = match1Top + connectorOffset
              const match2Anchor = match2Top + connectorOffset
              const midPoint = (match1Anchor + match2Anchor) / 2

              return (
                <g key={idx}>
                  {/* Vertical dotted line connecting two matches */}
                  <line
                    x1='0'
                    y1={match1Anchor}
                    x2='0'
                    y2={match2Anchor}
                    stroke='hsl(var(--border))'
                    strokeWidth='2'
                    strokeDasharray='4 4'
                  />
                  {/* Horizontal dotted line to next round at right angle */}
                  <line
                    x1='0'
                    y1={midPoint}
                    x2='100%'
                    y2={midPoint}
                    stroke='hsl(var(--border))'
                    strokeWidth='2'
                    strokeDasharray='4 4'
                  />
                </g>
              )
            }
            return null
          })}
        </svg>
      )}
    </div>
  )
}

export default LoserBracket
