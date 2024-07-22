'use server'
import { db } from '@/lib/db'

import { AdditionInfoSchema } from '@/schemas'
import * as z from 'zod'

const additonalInfo = async (
  userId: string,
  values: z.infer<typeof AdditionInfoSchema>
) => {
  const validatedFields = AdditionInfoSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: validatedFields.data,
    })
  } catch (error) {
    console.log(error)
  }
  return { sucess: 'User Name Created!' }
}

export default additonalInfo
