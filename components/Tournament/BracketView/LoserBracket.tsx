'use client'
import React, { useLayoutEffect, useMemo, useState } from 'react'
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

  // Measure actual match block positions so vertical connectors line up with the right connectors
  const matchRefs = useMemo(
    () => round.matches.map(() => React.createRef<HTMLDivElement>()),
    [round.matches.length]
  )
  const [anchorYs, setAnchorYs] = useState<number[]>([])

  // Geometry constants - consistent gap of 20px for all rounds
  const cardHeight = 88
  const connectorOffset = 44
  const labelHeight = 36
  const gap = 20 // Always 20px for loser bracket

  // Simple position calculation
  const getMatchTopPosition = (idx: number) => {
    return idx * (cardHeight + gap)
  }

  // Determine if this is a loser major round for connector logic
  const isLoserMajorRound = roundIndex % 2 === 0

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
        {round.matches.map((match: MatchFrontend, idx: number) => (
          <div
            key={idx}
            className='relative'
            ref={matchRefs[idx]}
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
              // Calculate the exact position of each match's right connector
              const matchBlock = cardHeight + gap
              const match1Top = labelHeight + idx * matchBlock
              const match2Top = labelHeight + (idx + 1) * matchBlock
              
              const fallbackMatch1Anchor = match1Top + connectorOffset
              const fallbackMatch2Anchor = match2Top + connectorOffset
              const fallbackMidPoint = (fallbackMatch1Anchor + fallbackMatch2Anchor) / 2

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

export default LoserBracket
