'use client'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { MatchFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'

interface LoserBracketProps {
  round: any
  roundIndex: number
  totalRounds: number
}

interface Connection {
  startX: number
  startY: number
  endX: number
  endY: number
}

const LoserBracket: React.FC<LoserBracketProps> = ({
  round,
  roundIndex,
  totalRounds,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const matchRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const [connections, setConnections] = useState<Connection[]>([])

  // Attach ref to each match
  const attachMatchRef = (matchIndex: number) => (el: HTMLDivElement | null) => {
    if (el) {
      matchRefs.current.set(matchIndex, el)
    } else {
      matchRefs.current.delete(matchIndex)
    }
  }

  // Compute connections for the next round
  useLayoutEffect(() => {
    // We need to connect to matches in the next round, but since each LoserBracket is separate,
    // we'll handle connections within the same bracket
    // For now, we'll focus on positioning within this round
    // The parent component will handle connections between rounds
    setConnections([])
  }, [round, roundIndex])

  return (
    <div className='flex flex-col relative flex-1' ref={containerRef}>
      {/* Round Label */}
      <div className='mb-4 text-center'>
        <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
          Round {roundIndex + 1}
        </h4>
      </div>
      
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
      
      {/* Matches */}
      <div className='flex flex-col flex-1 relative z-10'>
        {round.matches.map((match: MatchFrontend, idx: number) => (
          <div key={idx} className='w-48 ml-0 mr-auto my-2' ref={attachMatchRef(idx)}>
            <MatchCard match={match} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default LoserBracket
