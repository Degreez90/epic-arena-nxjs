import type { TournamentDTO } from '@/data/Tournaments/tournaments'

export type type = 'Single Elimination' | 'Double Elimination'

// Minimal shapes for UI usage
export type Game = any
export type TournamentStatus = string

import {
  Group,
  Round,
  MatchGame,
  Stage,
  Match as M,
  Participant,
  ParticipantResult,
} from 'brackets-model'

export interface MatchFrontend extends M {
  gameId?: string | null
  opponent1: CustomParticipantFrontend | null
  opponent2: CustomParticipantFrontend | null
  participants?: (CustomParticipantFrontend | null)[]
}
export interface RoundFrontend extends Round {
  matches: MatchFrontend[]
}

export interface GroupFrontend extends Group {
  rounds: RoundFrontend[]
}

export interface StageFrontend extends Stage {
  groups: GroupFrontend[]
}

export interface OrganizedTournamentData {
  _id: number | string
  name: string
  description: string | null
  participants: CustomParticipantFrontend[]
  stages: StageFrontend[]
  match_games: MatchGame[]
  games: Game[]
  status: TournamentStatus
  player?: any // Assuming player is a property in the original data
}

export interface CustomParticipantFrontend extends ParticipantResult {
  id: number
  name: string
  userId?: string // string, not ObjectId
  invitation?: 'accepted' | 'pending' | 'declined'
}

export interface SerializedTournament {
  _id: number | string
  name: string
  description: string | null
  participant: CustomParticipantFrontend[] | null | any
  stage: StageFrontend[] | null | any
  group: GroupFrontend[] | null | any
  round: RoundFrontend[] | null | any
  match: MatchFrontend[] | null | any
  match_game: MatchGame[] | null | any
  game?: Game[] | null | any
  participantGameMatrix?:
    | { participantId: number; games: Game[] }[]
    | null
    | any
  status: TournamentStatus
  createdBy: string // or Types.ObjectId, but usually string after serialization
  progress: number
  player?: string // or Types.ObjectId, but usually string after serialization
  participants?: any // Optional as TournamentDTO may not include it
}

export interface TournamentBracketProps {
  tournamentDataForUI: OrganizedTournamentData
}
