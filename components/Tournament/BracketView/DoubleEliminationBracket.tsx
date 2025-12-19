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

  // Geometry constants - made consistent with SingleEliminationBracket
  const cardHeight = 88 // Reduced from 104px
  const connectorOffset = 70 // Center of the divider (matches SingleEliminationBracket)
  const labelHeight = 36 // Reduced from 44px
  const baseGap = 20 // Reduced from 64px

  // Gap increases with each round, matching SingleEliminationBracket
  const gap = baseGap * Math.pow(1.5, roundIndex)

  return (
    <div className='flex flex-col relative'>
      {/* Round Label */}
      <div className='mb-6 text-center'>
        <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
          Round {roundIndex + 1}
        </h4>
      </div>

      {/* Matches with Connectors */}
      <div className='flex flex-col relative' style={{ gap: `${gap}px` }}>
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
              // Calculate the exact position of each match's right connector
              const matchBlock = cardHeight + gap
              const match1Top = labelHeight + idx * matchBlock
              const match2Top = labelHeight + (idx + 1) * matchBlock

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
