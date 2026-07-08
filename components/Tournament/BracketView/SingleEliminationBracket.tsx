'use client'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { StageFrontend, MatchFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'

interface SingleEliminationBracketProps {
  stage: StageFrontend
}

interface Connection {
  startX: number
  startY: number
  endX: number
  endY: number
}

const SingleEliminationBracket: React.FC<SingleEliminationBracketProps> = ({
  stage,
}) => {
  const mainGroup = stage.groups[0]
  const consolationGroup = stage.groups[1]
  const isConsolationPresent = stage.settings?.consolationFinal

  const containerRef = useRef<HTMLDivElement>(null)
  const matchRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [connections, setConnections] = useState<Connection[]>([])

  // Attach ref to each match
  const attachMatchRef =
    (roundIndex: number, matchIndex: number) => (el: HTMLDivElement | null) => {
      const key = `${roundIndex}:${matchIndex}`
      if (el) {
        matchRefs.current.set(key, el)
      } else {
        matchRefs.current.delete(key)
      }
    }

  // Compute connections using actual DOM positions
  const computeConnections = () => {
    if (!containerRef.current || !mainGroup) {
      setConnections([])
      return
    }

    const containerRect = containerRef.current.getBoundingClientRect()
    const newConnections: Connection[] = []

    const rounds = mainGroup.rounds
    for (let roundIndex = 0; roundIndex < rounds.length - 1; roundIndex++) {
      const currentRound = rounds[roundIndex]
      const nextRound = rounds[roundIndex + 1]

      if (!currentRound || !nextRound) continue

      for (
        let matchIndex = 0;
        matchIndex < currentRound.matches.length;
        matchIndex++
      ) {
        const childKey = `${roundIndex}:${matchIndex}`
        const parentMatchIndex = Math.floor(matchIndex / 2)
        const parentKey = `${roundIndex + 1}:${parentMatchIndex}`

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

    setConnections(newConnections)
  }

  // Initial computation
  useLayoutEffect(() => {
    computeConnections()
  }, [mainGroup])

  // Handle window resize
  useLayoutEffect(() => {
    window.addEventListener('resize', computeConnections)
    return () => window.removeEventListener('resize', computeConnections)
  }, [mainGroup])

  const roundNames = ['Round 1', 'Round 2', 'Semifinals', 'Finals']

  return (
    <div className='w-full overflow-x-auto pb-8'>
      <div className='relative min-h-[600px] p-4' ref={containerRef}>
        {/* SVG overlay for connector lines */}
        <svg
          className='absolute inset-0 pointer-events-none z-0'
          width='100%'
          height='100%'
        >
          {connections.map((conn, idx) => {
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
          {mainGroup.rounds.map((round, roundIdx) => (
            <div key={roundIdx} className='flex flex-col flex-1'>
              {/* Round Label */}
              <div className='mb-4 text-center'>
                <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
                  {roundNames[roundIdx] || `Round ${roundIdx + 1}`}
                </h4>
              </div>
              {/* Matches container with tree layout */}
              <div className='flex flex-col justify-around flex-1'>
                {round.matches.map((match: MatchFrontend, matchIdx: number) => (
                  <div
                    key={matchIdx}
                    className='w-48 ml-0 mr-auto my-2'
                    ref={attachMatchRef(roundIdx, matchIdx)}
                  >
                    <MatchCard match={match} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
  )
}

export default SingleEliminationBracket
