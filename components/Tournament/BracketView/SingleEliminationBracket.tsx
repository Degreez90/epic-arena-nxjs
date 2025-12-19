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

  // Geometry constants - made more compact
  const cardHeight = 88 // Reduced from 104px
  const connectorOffset = 70 // Center of the divider (header: 26px + opponent1: 30px + 0.5px)
  const labelHeight = 36 // Reduced from 44px
  const baseGap = 20 // Reduced from 64px

  // Gap increases with each round, but more moderately
  const gap = baseGap * Math.pow(1.5, roundIndex)
  const matchBlock = cardHeight + gap

  return (
    <div className='flex flex-col relative'>
      {/* Round Label */}
      <div className='mb-6 text-center'>
        <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
          {roundNames[roundIndex] || `Round ${roundIndex + 1}`}
        </h4>
      </div>

      {/* Matches with Connectors */}
      <div className='flex flex-col' style={{ gap: `${gap}px` }}>
        {round.matches.map((match: MatchFrontend, idx: number) => (
          <div key={idx} className='relative'>
            <div className='w-48'>
              <MatchCard match={match} />
            </div>

            {/* Right Connector - horizontal dotted line to next round */}
            {roundIndex < totalRounds - 1 && (
              <div
                className='absolute left-full h-px border-t-2 border-dotted border-border'
                style={{ width: '1.5rem', top: `${connectorOffset}px` }}
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
            left: 'calc(100% + 1.5rem)',
            width: '1.5rem', // Balanced with right connector width
            height: '100%',
          }}
        >
          {round.matches.map((_: any, idx: number) => {
            if (idx % 2 === 0 && idx + 1 < matchCount) {
              // Calculate the exact position of each match's right connector
              // Position of match idx: labelHeight + idx * matchBlock
              // Plus connectorOffset from the top of the match card
              const match1Top = labelHeight + idx * matchBlock
              const match2Top = labelHeight + (idx + 1) * matchBlock

              const match1Anchor = match1Top + connectorOffset
              const match2Anchor = match2Top + connectorOffset

              // The vertical line should connect these two points
              // The horizontal line should start at the midpoint
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

export default SingleEliminationBracket
