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
            <h3 className='text-lg md:text-xl font-semibold mb-8'>
              Winners Bracket
            </h3>
            <div className='flex gap-16 md:gap-20 [--round-gap:4rem] md:[--round-gap:5rem] [--connector-inline:calc(var(--round-gap)_/_2)]'>
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
          <div className='pt-12 border-t'>
            <h3 className='text-lg md:text-xl font-semibold mb-8'>
              Losers Bracket
            </h3>
            <div className='flex gap-16 md:gap-20 [--round-gap:4rem] md:[--round-gap:5rem] [--connector-inline:calc(var(--round-gap)_/_2)]'>
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
  const cardHeight = 104 // Adjusted to better match actual rendered height
  const connectorOffset = 64 // This aligns with the h-px bg-slate-600 divider in MatchCard (64px from top)
  const labelHeight = 44
  const baseGap = 40 // Increased for more space between rounds

  // Use same spacing calculation for both winner and loser brackets
  // Linear increase for gap to prevent excessive spacing
  const gap = baseGap + roundIndex * 130 // Adjusted to give more space while maintaining proper alignment
  const matchBlock = cardHeight + gap

  // Adjust vertical position for tapering effect
  // Increase offset for later rounds to create a downward taper
  // Adjusted to align horizontal line at 183.5 for round 2 match 1
  const roundVerticalOffset = roundIndex > 0 ? roundIndex * 75.5 : 0

  // Determine if this is a loser major round for connector logic
  const isLoserMajorRound = bracketType === 'loser' && roundIndex % 2 === 0

  return (
    <div className='flex flex-col relative'>
      {/* Round Label */}
      <div className='mb-6 text-center'>
        <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
          Round {roundIndex + 1}
        </h4>
      </div>

      {/* Matches with Connectors */}
      <div
        className='flex flex-col'
        style={{ gap: `${gap}px`, marginTop: `${roundVerticalOffset}px` }}
      >
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
            // For winners bracket and loser major rounds, connect pairs
            const shouldConnect = bracketType === 'winner' || isLoserMajorRound

            if (shouldConnect && idx % 2 === 0 && idx + 1 < matchCount) {
              // Align connectors to the divider inside each MatchCard without drift
              // The bottom of the vertical line needs to connect with the 2nd and 4th right connector
              // Add base correction to align horizontal line at 183.5
              const baseCorrection = 3.5
              const match1Anchor =
                labelHeight +
                idx * matchBlock +
                connectorOffset +
                roundVerticalOffset +
                baseCorrection
              const match2Anchor =
                labelHeight +
                (idx + 1) * matchBlock +
                connectorOffset +
                roundVerticalOffset +
                baseCorrection
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
