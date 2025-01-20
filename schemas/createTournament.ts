import * as z from 'zod'
import { tournamentStageType } from '@/models/tournament'

export enum SeedOrdering {
  Natural = 'natural',
  Reverse = 'reverse',
  HalfShift = 'half_shift',
  ReverseHalfShift = 'reverse_half_shift',
  PairFlip = 'pair_flip',
  InnerOuter = 'inner_outer',
  EffortBalanced = 'groups.effort_balanced',
  SeedOptimized = 'groups.seed_optimized',
  BracketOptimized = 'groups.bracket_optimized',
}

export const CreateTournamentSchema = z.object({
  tournamentName: z.string().min(1, { message: 'Tournament name is required' }),
  description: z.string().min(1, { message: 'Tournament name is required' }),
  type: z.enum(
    [
      tournamentStageType.singleElimination,
      tournamentStageType.doubleElimination,
      tournamentStageType.roundRobin,
    ],
    {
      message: 'Tournament type is required',
    }
  ),
  thirdPlaceMatch: z.boolean().default(false),
  Participants: z.string().optional(),
  seedOrdering: z.nativeEnum(SeedOrdering).optional(),
})

export type CreateTournamentType = z.infer<typeof CreateTournamentSchema>
