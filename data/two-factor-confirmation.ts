import prisma from '@/lib/prisma'

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique(
      {
        where: { userId },
      }
    )

    return twoFactorConfirmation
  } catch (error) {
    console.error('Error fetching two-factor confirmation by user ID:', error)
    return null
  }
}
