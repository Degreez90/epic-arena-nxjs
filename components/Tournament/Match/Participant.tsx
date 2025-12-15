import { MatchFrontend } from '@/types/tournament/tournament'
import { EditScoreButton } from './EditScoreButton'

interface ParticipantProps {
  match: MatchFrontend
  position?: string
  disableAction: boolean
}

export const Participant: React.FC<ParticipantProps> = ({
  match,
  position = 'top',
  disableAction,
}) => {
  const matchCompleted = match.status === 4 || match.status === 5
  const matchRunning = match.status === 3
  const participant = (match.participants ?? [null, null])[
    position === 'top' ? 0 : 1
  ]

  const isWinner = participant?.result === 'win'

  return (
    <div
      className={`
        flex items-center
        ${position === 'top' ? 'border-b' : 'border-t'}
        p-2
        ${
          isWinner
            ? 'bg-green-50 border-green-400'
            : 'bg-slate-100 border-slate-300'
        }
        border
        rounded
        transition-colors
      `}
    >
      <span className='flex-1 text-gray-800'>{participant?.name}</span>
      <span
        className={`relative ${
          isWinner ? 'font-bold text-green-700' : 'text-gray-800'
        }`}
      >
        {matchRunning && !participant?.score ? (
          <EditScoreButton match={match} disableButton={disableAction} />
        ) : participant?.score === 0 ? (
          0
        ) : (
          participant?.score || '-'
        )}
      </span>
    </div>
  )
}
