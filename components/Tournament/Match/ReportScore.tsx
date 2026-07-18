'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { MatchFrontend } from '@/types/tournament/tournament'
import { reportScoreSchema, ReportScoreType } from '@/schemas/reportScore'
import { useTournamentStore } from '@/store/useTournamentStore'
import type { MatchGame } from 'brackets-model'

interface ReportScoreTabProps {
  match: MatchFrontend
  onClose: () => void
}

/**
 * Gets the current series state for a best-of match.
 * Returns the number of games won by each opponent and the next game number.
 */
function getSeriesState(
  match: MatchFrontend,
  matchGames: MatchGame[],
): {
  isBestOf: boolean
  totalGames: number
  opponent1Wins: number
  opponent2Wins: number
  nextGameNumber: number
  gamesCompleted: number
} | null {
  const childCount = match.child_count ?? 0
  if (childCount === 0) return null

  // Get match games for this match
  const games = matchGames.filter((g) => g.parent_id === match.id)

  let opponent1Wins = 0
  let opponent2Wins = 0
  let gamesCompleted = 0

  for (const game of games) {
    if (game.status === 2) {
      // Completed
      gamesCompleted++
      if ((game.opponent1?.score ?? 0) > (game.opponent2?.score ?? 0)) {
        opponent1Wins++
      } else if ((game.opponent2?.score ?? 0) > (game.opponent1?.score ?? 0)) {
        opponent2Wins++
      }
    }
  }

  return {
    isBestOf: true,
    totalGames: childCount,
    opponent1Wins,
    opponent2Wins,
    nextGameNumber: gamesCompleted + 1,
    gamesCompleted,
  }
}

const ReportScoreTab: React.FC<ReportScoreTabProps> = ({ match, onClose }) => {
  const participants = match.participants ?? []
  const tournamentData = useTournamentStore((state) => state.tournamentData)

  // Get series state for best-of matches
  const matchGames = tournamentData?.match_games ?? []
  const seriesState = getSeriesState(match, matchGames)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<ReportScoreType & { root?: { message?: string } }>({
    resolver: zodResolver(reportScoreSchema),
    defaultValues: {
      participant_one_score: participants[0]?.score ?? undefined,
      participant_two_score: participants[1]?.score ?? undefined,
    },
  })

  const onSubmit = async (data: ReportScoreType) => {
    try {
      const body: any = {
        tournamentId: tournamentData?._id,
        matchId: match.id,
        opponent1Score: data.participant_one_score,
        opponent2Score: data.participant_two_score,
      }

      // For best-of series, include the next game number
      if (seriesState) {
        body.gameNumber = seriesState.nextGameNumber
      }

      const response = await fetch('/api/tournaments/report-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        setError('root', {
          message: result.error || 'Failed to report score',
        })
        return
      }

      reset()
      onClose()
      // Trigger a page reload to refresh bracket data
      window.location.reload()
    } catch (err) {
      setError('root', {
        message: 'An unexpected error occurred',
      })
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>
            Report Score
            {seriesState && (
              <span className='block text-sm font-normal text-muted-foreground mt-1'>
                Game {seriesState.nextGameNumber} of {seriesState.totalGames}{' '}
                (Best of {seriesState.totalGames})
              </span>
            )}
          </CardTitle>
          {seriesState && (
            <div className='mt-2 text-xs text-muted-foreground'>
              Series: {seriesState.opponent1Wins} - {seriesState.opponent2Wins}
              {seriesState.opponent1Wins >=
                Math.ceil(seriesState.totalGames / 2) && (
                <span className='ml-2 text-green-400 font-medium'>
                  {participants[0]?.name || 'P1'} leads
                </span>
              )}
              {seriesState.opponent2Wins >=
                Math.ceil(seriesState.totalGames / 2) && (
                <span className='ml-2 text-green-400 font-medium'>
                  {participants[1]?.name || 'P2'} leads
                </span>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {(errors.participant_one_score ||
            errors.participant_two_score ||
            (errors as any).root?.message) && (
            <Alert variant='destructive' className='mb-4'>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errors.participant_one_score?.message ||
                  errors.participant_two_score?.message ||
                  (errors as any).root?.message}
              </AlertDescription>
            </Alert>
          )}
          <div className='grid grid-cols-2 gap-4 items-center mb-2'>
            <Label>
              {participants[0]?.name || 'Participant 1'}
              {seriesState && (
                <span className='ml-1 text-xs text-muted-foreground'>
                  ({seriesState.opponent1Wins}W)
                </span>
              )}
            </Label>
            <Input
              type='number'
              {...register('participant_one_score')}
              min={0}
              className='w-24'
              autoFocus
              disabled={isSubmitting}
            />
            <Label>
              {participants[1]?.name || 'Participant 2'}
              {seriesState && (
                <span className='ml-1 text-xs text-muted-foreground'>
                  ({seriesState.opponent2Wins}W)
                </span>
              )}
            </Label>
            <Input
              type='number'
              {...register('participant_two_score')}
              min={0}
              className='w-24'
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default ReportScoreTab
