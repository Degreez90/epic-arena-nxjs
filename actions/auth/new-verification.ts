'use server'

import { signIn } from '@/auth'
import { getUserByEmail } from '@/data/user'
import { getVerificationTokenByToken } from '@/data/verification-token'
import prisma from '@/lib/prisma'
import { AuthError } from 'next-auth'

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)

  console.log('actions/auth/new-verification.ts: ', existingToken)

  if (!existingToken) {
    return { error: 'Token does not exist!' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: 'Token expired!' }
  }

  const existingUser = await getUserByEmail(existingToken.identifier)
  console.log('actions/auth/new-verification.ts: ', existingUser)

  if (!existingUser) {
    return { error: 'Email does not exist!' }
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.identifier,
    },
  })

  try {
    await signIn('credentials', {
      existingToken: existingToken.token,
      email: existingUser.email,
      redirect: false,
    })
  } catch (error) {
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

  await prisma.verificationToken.delete({
    where: { token },
  })

  return { success: 'Email verified!' }
}
