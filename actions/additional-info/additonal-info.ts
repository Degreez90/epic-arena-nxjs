'use server'
import { connectDB } from '@/lib/mongodb'
import { AdditionInfoSchema } from '@/schemas'
import * as z from 'zod'
import prisma from '@/lib/prisma'
import { currentUser } from '@/lib/auth'

const additonalInfo = async (
  userId: string,
  values: z.infer<typeof AdditionInfoSchema>
) => {
  console.log('userId:', userId, values) // Log the userId

  const validatedFields = AdditionInfoSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: validatedFields.data,
    })

    console.log('Update result:', result) // Log the result of the update operation

    if (!result) {
      return {
        error: 'No documents were updated. Please check the userId and data.',
      }
    }
    const session = await currentUser()
    if (session) {
      session.userName = validatedFields.data.userName
    }

    return { success: 'User Name Created!' }
  } catch (error) {
    console.log(error)
  }
  return { success: 'User Name Created!' }
}}

export default additonalInfo
