'use server'

import { signIn } from '@/auth'
import { getUserByEmail } from '@/data/user'
import { getVerificationTokenByToken } from '@/data/verification-token'
import { connectDB } from '@/lib/mongodb'
import { AuthError } from 'next-auth'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { User } from '@/models/User'
import { VerificationToken } from '@/models/VerificationToken'

export const newVerification = async (token: string) => {
  await connectDB() // Ensure the database is connected

  const existingToken = await getVerificationTokenByToken(token)

  console.log('actions/auth/new-verification.ts: ', existingToken)

  if (!existingToken) {
    return { error: 'Token does not exist!' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: 'Token expired!' }
  }

  const existingUser = await getUserByEmail(existingToken.email)
  console.log('actions/auth/new-verification.ts: ', existingUser)

  if (!existingUser) {
    return { error: 'Email does not exist!' }
  }

  await User.updateOne(
    { _id: existingUser._id },
    {
      $set: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    }
  )

  try {
    await signIn('credentials', {
      existingToken: existingToken.token,
      email: existingUser.email,
      redirect: false,
    })
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' }
        default:
          return { error: 'Something went wrong!' }
      }
    }
    throw error
  }

  await VerificationToken.deleteOne({ _id: existingToken.id })

  return { success: 'Email verified!' }
}
