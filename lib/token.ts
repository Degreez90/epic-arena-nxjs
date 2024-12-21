import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import { connectDB } from '@/lib/mongodb'
import { getVerificationTokenByEmail } from '@/data/verification-token'
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { TwoFactorToken } from '@/models/TwoFactorToken'
import { PasswordResetToken } from '@/models/PasswordResetToken'
import { VerificationToken } from '@/models/verificationToken'

export const generateTwoFactorToken = async (email: string) => {
  await connectDB() // Ensure the database connection is established

  const token = crypto.randomInt(100_000, 1000_000).toString()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await TwoFactorToken.deleteOne({ _id: existingToken.id })
  }

  await TwoFactorToken.create({
    email,
    token,
    expires,
  })

  return token
}

export const generatePasswordResetToken = async (email: string) => {
  await connectDB() // Ensure the database connection is established

  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getPasswordResetTokenByEmail(email)

  if (existingToken) {
    await PasswordResetToken.deleteOne({ _id: existingToken.id })
  }

  await PasswordResetToken.create({
    email,
    token,
    expires,
  })

  return token
}

export const generateVerificationToken = async (email: string) => {
  await connectDB() // Ensure the database connection is established

  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await VerificationToken.deleteOne({ _id: existingToken.id })
  }

  await VerificationToken.create({
    email,
    token,
    expires,
  })

  return { token, email }
}
