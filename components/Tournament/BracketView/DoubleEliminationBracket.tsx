'use client'
import React from 'react'
import { StageFrontend, MatchFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'

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
            <h3 className='text-lg md:text-xl font-semibold mb-6'>
              Winners Bracket
            </h3>
            <div className='flex gap-12 md:gap-16'>
              {winnersGroup.rounds.map((round, roundIdx) => (
                <BracketRound
                  key={roundIdx}
                  round={round}
                  roundIndex={roundIdx}
                  totalRounds={winnersGroup.rounds.length}
                  bracketType='winner'
                />
              ))}
            </div>
          </div>
        )}

        {/* Losers Bracket */}
        {losersGroup && (
          <div className='pt-8 border-t'>
            <h3 className='text-lg md:text-xl font-semibold mb-6'>
              Losers Bracket
            </h3>
            <div className='flex gap-12 md:gap-16'>
              {losersGroup.rounds.map((round, roundIdx) => (
                <BracketRound
                  key={roundIdx}
                  round={round}
                  roundIndex={roundIdx}
                  totalRounds={losersGroup.rounds.length}
                  bracketType='loser'
                />
              ))}
            </div>
          </div>
        )}

        {/* Grand Final */}
        {grandFinalGroup && grandFinalGroup.rounds[0] && (
          <div className='pt-8 border-t'>
            <h3 className='text-lg md:text-xl font-semibold mb-6 text-center'>
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

interface BracketRoundProps {
  round: any
  roundIndex: number
  totalRounds: number
  bracketType: 'winner' | 'loser'
}

const BracketRound: React.FC<BracketRoundProps> = ({
  round,
  roundIndex,
  totalRounds,
  bracketType,
}) => {
  const matchCount = round.matches.length

  // Geometry constants tuned to the MatchCard layout
  const cardHeight = 102
  const connectorOffset = 70
  const labelHeight = 44
  const baseGap = 28

  // Losers bracket has alternating patterns
  const isLoserMajorRound = bracketType === 'loser' && roundIndex % 2 === 0
  const spacingMultiplier =
    bracketType === 'winner'
      ? Math.pow(2, roundIndex)
      : isLoserMajorRound
      ? Math.pow(2, Math.floor(roundIndex / 2))
      : Math.pow(2, Math.floor(roundIndex / 2))

  const gap = Math.max(baseGap, cardHeight * (spacingMultiplier - 1))
  const matchBlock = cardHeight + gap

  return (
    <div className='flex flex-col relative'>
      {/* Round Label */}
      <div className='mb-6 text-center'>
        <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
          Round {roundIndex + 1}
        </h4>
      </div>

      {/* Matches with Connectors */}
      <div className='flex flex-col' style={{ gap: `${gap}px` }}>
        {round.matches.map((match: MatchFrontend, idx: number) => (
          <div key={idx} className='relative'>
            <div className='w-48'>
              <MatchCard match={match} />
            </div>

            {/* Right Connector - horizontal dotted line */}
            {roundIndex < totalRounds - 1 && (
              <div
                className='absolute left-full h-px border-t-2 border-dotted border-border'
                style={{ width: '1.5rem', top: `${connectorOffset}px` }}
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
            left: 'calc(100% + 1.5rem)',
            width: '1.5rem',
            height: '100%',
          }}
        >
          {round.matches.map((_: any, idx: number) => {
            // For winners bracket and loser major rounds, connect pairs
            const shouldConnect = bracketType === 'winner' || isLoserMajorRound

            if (shouldConnect && idx % 2 === 0 && idx + 1 < matchCount) {
              // Align connectors to the divider inside each MatchCard
              const match1Anchor =
                labelHeight + idx * matchBlock + connectorOffset
              const match2Anchor =
                labelHeight + (idx + 1) * matchBlock + connectorOffset
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
