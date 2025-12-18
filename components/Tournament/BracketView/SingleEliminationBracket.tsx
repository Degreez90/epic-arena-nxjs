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

  // Geometry constants tuned to the MatchCard layout
  const cardHeight = 102 // header + opponents + divider
  const connectorOffset = 68 // vertical offset to the divider inside the card (matches h-px bg-slate-600)
  const labelHeight = 44 // round label height + margin bottom
  const baseGap = 28 // minimum gap between matches in the same round

  // Calculate vertical spacing based on round progression with tapering
  const spacingMultiplier = Math.pow(2, roundIndex)
  const gap = Math.max(baseGap, cardHeight * (spacingMultiplier - 1))
  const matchBlock = cardHeight + gap
  
  // Adjust vertical position for tapering effect: each subsequent round is shifted down
  const roundVerticalOffset = roundIndex > 0 ? roundIndex * 40 : 0

  return (
    <div className='flex flex-col relative'>
      {/* Round Label */}
      <div className='mb-6 text-center'>
        <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
          {roundNames[roundIndex] || `Round ${roundIndex + 1}`}
        </h4>
      </div>

      {/* Matches with Connectors */}
      <div className='flex flex-col' style={{ gap: `${gap}px`, marginTop: `${roundVerticalOffset}px` }}>
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
            width: '1.5rem',
            height: '100%',
          }}
        >
          {round.matches.map((_: any, idx: number) => {
            if (idx % 2 === 0 && idx + 1 < matchCount) {
              // Align connectors to the divider inside each MatchCard
              const match1Anchor =
                labelHeight + idx * matchBlock + connectorOffset + roundVerticalOffset
              const match2Anchor =
                labelHeight + (idx + 1) * matchBlock + connectorOffset + roundVerticalOffset
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
