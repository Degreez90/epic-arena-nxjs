import { TournamentType } from '@/models/tournament'

export type type = 'Single Elimination' | 'Double Elimination'

import {
  CustomParticipant,
  Match,
  Game,
  TournamentStatus,
} from '@/models/tournament'

import { Group, Round, MatchGame, Stage, Match as M } from 'brackets-model'

export interface MatchFrontend extends M {
  gameId?: string | null
  opponent1: { id: number; name?: string; [key: string]: any } | null
  opponent2: { id: number; name?: string; [key: string]: any } | null
  // Add any other frontend-specific fields here
}

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

export interface CustomParticipantFrontend {
  id: number
  name: string
  userId?: string // string, not ObjectId
  invitation?: 'accepted' | 'pending' | 'declined'
}
export interface SerializedTournament {
  _id: number | string
  name: string
  description: string
  participant: CustomParticipantFrontend[]
  stage: Stage[]
  group: Group[]
  round: Round[]
  match: MatchFrontend[]
  match_game: MatchGame[]
  game: Game[]
  participantGameMatrix: { participantId: number; games: Game[] }[]
  status: TournamentStatus
  createdBy: string // or Types.ObjectId, but usually string after serialization
  progress: number
}

export interface TournamentBracketProps {
  tournamentDataForUI: OrganizedTournamentData
  tournament: SerializedTournament
}
