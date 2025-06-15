import React from 'react'
import { GroupFrontend, RoundFrontend } from '@/types/tournament/tournament'
import Round from '../Round/Round'

const styleConstants = {
  gapBetweenRounds: {
    sm: 4, // sm:gap-4
    md: 8, // md:gap-8
  },
}

const stylesGap = `flex flex-row sm:gap-${styleConstants.gapBetweenRounds.sm} md:gap-${styleConstants.gapBetweenRounds.md}`

interface SingleEliminationGroupProps {
  group: GroupFrontend
}

const SingleEliminationGroup: React.FC<SingleEliminationGroupProps> = ({
  group,
}) => {
  return (
    <div className='min-w-full overflow-auto'>
      <div className={stylesGap}>
        {group.rounds.map(
          (round: RoundFrontend, i: number, rounds: RoundFrontend[]) => (
            <Round
              key={i}
              round={round}
              roundIndex={i}
              roundLength={rounds.length}
              gapBetweenRounds={styleConstants.gapBetweenRounds}
            />
          )
        )}
      </div>
    </div>
  )
}

export default SingleEliminationGroup
