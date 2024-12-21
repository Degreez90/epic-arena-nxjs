import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

export const getUserByEmail = async (email: string) => {
  try {
    await connectDB() // Ensure the database connection is established
    const user = await User.findOne({ email })
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
    const user = await User.findById(id)
    return user
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    return null
  }
}
