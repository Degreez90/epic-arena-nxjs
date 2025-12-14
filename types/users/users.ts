export interface TournamentStats {
  totalTournaments: number
  firstPlace: number
  secondPlace: number
  thirdPlace: number
  topTen: number
  totalEarnings?: number
  winRate: number
  favoriteGame: string
}

export interface GameStats {
  id: string
  name: string
  count: number
  icon: string
  color: string
  recentPlacements: number[]
}

export interface TournamentHistory {
  id: string
  name: string
  game: string
  date: string
  placement: number
  totalParticipants: number
  earnings?: number
}
