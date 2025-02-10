import { create } from 'zustand'

interface TournamentStore {
  tournamentData: any
  setTournamentData: (data: any) => void
}

const useTournamentStore = create<TournamentStore>()((set) => ({
  tournamentData: null,
  setTournamentData: (data) => set({ tournamentData: data }),
}))

export default useTournamentStore
