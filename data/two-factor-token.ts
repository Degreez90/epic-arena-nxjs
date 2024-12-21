import { connectDB } from '@/lib/mongodb'
import { TwoFactorToken } from '@/models/TwoFactorToken'

export const getTwoFactorTokenByToken = async (token: string) => {
  await connectDB() // Ensure the database connection is established

  try {
    const twoFactorToken = await TwoFactorToken.findOne({ token })
    return twoFactorToken
  } catch (error) {
    console.error('Error fetching two-factor token by token:', error)
    return null
  }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
  await connectDB() // Ensure the database connection is established

  try {
    const twoFactorToken = await TwoFactorToken.findOne({ email })
    return twoFactorToken
  } catch (error) {
    console.error('Error fetching two-factor token by email:', error)
    return null
  }
}
