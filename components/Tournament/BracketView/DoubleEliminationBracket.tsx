'use client'
import React, { useLayoutEffect, useMemo, useState } from 'react'
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

  // Measure actual match block positions so vertical connectors line up with the right connectors
  const matchRefs = useMemo(
    () => round.matches.map(() => React.createRef<HTMLDivElement>()),
    [round.matches.length]
  )
  const [anchorYs, setAnchorYs] = useState<number[]>([])

  // Geometry constants tuned to the MatchCard layout
  const cardHeight = 104 // Adjusted to better match actual rendered height
  const connectorOffset = 70 // Aligns to the divider inside MatchCard
  const labelHeight = 44
  const baseGap = 64 // Consistent gap between matches in all rounds

  // Use a consistent gap for all rounds
  const gap = baseGap
  
  // No offset needed
  const firstMatchOffset = 0

  // Compute Y position for match at index
  const getMatchTopPosition = (idx: number) => {
    let top = 0
    if (idx > 0) {
      top = idx * (cardHeight + gap)
    }
    // Add margin for first match starting from round 2
    if (idx === 0 && roundIndex >= 1) {
      top += 140 * Math.pow(2, roundIndex - 1)
    }
    return top
  }

  // For vertical connector anchors
  const computeOffsetForIndex = (idx: number) => {
    return labelHeight + getMatchTopPosition(idx)
  }

  // Determine if this is a loser major round for connector logic
  const isLoserMajorRound = bracketType === 'loser' && roundIndex % 2 === 0

  useLayoutEffect(() => {
    const ys = matchRefs.map((ref: React.RefObject<HTMLDivElement>) => {
      if (!ref.current) return undefined
      // OffsetTop is relative to the round container; add connectorOffset to reach the right connector anchor
      return ref.current.offsetTop + connectorOffset
    })
    setAnchorYs(ys as number[])
  }, [matchRefs, connectorOffset])

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
        {round.matches.map((match: MatchFrontend, idx: number) => {
          // Calculate margin for first match starting from round 2
          let marginTop = 0
          if (idx === 0 && roundIndex >= 1) {
            // For round 2 (index 1): 140px
            // For round 3 (index 2): 280px (140 * 2)
            // For round 4 (index 3): 560px (140 * 4)
            marginTop = 140 * Math.pow(2, roundIndex - 1)
          }
          
          return (
            <div
              key={idx}
              className='relative'
              ref={matchRefs[idx]}
              style={{ marginTop: `${marginTop}px` }}
            >
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
          )
        })}
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
              // The top of the vertical line should connect with the end of the right connector of match idx
              // The bottom of the vertical line should connect with the end of the right connector of match idx+1
              const fallbackMatch1Anchor =
                computeOffsetForIndex(idx) + connectorOffset
              const fallbackMatch2Anchor =
                computeOffsetForIndex(idx + 1) + connectorOffset

              const match1Anchor = anchorYs[idx] ?? fallbackMatch1Anchor
              const match2Anchor = anchorYs[idx + 1] ?? fallbackMatch2Anchor
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
