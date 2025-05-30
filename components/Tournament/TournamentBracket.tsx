'use client'
import React, { use, useEffect } from 'react'
import DoubleEliminationStage from '@/components/Tournament/Stage/DoubleEliminationStage'
import { SerializedTournament } from '@/types/tournament/tournament'
import { TournamentBracketProps } from '@/types/tournament/tournament'
import { useTournamentStore } from '@/store/useTournamentStore'
import MatchScoreAndDetailDialog from './Match/MatchScoreAndDetailDialog'

const TournamentBracket: React.FC<TournamentBracketProps> = ({
  tournamentDataForUI,
}) => {
  const { setTournamentData } = useTournamentStore()
  const dialog = useTournamentStore((state) => state.dialog)
  const closeDialog = useTournamentStore((state) => state.closeDialog)

  console.log('Current Zustand state:', useTournamentStore.getState())

  useEffect(() => {
    setTournamentData(tournamentDataForUI)
  }, [setTournamentData, tournamentDataForUI])

  console.log('tournamentDataForUI from bracket: ', tournamentDataForUI)

  const stage = tournamentDataForUI.stages[0]
  return (
    <div>
      {dialog.match && (
        <MatchScoreAndDetailDialog
          open={dialog.open}
          onClose={closeDialog}
          match={dialog.match}
          tab={dialog.tab}
        />
      )}
      {stage && (
        <>
          {stage.type === 'single_elimination' ? (
            <DoubleEliminationStage stage={stage} />
          ) : (
            <div>Stage Unavailable</div>
          )}
        </>
      )}
    </div>
  )
}

export default TournamentBracket
