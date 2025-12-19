'use client'
import React from 'react'
import { StageFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'
import LoserBracket from './LoserBracket'

interface DoubleEliminationBracketProps {
  stage: StageFrontend
}

const DoubleEliminationBracket: React.FC<DoubleEliminationBracketProps> = ({
  stage,
}) => {
  const groups = stage.groups
  const winnersGroup = groups[0]
  const losersGroup = groups[1]
  const grandFinalGroup = groups[2]

  return (
    <div className='w-full overflow-x-auto pb-8'>
      <div className='min-w-max space-y-12 p-4'>
        {/* Winners Bracket */}
        {winnersGroup && (
          <div>
            <h3 className='text-lg md:text-xl font-semibold mb-8'>
              Winners Bracket
            </h3>
            <div className='flex gap-16 md:gap-20 [--round-gap:4rem] md:[--round-gap:5rem] [--connector-inline:calc(var(--round-gap)_/_2)]'>
              {winnersGroup.rounds.map((round, roundIdx) => (
                <WinnerBracketRound
                  key={roundIdx}
                  round={round}
                  roundIndex={roundIdx}
                  totalRounds={winnersGroup.rounds.length}
                />
              ))}
            </div>
          </div>
        )}

        {/* Losers Bracket */}
        {losersGroup && (
          <div className='pt-12 border-t'>
            <h3 className='text-lg md:text-xl font-semibold mb-8'>
              Losers Bracket
            </h3>
            <div className='flex gap-16 md:gap-20 [--round-gap:4rem] md:[--round-gap:5rem] [--connector-inline:calc(var(--round-gap)_/_2)]'>
              {losersGroup.rounds.map((round, roundIdx) => (
                <LoserBracket
                  key={roundIdx}
                  round={round}
                  roundIndex={roundIdx}
                  totalRounds={losersGroup.rounds.length}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grand Final */}
        {grandFinalGroup && grandFinalGroup.rounds[0] && (
          <div className='pt-12 border-t'>
            <h3 className='text-lg md:text-xl font-semibold mb-8 text-center'>
              Grand Final
            </h3>
            <div className='flex justify-center'>
              <div className='w-48'>
                <MatchCard match={grandFinalGroup.rounds[0].matches[0]} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface WinnerBracketRoundProps {
  round: any
  roundIndex: number
  totalRounds: number
}

const WinnerBracketRound: React.FC<WinnerBracketRoundProps> = ({
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
        {round.matches.map((match: any, idx: number) => (
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
            // For winners bracket, always connect pairs
            if (idx % 2 === 0 && idx + 1 < matchCount) {
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

export default DoubleEliminationBracket
