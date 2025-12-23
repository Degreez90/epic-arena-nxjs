'use client'
import React, { forwardRef } from 'react'
import { MatchFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'

interface LoserBracketProps {
  round: any
  roundIndex: number
  totalRounds: number
  attachMatchRef: (matchIndex: number) => (el: HTMLDivElement | null) => void
}

const LoserBracket = forwardRef<HTMLDivElement, LoserBracketProps>(
  ({ round, roundIndex, totalRounds, attachMatchRef }, ref) => {
    return (
      <div ref={ref} className='flex flex-col relative flex-1'>
        {/* Round Label */}
        <div className='mb-4 text-center'>
          <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
            Round {roundIndex + 1}
          </h4>
        </div>
        
        {/* Matches */}
        <div className='flex flex-col flex-1'>
          {round.matches.map((match: MatchFrontend, idx: number) => (
            <div 
              key={idx} 
              className='w-48 ml-0 mr-auto my-2'
              ref={attachMatchRef(idx)}
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
