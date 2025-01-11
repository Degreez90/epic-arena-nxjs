import * as z from 'zod'
import { SeedOrdering, StageType } from '@prisma/client'

export const CreateTournamentSchema = z.object({
  tName: z.string().min(1, { message: 'Tournament name is required' }),
  description: z.string().min(1, { message: 'Tournament name is required' }),
  //! This is the old way of doing it(Can possibly be removed)
  // type: z.enum(['single_elimination', 'double_elimination', 'round_robin'], {
  //   message: 'Tournament type is required',
  // }),
  type: z.nativeEnum(StageType, {
    message: 'Please select a valid tournament type',
  }),
  thirdPlaceMatch: z.boolean().default(false),
  seedOrdering: z.nativeEnum(SeedOrdering, {
    message: 'Please select a valid seed ordering method',
  }),
})

export type CreateTournamentType = z.infer<typeof CreateTournamentSchema>
