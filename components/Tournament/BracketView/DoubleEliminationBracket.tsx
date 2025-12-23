'use client'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { StageFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'
import LoserBracket from './LoserBracket'

interface DoubleEliminationBracketProps {
  stage: StageFrontend
}

interface Connection {
  startX: number
  startY: number
  endX: number
  endY: number
}

const DoubleEliminationBracket: React.FC<DoubleEliminationBracketProps> = ({
  stage,
}) => {
  const groups = stage.groups
  const winnersGroup = groups[0]
  const losersGroup = groups[1]
  const grandFinalGroup = groups[2]

  // Refs for measuring positions
  const winnersContainerRef = useRef<HTMLDivElement>(null)
  const losersContainerRef = useRef<HTMLDivElement>(null)
  const matchRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // State for connections
  const [winnersConnections, setWinnersConnections] = useState<Connection[]>([])
  const [losersConnections, setLosersConnections] = useState<Connection[]>([])

  // Function to attach ref to each match
  const attachMatchRef =
    (groupType: string, roundIndex: number, matchIndex: number) =>
    (el: HTMLDivElement | null) => {
      if (el) {
        matchRefs.current.set(`${groupType}:${roundIndex}:${matchIndex}`, el)
      } else {
        matchRefs.current.delete(`${groupType}:${roundIndex}:${matchIndex}`)
      }
    }

  // Compute winners bracket connections
  useLayoutEffect(() => {
    if (!winnersContainerRef.current || !winnersGroup) {
      setWinnersConnections([])
      return
    }

    const containerRect = winnersContainerRef.current.getBoundingClientRect()
    const newConnections: Connection[] = []

    const rounds = winnersGroup.rounds
    for (let roundIndex = 0; roundIndex < rounds.length - 1; roundIndex++) {
      const currentRound = rounds[roundIndex]
      const nextRound = rounds[roundIndex + 1]

      if (!currentRound || !nextRound) continue

      for (
        let matchIndex = 0;
        matchIndex < currentRound.matches.length;
        matchIndex++
      ) {
        const childKey = `winners:${roundIndex}:${matchIndex}`
        const parentMatchIndex = Math.floor(matchIndex / 2)
        const parentKey = `winners:${roundIndex + 1}:${parentMatchIndex}`

        const childEl = matchRefs.current.get(childKey)
        const parentEl = matchRefs.current.get(parentKey)

        if (childEl && parentEl) {
          const childRect = childEl.getBoundingClientRect()
          const parentRect = parentEl.getBoundingClientRect()

          const startX = childRect.right - containerRect.left
          const startY =
            childRect.top + childRect.height / 2 - containerRect.top
          const endX = parentRect.left - containerRect.left
          const endY =
            parentRect.top + parentRect.height / 2 - containerRect.top

          newConnections.push({ startX, startY, endX, endY })
        }
      }
    }

    setWinnersConnections(newConnections)
  }, [winnersGroup])

  // Compute losers bracket connections
  useLayoutEffect(() => {
    if (!losersContainerRef.current || !losersGroup) {
      setLosersConnections([])
      return
    }

    const containerRect = losersContainerRef.current.getBoundingClientRect()
    const newConnections: Connection[] = []

    const rounds = losersGroup.rounds
    for (let roundIndex = 0; roundIndex < rounds.length - 1; roundIndex++) {
      const currentRound = rounds[roundIndex]
      const nextRound = rounds[roundIndex + 1]

      if (!currentRound || !nextRound) continue

      for (
        let matchIndex = 0;
        matchIndex < currentRound.matches.length;
        matchIndex++
      ) {
        const childKey = `losers:${roundIndex}:${matchIndex}`

        // Determine parent match index based on progression logic
        let parentMatchIndex
        if (nextRound.matches.length === currentRound.matches.length) {
          parentMatchIndex = matchIndex
        } else if (
          nextRound.matches.length ===
          currentRound.matches.length / 2
        ) {
          parentMatchIndex = Math.floor(matchIndex / 2)
        } else {
          // Default to same index if no clear pattern
          parentMatchIndex = matchIndex
        }

        const parentKey = `losers:${roundIndex + 1}:${parentMatchIndex}`

        const childEl = matchRefs.current.get(childKey)
        const parentEl = matchRefs.current.get(parentKey)

        if (childEl && parentEl) {
          const childRect = childEl.getBoundingClientRect()
          const parentRect = parentEl.getBoundingClientRect()

          // Both startY and endY should be at the vertical center of their respective cards
          const startX = childRect.right - containerRect.left
          const startY =
            childRect.top + childRect.height / 2 - containerRect.top
          const endX = parentRect.left - containerRect.left
          const endY =
            parentRect.top + parentRect.height / 2 - containerRect.top

          newConnections.push({ startX, startY, endX, endY })
        }
      }
    }

    setLosersConnections(newConnections)
  }, [losersGroup])

  // Handle window resize for winners bracket
  useLayoutEffect(() => {
    const handleResize = () => {
      if (!winnersContainerRef.current || !winnersGroup) return

      const containerRect = winnersContainerRef.current.getBoundingClientRect()
      const newConnections: Connection[] = []

      const rounds = winnersGroup.rounds
      for (let roundIndex = 0; roundIndex < rounds.length - 1; roundIndex++) {
        const currentRound = rounds[roundIndex]
        const nextRound = rounds[roundIndex + 1]

        if (!currentRound || !nextRound) continue

        for (
          let matchIndex = 0;
          matchIndex < currentRound.matches.length;
          matchIndex++
        ) {
          const childKey = `winners:${roundIndex}:${matchIndex}`
          const parentMatchIndex = Math.floor(matchIndex / 2)
          const parentKey = `winners:${roundIndex + 1}:${parentMatchIndex}`

          const childEl = matchRefs.current.get(childKey)
          const parentEl = matchRefs.current.get(parentKey)

          if (childEl && parentEl) {
            const childRect = childEl.getBoundingClientRect()
            const parentRect = parentEl.getBoundingClientRect()

            const startX = childRect.right - containerRect.left
            const startY =
              childRect.top + childRect.height / 2 - containerRect.top
            const endX = parentRect.left - containerRect.left
            const endY =
              parentRect.top + parentRect.height / 2 - containerRect.top

            newConnections.push({ startX, startY, endX, endY })
          }
        }
      }

      setWinnersConnections(newConnections)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [winnersGroup])

  // Handle window resize for losers bracket
  useLayoutEffect(() => {
    const handleResize = () => {
      if (!losersContainerRef.current || !losersGroup) return

      const containerRect = losersContainerRef.current.getBoundingClientRect()
      const newConnections: Connection[] = []

      const rounds = losersGroup.rounds
      for (let roundIndex = 0; roundIndex < rounds.length - 1; roundIndex++) {
        const currentRound = rounds[roundIndex]
        const nextRound = rounds[roundIndex + 1]

        if (!currentRound || !nextRound) continue

        for (
          let matchIndex = 0;
          matchIndex < currentRound.matches.length;
          matchIndex++
        ) {
          const childKey = `losers:${roundIndex}:${matchIndex}`

          // Determine parent match index based on progression logic
          let parentMatchIndex
          if (nextRound.matches.length === currentRound.matches.length) {
            parentMatchIndex = matchIndex
          } else if (
            nextRound.matches.length ===
            currentRound.matches.length / 2
          ) {
            parentMatchIndex = Math.floor(matchIndex / 2)
          } else {
            parentMatchIndex = matchIndex
          }

          const parentKey = `losers:${roundIndex + 1}:${parentMatchIndex}`

          const childEl = matchRefs.current.get(childKey)
          const parentEl = matchRefs.current.get(parentKey)

          if (childEl && parentEl) {
            const childRect = childEl.getBoundingClientRect()
            const parentRect = parentEl.getBoundingClientRect()

            const startX = childRect.right - containerRect.left
            const startY =
              childRect.top + childRect.height / 2 - containerRect.top
            const endX = parentRect.left - containerRect.left
            const endY =
              parentRect.top + parentRect.height / 2 - containerRect.top

            newConnections.push({ startX, startY, endX, endY })
          }
        }
      }

      setLosersConnections(newConnections)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [losersGroup])

  return (
    <div className='w-full overflow-x-auto pb-8'>
      <div className='min-w-max space-y-8 p-2 min-h-[800px]'>
        {/* Winners Bracket */}
        {winnersGroup && (
          <div className='relative min-h-[600px]' ref={winnersContainerRef}>
            <h3 className='text-lg md:text-xl font-semibold mb-8'>
              Winners Bracket
            </h3>
            {/* SVG overlay for connector lines */}
            <svg
              className='absolute inset-0 pointer-events-none z-0'
              width='100%'
              height='100%'
            >
              {winnersConnections.map((conn, idx) => {
                const midX = conn.startX + (conn.endX - conn.startX) / 2
                const d = `M ${conn.startX} ${conn.startY} H ${midX} V ${conn.endY} H ${conn.endX}`
                return (
                  <path
                    key={idx}
                    d={d}
                    stroke='currentColor'
                    strokeWidth={2}
                    fill='none'
                    strokeDasharray='4 4'
                    className='text-muted-foreground/50'
                  />
                )
              })}
            </svg>
            {/* Match cards container */}
            <div className='relative flex gap-2 md:gap-3 z-10 items-stretch'>
              {winnersGroup.rounds.map((round, roundIdx) => (
                <div key={roundIdx} className='flex flex-col flex-1'>
                  {/* Round Label */}
                  <div className='mb-4 text-center'>
                    <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
                      Round {roundIdx + 1}
                    </h4>
                  </div>
                  {/* Matches container with equal height and space-around distribution */}
                  <div className='flex flex-col justify-around flex-1'>
                    {round.matches.map((match, matchIdx) => (
                      <div
                        key={matchIdx}
                        className='w-48 ml-0 mr-auto my-2'
                        ref={attachMatchRef('winners', roundIdx, matchIdx)}
                      >
                        <MatchCard match={match} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Losers Bracket */}
        {losersGroup && (
          <div className='pt-12 border-t relative' ref={losersContainerRef}>
            <h3 className='text-lg md:text-xl font-semibold mb-8'>
              Losers Bracket
            </h3>
            {/* SVG overlay for loser bracket connector lines */}
            <svg
              className='absolute inset-0 pointer-events-none z-0'
              width='100%'
              height='100%'
            >
              {losersConnections.map((conn, idx) => {
                // We use the startX to determine which round we are in
                // and stagger the vertical line so they don't overlap.
                const stagger = 15
                const elbowX = conn.startX + stagger

                // Use a 'C' (Curve) or 'L' (Line). 'L' is cleaner for brackets.
                const d = `M ${conn.startX} ${conn.startY} 
            L ${elbowX} ${conn.startY} 
            L ${elbowX} ${conn.endY} 
            L ${conn.endX} ${conn.endY}`

                return (
                  <path
                    key={idx}
                    d={d}
                    stroke='currentColor'
                    strokeWidth={1.5} // Slightly thinner looks more premium
                    fill='none'
                    strokeDasharray='4 2' // Tighter dots look cleaner than 4 4
                    className='text-muted-foreground/40'
                  />
                )
              })}
            </svg>
            <div className='relative flex gap-2 md:gap-3 z-10'>
              {losersGroup.rounds.map((round, roundIdx) => (
                <LoserBracket
                  key={roundIdx}
                  ref={null}
                  round={round}
                  roundIndex={roundIdx}
                  totalRounds={losersGroup.rounds.length}
                  attachMatchRef={(matchIdx) =>
                    attachMatchRef('losers', roundIdx, matchIdx)
                  }
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

export default DoubleEliminationBracket
