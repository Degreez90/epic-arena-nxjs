import prisma from '@/lib/prisma'

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({
      where: { token },
    })
    return twoFactorToken
  } catch (error) {
    console.error('Error fetching two-factor token by token:', error)
    return null
  }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({
      where: { email },
    })
    return twoFactorToken
  } catch (error) {
    console.error('Error fetching two-factor token by email:', error)
    return null
  }
}
