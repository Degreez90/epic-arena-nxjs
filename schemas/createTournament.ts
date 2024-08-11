import * as z from 'zod'

export const CreateTournamentSchema = z.object({
  tName: z.string().min(1, { message: 'Tournament name is required' }),
  description: z.string().min(1, { message: 'Tournament name is required' }),
  type: z.enum(['single_elimination', 'double_elimination', 'round_robin'], {
    message: 'Tournament type is required',
  }),
  thirdPlaceMatch: z.boolean().default(false),
})

export type CreateTournamentType = z.infer<typeof CreateTournamentSchema>
