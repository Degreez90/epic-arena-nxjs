import { db } from '@/lib/db'

export const getVerificationTokenByToken = async (token: string) => {
  console.log('data/verification-token.ts: ', token)
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })
    console.log('c%Verification token: ', 'color: blue', verificationToken)
    return verificationToken
  } catch (error) {
    console.error('Error fetching verification token:', error)
    return null
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    })

    return verificationToken
  } catch {
    return null
  }
}
