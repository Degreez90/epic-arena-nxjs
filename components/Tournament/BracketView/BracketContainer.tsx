'use client'
import React, { useState } from 'react'
import { StageFrontend } from '@/types/tournament/tournament'
import SingleEliminationBracket from './SingleEliminationBracket'
import DoubleEliminationBracket from './DoubleEliminationBracket'
import RoundRobinBracket from './RoundRobinBracket'
import { Card } from '@/components/ui/card'

interface BracketContainerProps {
  stage: StageFrontend
  tournamentName: string
}

const BracketContainer: React.FC<BracketContainerProps> = ({
  stage,
  tournamentName,
}) => {
  const [viewMode, setViewMode] = useState<'bracket' | 'table'>('bracket')

  return (
    <div className='w-full space-y-4'>
      {/* Header */}
      <div className='space-y-2'>
        <h2 className='text-2xl md:text-3xl font-bold'>{tournamentName}</h2>
        <div className='flex gap-2'>
          <button
            onClick={() => setViewMode('bracket')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition ${
              viewMode === 'bracket'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Bracket View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition ${
              viewMode === 'table'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Standings
          </button>
        </div>
      </div>

      {/* Bracket Content */}
      <div className='w-full overflow-x-auto'>
        {viewMode === 'bracket' ? (
          <>
            {stage.type === 'single_elimination' && (
              <SingleEliminationBracket stage={stage} />
            )}
            {stage.type === 'double_elimination' && (
              <DoubleEliminationBracket stage={stage} />
            )}
            {stage.type === 'round_robin' && (
              <RoundRobinBracket stage={stage} />
            )}
          </>
        ) : (
          <div className='p-4 text-center text-muted-foreground'>
            Standings view coming soon
          </div>
        )}
      </div>
    </div>
  )
}

export default BracketContainer
