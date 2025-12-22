'use client'
import React, { useEffect, useRef, useState } from 'react'
import { MatchFrontend, StageFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'
import LoserBracket from './LoserBracket'

interface DoubleEliminationBracketProps {
  stage: StageFrontend
}

type ConnectorPath = { id: string; d: string }

const DoubleEliminationBracket: React.FC<DoubleEliminationBracketProps> = ({
  stage,
}) => {
  const groups = stage.groups
  const winnersGroup = groups[0]
  const losersGroup = groups[1]
  const grandFinalGroup = groups[2]

  const containerRef = useRef<HTMLDivElement>(null)
  const [connections, setConnections] = useState<ConnectorPath[]>([])

  useEffect(() => {
    const computeConnections = () => {
      if (
        !containerRef.current ||
        !winnersGroup ||
        winnersGroup.rounds.length < 2
      ) {
        return
      }

      const containerRect = containerRef.current.getBoundingClientRect()
      const nextConnections: ConnectorPath[] = []

      // Build a map of all match elements by their data attributes
      const allMatchEls = containerRef.current.querySelectorAll(
        '[data-round][data-match]'
      )

      // For each round except the last, connect matches
      winnersGroup.rounds.forEach((round, roundIdx) => {
        if (roundIdx >= winnersGroup.rounds.length - 1) return

        round.matches.forEach((_: MatchFrontend, matchIdx: number) => {
          const childEl = containerRef.current?.querySelector(
            `[data-round="${roundIdx}"][data-match="${matchIdx}"]`
          ) as HTMLDivElement | null
          const parentMatchIdx = Math.floor(matchIdx / 2)
          const parentEl = containerRef.current?.querySelector(
            `[data-round="${roundIdx + 1}"][data-match="${parentMatchIdx}"]`
          ) as HTMLDivElement | null

          if (!childEl || !parentEl) return

          const childRect = childEl.getBoundingClientRect()
          const parentRect = parentEl.getBoundingClientRect()

          const startX = childRect.right - containerRect.left
          const startY =
            childRect.top - containerRect.top + childRect.height / 2
          const endX = parentRect.left - containerRect.left
          const endY =
            parentRect.top - containerRect.top + parentRect.height / 2
          const midX = startX + (endX - startX) / 2

          nextConnections.push({
            id: `${roundIdx}-${matchIdx}`,
            d: `M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`,
          })
        })
      })

      setConnections(nextConnections)
    }

    const timer = setTimeout(computeConnections, 150)
    window.addEventListener('resize', computeConnections)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', computeConnections)
    }
  }, [winnersGroup])

  return (
    <div className='w-full overflow-x-auto pb-8'>
      <div className='min-w-max space-y-12 p-4'>
        {/* Winners Bracket */}
        {winnersGroup && (
          <div>
            <h3 className='text-lg md:text-xl font-semibold mb-8'>
              Winners Bracket
            </h3>
            <div className='relative h-screen' ref={containerRef}>
              <svg
                className='pointer-events-none absolute inset-0 w-full h-full'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
              >
                {connections.map((conn) => (
                  <path
                    key={conn.id}
                    d={conn.d}
                    className='text-muted-foreground/60'
                    strokeLinecap='round'
                  />
                ))}
              </svg>

              <div className='flex gap-16 md:gap-20 h-full [--round-gap:4rem] md:[--round-gap:5rem] [--connector-inline:calc(var(--round-gap)_/_2)]'>
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
      className='flex flex-col relative h-full'
      style={{ marginRight: `${gapBetweenRounds}px` }}
    >
      {/* Round Label */}
      <div className='mb-4 text-center'>
        <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
          Round {roundIndex + 1}
        </h4>
      </div>

      {/* Matches with proper vertical spacing */}
      <div className='flex flex-col justify-around flex-1'>
        {round.matches.map((match: MatchFrontend, matchIdx: number) => (
          <div key={matchIdx} data-round={roundIndex} data-match={matchIdx}>
            <div className='w-48'>
              <MatchCard match={match} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoubleEliminationBracket
