'use server'

import { signIn } from '@/auth'
import { getUserByEmail } from '@/data/user'
import { getVerificationTokenByToken } from '@/data/verification-token'
import { db } from '@/lib/db'
import { AuthError } from 'next-auth'
import { isRedirectError } from 'next/dist/client/components/redirect'

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)

  console.log('actions/auth/new-verification.ts: ', existingToken)

  if (!existingToken) {
    return { error: 'Token does not exists!' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: 'Token expired!' }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'Email does not exists!' }
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  })

  try {
    await signIn('credentials', {
      existingToken: existingToken.token,
      email: existingUser.email,
      redirect: false,
      // redirectTo: DEFAULT_LOGIN_REDIRECT,
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

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  })

  return { success: 'Email verified!' }
}
