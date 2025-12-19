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
  const cardHeight = 104 // header + opponents + divider - adjusted to better match actual rendered height
  const connectorOffset = 56 // vertical offset to the divider inside the card (matches h-px bg-slate-600) - adjusted from 80px to 56px
  const labelHeight = 44 // round label height + margin bottom
  const baseGap = 64 // consistent gap between matches in all rounds

  // Gap doubles each round: round 1: 64px, round 2: 108px, round 3: 216px, etc.
  const gap = roundIndex === 0 ? baseGap : 108 * Math.pow(2, roundIndex - 1)
  const matchBlock = cardHeight + gap
  
  // No vertical offset needed
  const roundVerticalOffset = 0

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
        {round.matches.map((match: MatchFrontend, idx: number) => {
          // Calculate margin for first match starting from round 2
          let marginTop = 0
          if (idx === 0 && roundIndex >= 1) {
            // Use the gap value which doubles each round
            marginTop = gap
          }
          
          return (
            <div 
              key={idx} 
              className='relative'
              style={{ marginTop: `${marginTop}px` }}
            >
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
          )
        })}
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
              // Calculate positions with margins
              const getMatchTop = (index: number) => {
                // Base position
                let top = index * matchBlock
                // Add margin for first match starting from round 2
                if (index === 0 && roundIndex >= 1) {
                  top += gap
                }
                return top
              }
              
              const match1Anchor = labelHeight + getMatchTop(idx) + connectorOffset
              const match2Anchor = labelHeight + getMatchTop(idx + 1) + connectorOffset
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
