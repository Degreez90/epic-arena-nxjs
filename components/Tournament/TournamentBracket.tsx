'use client'
import React, { useEffect } from 'react'
import { TournamentBracketProps } from '@/types/tournament/tournament'
import { useTournamentStore } from '@/store/useTournamentStore'
import MatchScoreAndDetailDialog from './Match/MatchScoreAndDetailDialog'
import BracketContainer from './BracketView/BracketContainer'

const TournamentBracket: React.FC<TournamentBracketProps> = ({
  tournamentDataForUI,
}) => {
  const { setTournamentData } = useTournamentStore()
  const dialog = useTournamentStore((state) => state.dialog)
  const closeDialog = useTournamentStore((state) => state.closeDialog)

  useEffect(() => {
    setTournamentData(tournamentDataForUI)
  }, [setTournamentData, tournamentDataForUI])

  const stage = tournamentDataForUI.stages[0]

  if (!stage) {
    return <div>No stage data available</div>
  }

  return (
    <div className='w-full'>
      {dialog.match && (
        <MatchScoreAndDetailDialog
          open={dialog.open}
          onClose={closeDialog}
          match={dialog.match}
          tab={dialog.tab}
        />
      )}
      <BracketContainer
        stage={stage}
        tournamentName={tournamentDataForUI.name}
      />
    </div>
  )
}

export default TournamentBracket
