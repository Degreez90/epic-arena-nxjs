import { connectDB } from '@/lib/mongodb'
import { VerificationToken } from '@/models/VerificationToken'

export const getVerificationTokenByToken = async (token: string) => {
  console.log('data/verification-token.ts: ', token)
  await connectDB() // Ensure the database connection is established
  try {
    const verificationToken = await VerificationToken.findOne({ token })
    console.log('Verification token: ', verificationToken)
    return verificationToken
  } catch (error) {
    console.error('Error fetching verification token:', error)
    return null
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  await connectDB() // Ensure the database connection is established
  try {
    const verificationToken = await VerificationToken.findOne({ email })
    return verificationToken
  } catch (error) {
    console.error('Error fetching verification token:', error)
    return null
  }
}
