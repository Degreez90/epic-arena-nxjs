import {
  OrganizedTournamentData,
  SerializedTournament,
} from '@/types/tournament/tournament'
import { create } from 'zustand'
import { MatchFrontend } from '@/types/tournament/tournament'
import { tabs as matchEditDialogTabs } from '@/components/Tournament/Match/MatchScoreAndDetailDialog'

interface IMatchScoreAndDetailDialog {
  open: boolean
  tab: string
  match: MatchFrontend | null
}

interface ITournamentState {
  tournamentData: OrganizedTournamentData | null
  setTournamentData: (tournament: OrganizedTournamentData) => void
  loading: boolean
  setLoading: (loading: boolean) => void

  error: string | null
  setError: (error: string | null) => void

  dialog: IMatchScoreAndDetailDialog
  openMatchScoreEditDialog: (match: MatchFrontend, tab: string) => void
  closeDialog: () => void

  // Add more tournament-related state/actions as needed
}

const initialDialogState: IMatchScoreAndDetailDialog = {
  open: false,
  tab: matchEditDialogTabs.reportScore,
  match: null,
}

export const useTournamentStore = create<ITournamentState>((set) => ({
  tournamentData: null,

  setTournamentData: (tournament) => set({ tournamentData: tournament }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  error: null,
  setError: (error) => set({ error }),
  dialog: initialDialogState,
  openMatchScoreEditDialog: (match, tab) =>
    set({ dialog: { open: true, tab, match } }),
  closeDialog: () => set({ dialog: initialDialogState }),
}))
