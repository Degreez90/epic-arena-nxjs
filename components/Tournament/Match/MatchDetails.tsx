'use client'
import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'
import { DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowRight } from 'lucide-react'
import { MatchFrontend } from '@/types/tournament/tournament'
import { useTournamentStore } from '@/store/useTournamentStore'
import { useCurrentUser } from '@/hooks/use-current-user'
import { advanceWinner } from '@/actions/tournament/advance-winner'

interface MatchDetailsTabProps {
  match: MatchFrontend
}

const MatchDetailsTab: React.FC<MatchDetailsTabProps> = ({ match }) => {
  const user = useCurrentUser()
  const tournamentData = useTournamentStore((state) => state.tournamentData)
  const [advancing, setAdvancing] = useState(false)
  const [advanceError, setAdvanceError] = useState<string | null>(null)
  const [advanceSuccess, setAdvanceSuccess] = useState<string | null>(null)

  const isAdmin = user?.role === 'admin'
  const matchCompleted = match.status === 4
  const participants = match.participants ?? []

  const score1 = match.opponent1?.score ?? -1
  const score2 = match.opponent2?.score ?? -1
  const hasScores = score1 >= 0 && score2 >= 0
  const canAdvance =
    isAdmin && hasScores && score1 !== score2

  const handleAdvance = async () => {
    if (!tournamentData?._id) return
    setAdvancing(true)
    setAdvanceError(null)
    setAdvanceSuccess(null)

    try {
      const result = await advanceWinner(
        String(tournamentData._id),
        match.id as number,
      )
      if (result.error) {
        setAdvanceError(result.error)
      } else {
        setAdvanceSuccess(result.success || 'Winner advanced')
        setTimeout(() => window.location.reload(), 800)
      }
    } catch {
      setAdvanceError('An unexpected error occurred')
    } finally {
      setAdvancing(false)
    }
  }

  const statusLabel =
    matchCompleted
      ? 'Completed'
      : match.status === 3
        ? 'Running'
        : match.status === 2
          ? 'Ready'
          : match.status === 1
            ? 'Waiting'
            : 'Locked'

  const winnerName = matchCompleted
    ? match.opponent1?.result === 'win'
      ? participants[0]?.name || 'Participant 1'
      : participants[1]?.name || 'Participant 2'
    : null

  return (
    <Card>
      <CardHeader>
        <DialogTitle className='flex justify-center'>Match Details</DialogTitle>
        <CardDescription className='flex justify-center text-center'>
          Match #{match.number} &middot; {statusLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Participants and scores */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between rounded-lg bg-muted/50 p-3'>
            <div>
              <p className='text-sm font-medium'>
                {participants[0]?.name || 'TBD'}
              </p>
              {match.opponent1?.result === 'win' && (
                <span className='text-xs text-green-500 font-medium'>Winner</span>
              )}
            </div>
            <span className='text-lg font-mono font-bold'>
              {match.opponent1?.score ?? '-'}
            </span>
          </div>

          <div className='flex items-center justify-center'>
            <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
              vs
            </span>
          </div>

          <div className='flex items-center justify-between rounded-lg bg-muted/50 p-3'>
            <div>
              <p className='text-sm font-medium'>
                {participants[1]?.name || 'TBD'}
              </p>
              {match.opponent2?.result === 'win' && (
                <span className='text-xs text-green-500 font-medium'>Winner</span>
              )}
            </div>
            <span className='text-lg font-mono font-bold'>
              {match.opponent2?.score ?? '-'}
            </span>
          </div>
        </div>

        {/* Winner display */}
        {winnerName && (
          <div className='rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center'>
            <p className='text-sm text-green-400 font-medium'>
              {winnerName} advances
            </p>
          </div>
        )}

        {/* Error / Success */}
        {advanceError && (
          <Alert variant='destructive'>
            <AlertDescription>{advanceError}</AlertDescription>
          </Alert>
        )}
        {advanceSuccess && (
          <Alert>
            <AlertDescription className='text-green-500'>
              {advanceSuccess}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      {/* Admin-only Advance button */}
      {canAdvance && (
        <CardFooter className='flex justify-center'>
          <Button
            onClick={handleAdvance}
            disabled={advancing}
            variant='default'
            className='w-full'
          >
            {advancing ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <ArrowRight className='mr-2 h-4 w-4' />
            )}
            {matchCompleted ? 'Advance Winner' : 'Advance to Next Round'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default MatchDetailsTab
