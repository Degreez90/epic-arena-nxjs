import { TournamentType } from '@/models/tournament'

export type type = 'Single Elimination' | 'Double Elimination'

import {
  CustomParticipant,
  Match,
  Game,
  TournamentStatus,
} from '@/models/tournament'
import { Group, Round, MatchGame, Stage } from 'brackets-model'

export interface TournamentListProps {
  Tournaments: TournamentType[]
}

export interface OrganizedTournamentData {
  _id: number
  name: string
  description: string
  participants: CustomParticipant[]
  stages: (Stage & {
    groups: (Group & { rounds: (Round & { matches: Match[] })[] })[]
  })[]
  match_games: MatchGame[]
  games: Game[]
  status: TournamentStatus
  player: any // Assuming player is a property in the original data
}
