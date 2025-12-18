'use client'
import React from 'react'
import { StageFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'

interface RoundRobinBracketProps {
  stage: StageFrontend
}

const RoundRobinBracket: React.FC<RoundRobinBracketProps> = ({ stage }) => {
  return (
    <div className='w-full p-2 md:p-4'>
      <div className='space-y-8'>
        {stage.groups.map((group, groupIdx) => (
          <div key={groupIdx} className='space-y-6'>
            <h3 className='text-lg md:text-xl font-semibold'>
              Group {String.fromCharCode(65 + groupIdx)}
            </h3>
            <div className='space-y-6'>
              {group.rounds.map((round, roundIdx) => (
                <div key={roundIdx} className='space-y-3'>
                  <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide border-b pb-2'>
                    Round {roundIdx + 1}
                  </h4>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'>
                    {round.matches.map((match, idx) => (
                      <MatchCard key={idx} match={match} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoundRobinBracket
