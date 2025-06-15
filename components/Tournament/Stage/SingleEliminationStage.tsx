import React from 'react'
import SingleEliminationGroup from '@/components/Tournament/Group/SingleEliminationGroup'
import { StageFrontend } from '@/types/tournament/tournament'
import Match from '../Match/Match'

const SingleEliminationStage = ({ stage }: { stage: StageFrontend }) => {
  const isConsolationGamePresent = stage.settings?.consolationFinal
  const mainGroup = stage.groups[0]
  const consolationFinalMatch = isConsolationGamePresent
    ? stage.groups[1].rounds[0].matches[0]
    : null
  return (
    <div>
      <SingleEliminationGroup group={mainGroup} />
      {consolationFinalMatch && (
        <div className='inline-block mt-10 md:mt-16'>
          <div className='flex flex-col gap-3 items-center justify-center'>
            <div className='font-medium opacity-60'>Third Place Game</div>
            <Match match={consolationFinalMatch} />
          </div>
        </div>
      )}
    </div>
  )
}

export default SingleEliminationStage
