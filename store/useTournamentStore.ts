import { SerializedTournament } from '@/types/tournament/tournament'
import { create } from 'zustand'

interface TournamentStore {
  tournamentData: SerializedTournament | null
  setTournamentData: (data: any) => void
}

const useTournamentStore = create<TournamentStore>()((set) => ({
  tournamentData: null,
  setTournamentData: (data) => set({ tournamentData: data }),
}))

export default useTournamentStore
