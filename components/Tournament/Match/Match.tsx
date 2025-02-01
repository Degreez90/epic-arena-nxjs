import React from 'react'
import { Separator } from '@/components/ui/separator'

const styleConstants = {
  borderRadius: 'rounded-sm',
  fontSize: 'sm:text-sm md:text-base',
  textColor: 'text-gray-500',
}

const Match = ({ match }) => {
  const matchReady = match.status === 2

  return (
    <div className='rounded-sm sm:text-sm md:text-base text-gray-500 '>
      <div
        className={`relative ${styleConstants.borderRadius} border-solid border bg-slate-500 hover:border hover:border-solid hover:border-s-lime-600 shadow-md`}
        w-max
      >
        Match
      </div>
      <Participant
        match={match}
        disableAction={tournamentStatus !== 'progress'}
      />
      <Separator />
    </div>
  )
}

export default Match
