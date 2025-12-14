import { ITournament, TournamentType } from '@/models/tournament'

export type type = 'Single Elimination' | 'Double Elimination'

import { Game, TournamentStatus } from '@/models/tournament'

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

export interface TournamentListProps {
  Tournaments: ITournament[]
}

export interface OrganizedTournamentData {
  _id: number | string
  name: string
  description: string
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
  description: string
  participant: CustomParticipantFrontend[]
  stage: StageFrontend[]
  group: GroupFrontend[]
  round: RoundFrontend[]
  match: MatchFrontend[]
  match_game: MatchGame[]
  game: Game[]
  participantGameMatrix: { participantId: number; games: Game[] }[]
  status: TournamentStatus
  createdBy: string // or Types.ObjectId, but usually string after serialization
  progress: number
  player?: string // or Types.ObjectId, but usually string after serialization
}

export interface TournamentBracketProps {
  tournamentDataForUI: OrganizedTournamentData
}
