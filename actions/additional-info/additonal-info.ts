'use server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'

import { AdditionInfoSchema } from '@/schemas'
import * as z from 'zod'

import { User } from '@/models/User'
import { currentUser } from '@/lib/auth'

const additonalInfo = async (
  userId: string,
  values: z.infer<typeof AdditionInfoSchema>
) => {
  console.log('userId:', userId, values) // Log the userId
  await connectDB() // Ensure the database connection is established

  const validatedFields = AdditionInfoSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  try {
    const result = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: validatedFields.data }
    )

    console.log('Update result:', result) // Log the result of the update operation

    if (result.modifiedCount === 0) {
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
}

export default additonalInfo
