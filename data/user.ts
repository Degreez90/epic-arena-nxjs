import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import mongoose from 'mongoose'

export const getUserByEmail = async (email: string) => {
  try {
    await connectDB() // Ensure the database connection is established
    console.log('data/user.ts: ', email)
    const user = await User.findOne({ email }).lean()
    console.log(user)
    return user
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}

export const getUserById = async (id?: string) => {
  try {
    await connectDB() // Ensure the database connection is established
    const user = await User.findById(new mongoose.Types.ObjectId(id))
    return user
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    return null
  }
}
