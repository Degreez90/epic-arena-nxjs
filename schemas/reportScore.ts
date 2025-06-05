import { z } from 'zod'

export const reportScoreSchema = z
  .object({
    participant_one_score: z
      .preprocess((val) => Number(val), z.number())
      .refine((val) => !isNaN(val), { message: 'Please enter both scores.' })
      .refine((val) => val >= 0, { message: 'Scores cannot be negative.' }),
    participant_two_score: z
      .preprocess((val) => Number(val), z.number())
      .refine((val) => !isNaN(val), { message: 'Please enter both scores.' })
      .refine((val) => val >= 0, { message: 'Scores cannot be negative.' }),
  })
  .refine((data) => data.participant_one_score !== data.participant_two_score, {
    message: 'Scores cannot be equal.',
    path: ['participant_two_score'],
  })

export type ReportScoreType = z.infer<typeof reportScoreSchema>
