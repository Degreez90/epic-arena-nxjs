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
            <div className='flex flex-row gap-16 md:gap-20 [--round-gap:4rem] md:[--round-gap:5rem] [--connector-inline:calc(var(--round-gap)_/_2)]'>
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

  // Calculate gap between matches to create proper tournament bracket spacing
  // Round 1: 20px (as requested)
  // Each subsequent round doubles the gap to align with previous round's matches
  const baseGap = 20
  const gapBetweenMatches = baseGap * Math.pow(2, roundIndex)

  const gapBetweenRounds = 64 // Fixed gap between rounds
  const cardHeight = 88 // Height of match card

  return (
    <div
      className='flex flex-col relative'
      style={{ marginRight: `${gapBetweenRounds}px` }}
    >
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
            {/* Right Connector - horizontal dotted line to next round */}
            {roundIndex < totalRounds - 1 && (
              <div
                className='absolute left-full top-1/2 -translate-y-1/2 h-px border-t-2 border-dotted border-border'
                style={{ width: `${gapBetweenRounds}px` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Vertical Connectors between match pairs */}
      {roundIndex < totalRounds - 1 && (
        <svg
          className='absolute top-0 pointer-events-none'
          style={{
            left: `calc(100% + ${gapBetweenRounds}px)`,
            width: `${gapBetweenRounds}px`,
            height: '100%',
          }}
        >
          {round.matches.map((_: any, idx: number) => {
            if (idx % 2 === 0 && idx + 1 < matchCount) {
              // Calculate positions for the two matches to connect
              const match1Top = idx * (cardHeight + gapBetweenMatches)
              const match2Top = (idx + 1) * (cardHeight + gapBetweenMatches)
              
              // Center points of each match card
              const match1Center = match1Top + cardHeight / 2
              const match2Center = match2Top + cardHeight / 2
              
              // Midpoint between the two matches
              const midPoint = (match1Center + match2Center) / 2

              return (
                <g key={idx}>
                  {/* Vertical dotted line connecting two matches */}
                  <line
                    x1='0'
                    y1={match1Center}
                    x2='0'
                    y2={match2Center}
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
