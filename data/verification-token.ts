import prisma from '@/lib/prisma'

export const getVerificationTokenByToken = async (token: string) => {
  console.log('data/verification-token.ts: ', token)
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })
    console.log('Verification token: ', verificationToken)
    return verificationToken
  } catch (error) {
    console.error('Error fetching verification token:', error)
    return null
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { identifier: email },
    })
    return verificationToken
  } catch (error) {
    console.error('Error fetching verification token:', error)
    return null
  }
}
