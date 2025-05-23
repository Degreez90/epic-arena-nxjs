'use client'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { BsFillInfoCircleFill } from 'react-icons/bs'
import { Button } from '@/components/ui/button'
import { EditScoreButton } from './EditScoreButton'
import { Participant } from './Participant'
import { useRouter } from 'next/router'
import useTournamentStore from '@/store/useTournamentStore'
import { MatchFrontend } from '@/types/tournament/tournament'

const styleConstants = {
  borderRadius: 'rounded-sm',
  fontSize: 'sm:text-sm md:text-base',
  textColor: 'text-gray-500',
}

interface Participant {
  name?: string
  result?: string
  score?: number
}

interface Match {
  status: number
  participants: Participant[]
}

interface MatchProps {
  match: MatchFrontend
}

const Match: React.FC<MatchProps> = ({ match }) => {
  // const router = useRouter()
  // const { id } = router.query

  const { tournamentData } = useTournamentStore()

  const tournamentStatus = tournamentData?.status

  const matchReady = match.status === 2

  return (
    <div className='rounded-sm sm:text-sm md:text-base text-gray-500 w-full'>
      <div
        className={`relative ${styleConstants.borderRadius} border-solid border bg-slate-500 hover:border hover:border-solid hover:border-s-lime-600 shadow-md w-full z-10`}
      >
        <Participant
          match={match}
          disableAction={tournamentStatus !== 'progress'}
        />
        <Separator />
        <Participant
          match={match}
          position='bottom'
          disableAction={tournamentStatus !== 'progress'}
        />
        {matchReady && (
          <EditScoreButton
            match={match}
            disableButton={tournamentStatus !== 'progress'}
          />
        )}
      </div>
      {/* show match info button which open match and score edit dialog */}
      <div
        id='match_tool_tip'
        className='absolute top-0 right-[-50] h-[1px] w-14 invisible flex flex-col justify-center items-center'
      >
        <div className='w-full h-[0.55rem] bg-bracket-background rounded opacity-90 flex justify-center z-5'>
          <Button
          // onClick={() =>
          //   openMatchScoreEditDialog(match, matchEditDialogTabs.matchDetail)
          // }
          >
            <BsFillInfoCircleFill
              className='fill-current text-lightgrey hover:text-primary-light'
              fontSize='small'
            />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Match
