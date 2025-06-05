import { MatchFrontend } from '@/types/tournament/tournament'
import { Button } from '@/components/ui/button'
import { FaPen } from 'react-icons/fa' // or any icon you prefer
import { useTournamentStore } from '@/store/useTournamentStore'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface EditScoreButtonProps {
  match: MatchFrontend
  disableButton: boolean
}

export const EditScoreButton: React.FC<EditScoreButtonProps> = ({
  match,
  disableButton,
}: {
  match: MatchFrontend
  disableButton: boolean
}) => {
  const { openMatchScoreEditDialog } = useTournamentStore()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type='button'
              disabled={disableButton}
              className={`
            absolute
            min-w-[2rem] sm:min-w-[2.5rem]
            h-full
            bg-slate-100
            border-slate-300
            border-b border-t
            top-0 right-0
            flex items-center justify-center
            p-2
            rounded-tr-sm rounded-br-sm rounded-l-none
            z-100
            ${disableButton ? 'opacity-50' : ''}
          `}
              onClick={() => openMatchScoreEditDialog(match, 'reportScore')}
              aria-disabled={disableButton}
            >
              <FaPen className='text-gray-600' />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {disableButton ? 'Please first start the Tournament' : 'Edit score'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
