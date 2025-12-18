'use client'
import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTournamentStore } from '@/store/useTournamentStore'
import { MatchFrontend } from '@/types/tournament/tournament'
import { tabs } from '@/components/Tournament/Match/MatchScoreAndDetailDialog'
import { Info, Edit } from 'lucide-react'

interface MatchCardProps {
  match: MatchFrontend
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { openMatchScoreEditDialog, tournamentData } = useTournamentStore()

  const matchCompleted = match.status === 2
  const matchRunning = match.status === 1
  const tournamentStatus = tournamentData?.status

  // Format participant name
  const getParticipantName = (participant: any) => {
    if (!participant) return 'TBD'
    if (participant.name?.includes('[BYE]')) return '(Bye)'
    return participant.name || 'No name'
  }

  const opponent1 = match.opponent1
  const opponent2 = match.opponent2

  // Check if participant is winner
  const isWinner = (participant: any) => {
    if (!matchCompleted || !participant) return false
    return participant.result === 'win'
  }

  return (
    <div
      className='relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className='w-48 bg-slate-800 border-slate-700 hover:border-slate-500 transition-all overflow-hidden'>
        {/* Header with Match Number and Status */}
        <div className='px-3 py-1.5 bg-slate-700/50 flex justify-between items-center border-b border-slate-600'>
          <span className='text-xs text-slate-300 font-medium'>
            Match {match.number}
          </span>
          <span
            className={`px-1.5 py-0.5 text-xs rounded ${
              matchCompleted
                ? 'bg-green-600 text-white'
                : matchRunning
                ? 'bg-yellow-500 text-black'
                : 'bg-slate-600 text-slate-300'
            }`}
          >
            {matchCompleted ? 'Done' : matchRunning ? 'Live' : 'Pending'}
          </span>
        </div>

        {/* Opponents */}
        <div className='relative'>
          {/* Opponent 1 */}
          <div
            className={`px-3 py-2 flex justify-between items-center transition-colors ${
              isWinner(opponent1)
                ? 'bg-primary text-primary-foreground'
                : 'bg-slate-700/30 text-slate-200'
            }`}
          >
            <span className='truncate text-sm'>
              {getParticipantName(opponent1)}
            </span>
            {opponent1?.score !== undefined && (
              <span className='ml-2 px-2 py-0.5 bg-slate-600 text-white text-xs font-mono rounded'>
                {opponent1.score}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className='h-px bg-slate-600' />

          {/* Opponent 2 */}
          <div
            className={`px-3 py-2 flex justify-between items-center transition-colors ${
              isWinner(opponent2)
                ? 'bg-primary text-primary-foreground'
                : 'bg-slate-700/30 text-slate-200'
            }`}
          >
            <span className='truncate text-sm'>
              {getParticipantName(opponent2)}
            </span>
            {opponent2?.score !== undefined && (
              <span className='ml-2 px-2 py-0.5 bg-slate-600 text-white text-xs font-mono rounded'>
                {opponent2.score}
              </span>
            )}
          </div>

          {/* Edit Score Overlay - Shows on hover */}
          {isHovered &&
            (tournamentStatus === 'inprogress' ||
              tournamentStatus === 'completed') && (
              <div className='absolute right-0 top-0 bottom-0 flex items-center pr-2 bg-gradient-to-l from-slate-800 via-slate-800/90 to-transparent'>
                <Button
                  size='sm'
                  variant='ghost'
                  className='h-7 px-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700'
                  onClick={() =>
                    openMatchScoreEditDialog(match, tabs.reportScore)
                  }
                >
                  <Edit className='h-3 w-3 mr-1' />
                  Edit
                </Button>
              </div>
            )}
        </div>
      </Card>

      {/* Info Button - Outside card on right */}
      {isHovered && (
        <div className='absolute -right-14 top-1/2 -translate-y-1/2'>
          <Button
            size='sm'
            variant='outline'
            className='h-8 w-8 p-0 bg-slate-800 border-slate-600 hover:bg-slate-700'
            onClick={() => openMatchScoreEditDialog(match, tabs.matchDetails)}
          >
            <Info className='h-4 w-4 text-slate-300' />
          </Button>
        </div>
      )}
    </div>
  )
}

export default MatchCard
