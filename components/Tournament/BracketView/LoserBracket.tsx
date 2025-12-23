'use client'
import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { MatchFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'

interface LoserBracketProps {
  round: any
  roundIndex: number
  totalRounds: number
  attachMatchRef: (matchIndex: number) => (el: HTMLDivElement | null) => void
  connections?: Connection[]
}

interface Connection {
  startX: number
  startY: number
  endX: number
  endY: number
}

const LoserBracket = forwardRef<HTMLDivElement, LoserBracketProps>(
  ({ round, roundIndex, totalRounds, attachMatchRef, connections = [] }, ref) => {
    const matchRefs = useRef<Map<number, HTMLDivElement>>(new Map())

    // Attach ref to each match
    const internalAttachMatchRef = (matchIndex: number) => (el: HTMLDivElement | null) => {
      if (el) {
        matchRefs.current.set(matchIndex, el)
      } else {
        matchRefs.current.delete(matchIndex)
      }
      // Also call the parent's attachMatchRef to maintain compatibility
      attachMatchRef(matchIndex)(el)
    }

    return (
      <div ref={ref} className='flex flex-col relative flex-1'>
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
            <div 
              key={idx} 
              className='w-48 ml-0 mr-auto my-2'
              ref={internalAttachMatchRef(idx)}
            >
              <MatchCard match={match} />
            </div>
          ))}
        </div>
      </div>
    )
  }
)

LoserBracket.displayName = 'LoserBracket'

export default LoserBracket
