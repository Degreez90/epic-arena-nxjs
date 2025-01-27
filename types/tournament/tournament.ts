import { TournamentType } from '@/models/tournament'

export type type = 'Single Elimination' | 'Double Elimination'

export interface TournamentListProps {
  Tournaments: TournamentType[]
}
