import { connectDB } from '@/lib/mongodb'
import { PasswordResetToken } from '@/models/PasswordResetToken'

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    await connectDB()
    const passwordResetToken = await PasswordResetToken.findOne({ token })

    return passwordResetToken
  } catch {
    return null
  }
}

export const getPasswordResetTokenByEmail = async (token: string) => {
  try {
    await connectDB()
    const passwordResetToken = await PasswordResetToken.findOne({ token })

    return passwordResetToken
  } catch {
    return null
  }
}
