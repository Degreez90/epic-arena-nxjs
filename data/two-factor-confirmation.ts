import { connectDB } from '@/lib/mongodb'
import { TwoFactorConfirmation } from '@/models/TwoFactorConfirmation'

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    await connectDB() // Ensure the database connection is established

    const twoFactorConfirmation = await TwoFactorConfirmation.findOne({
      userId,
    })

    return twoFactorConfirmation
  } catch (error) {
    console.error('Error fetching two-factor confirmation by user ID:', error)
    return null
  }
}
