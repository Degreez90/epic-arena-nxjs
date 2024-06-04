import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import clientPromise from '@/lib/db'
import { getVerificationTokenByEmail } from '@/data/verification-token'
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1000_000).toString()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getTwoFactorTokenByEmail(email)

  const client = await clientPromise
  const db = client.db()
  const collection = db.collection('twofactorToken')

  if (existingToken) {
    await collection.deleteOne({
      _id: existingToken.id,
    })
  }

  const twoFactorToken = await collection.insertOne({
    email,
    token,
    expires,
  })

  return twoFactorToken
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000)

  const existingToken = await getPasswordResetTokenByEmail(email)

  const client = await clientPromise
  const db = client.db()
  const collection = db.collection('PasswordResetToken')

  if (existingToken) {
    await collection.deleteOne({
      _id: existingToken.id,
    })
  }

  const passwordResetToken = await collection.insertOne({
    email,
    token,
    expires,
  })

  return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  const client = await clientPromise
  const db = client.db()
  const collection = db.collection('VerificationToken')

  if (existingToken) {
    await collection.deleteOne({
      _id: existingToken.id,
    })
  }

  const verificationToken = await collection.insertOne({
    email,
    token,
    expires,
  })

  return verificationToken
}
