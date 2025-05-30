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

  return (
    <div
      className={`flex items-center ${
        position === 'top' ? 'border-b' : 'border-t'
      } border-slate-500 p-2`}
    >
      <span className='flex-1 text-gray-800'>{participant?.name}</span>
      <span
        className={`relative ${
          !(matchCompleted || matchRunning) ? 'invisible' : ''
        } ${participant?.result === 'win' ? 'font-bold' : ''}`}
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
