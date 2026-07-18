'use client'
import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTournamentStore } from '@/store/useTournamentStore'
import { MatchFrontend } from '@/types/tournament/tournament'
import { tabs } from '@/components/Tournament/Match/MatchScoreAndDetailDialog'
import { Edit } from 'lucide-react'
import type { MatchGame } from 'brackets-model'

interface MatchCardProps {
  match: MatchFrontend
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { openMatchScoreEditDialog, tournamentData } = useTournamentStore()

  const matchCompleted = match.status === 4 // Status.Completed
  const matchRunning = match.status === 3   // Status.Running
  const tournamentStatus = tournamentData?.status

  // Calculate best-of series state from match_games
  const seriesState = useMemo(() => {
    const childCount = match.child_count ?? 0
    if (childCount === 0) return null

    const matchGames =
      (tournamentData?.match_games as MatchGame[] | undefined) ?? []
    const games = matchGames.filter((g) => g.parent_id === match.id)

    let op1Wins = 0
    let op2Wins = 0
    let completed = 0

    for (const game of games) {
      if (game.status === 4) { // Status.Completed
        completed++
        if ((game.opponent1?.score ?? 0) > (game.opponent2?.score ?? 0)) {
          op1Wins++
        } else if (
          (game.opponent2?.score ?? 0) > (game.opponent1?.score ?? 0)
        ) {
          op2Wins++
        }
      }
    }

    return { total: childCount, op1Wins, op2Wins, completed }
  }, [match.child_count, match.id, tournamentData?.match_games])

  // Format participant name
  const getParticipantName = (participant: any) => {
    if (!participant) return ''
    if (participant.name?.toLowerCase().includes('bye')) return '(Bye)'
    return participant.name || ''
  }

  const opponent1 = match.opponent1
  const opponent2 = match.opponent2

  // Check if an opponent is a BYE (by brackets-manager convention)
  // BYE participants have names like "[BYE 1]", "Bye", "Bye 1"]
  const isByeParticipant = (participant: any) => {
    if (!participant) return false
    const name = (participant.name || '').toLowerCase()
    return name.includes('bye')
  }

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
          <div className='flex items-center gap-1'>
            {/* Auto-resolved BYE indicator */}
            {matchCompleted &&
              (isByeParticipant(opponent1) || isByeParticipant(opponent2)) && (
                <span className='px-1 py-0.5 text-xs rounded bg-purple-600 text-white font-medium'>
                  Auto
                </span>
              )}
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
        </div>

        {/* Opponents */}
        <div className='relative'>
          {/* Opponent 1 */}
          <div
            className={`px-3 py-2 flex justify-between items-center transition-colors bg-slate-700/30 text-slate-200`}
          >
            <span className='truncate text-sm'>
              {getParticipantName(opponent1)}
            </span>
            {!isByeParticipant(opponent1) && opponent1?.id != null && (
              <span className='ml-2 px-2 py-0.5 bg-slate-600 text-white text-xs font-mono rounded'>
                {opponent1?.score ?? 0}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className='h-px bg-slate-600' />

          {/* Opponent 2 */}
          <div
            className={`px-3 py-2 flex justify-between items-center transition-colors bg-slate-700/30 text-slate-200`}
          >
            <span className='truncate text-sm'>
              {getParticipantName(opponent2)}
            </span>
            {!isByeParticipant(opponent2) && opponent2?.id != null && (
              <span className='ml-2 px-2 py-0.5 bg-slate-600 text-white text-xs font-mono rounded'>
                {opponent2?.score ?? 0}
              </span>
            )}
          </div>

          {/* Best-of series progress indicator */}
          {seriesState && (
            <div className='px-3 py-1 bg-slate-700/50 border-t border-slate-600'>
              <div className='flex items-center justify-between gap-1'>
                <span className='text-[10px] text-slate-400 font-medium'>
                  Bo{seriesState.total}
                </span>
                <div className='flex gap-0.5'>
                  {Array.from({ length: seriesState.total }, (_, i) => {
                    const gameNum = i + 1
                    // Determine if this game is completed and who won it
                    const matchGames =
                      (tournamentData?.match_games as
                        | MatchGame[]
                        | undefined) ?? []
                    const game = matchGames
                      .filter((g) => g.parent_id === match.id)
                      .find((g) => {
                        const num = g.number ?? (g as any).game_number
                        return num === gameNum || (!num && i === 0)
                      })

                    const gameCompleted =
                      game?.status === 4 || // Status.Completed
                      gameNum <= (seriesState.completed ?? 0)
                    const op1Won =
                      gameCompleted &&
                      (game?.opponent1?.score ?? 0) >
                        (game?.opponent2?.score ?? 0)
                    const op2Won =
                      gameCompleted &&
                      (game?.opponent2?.score ?? 0) >
                        (game?.opponent1?.score ?? 0)

                    return (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full border ${
                          gameCompleted
                            ? op1Won
                              ? 'bg-blue-500 border-blue-400'
                              : op2Won
                                ? 'bg-red-500 border-red-400'
                                : 'bg-slate-500 border-slate-400'
                            : 'bg-transparent border-slate-500'
                        }`}
                        title={`Game ${gameNum}${gameCompleted ? (op1Won ? ' - P1 won' : op2Won ? ' - P2 won' : ' - Completed') : ' - Pending'}`}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Edit Button - Appears on hover, positioned middle right outside the card */}
      {isHovered &&
        opponent1?.id != null &&
        opponent2?.id != null &&
        !isByeParticipant(opponent1) &&
        !isByeParticipant(opponent2) && (
          <div className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-full'>
            <Button
              size='sm'
              variant='outline'
              className='h-8 w-8 p-0 bg-slate-800 border-slate-600 hover:bg-slate-700'
              onClick={() => openMatchScoreEditDialog(match, tabs.reportScore)}
            >
              <Edit className='h-4 w-4 text-slate-300' />
            </Button>
          </div>
        )}
    </div>
  )
}

export default MatchCard
