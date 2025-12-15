import prisma from '@/lib/prisma'

export const getUserByEmail = async (email: string) => {
  try {
    console.log('data/user.ts: ', email)
    const user = await prisma.user.findUnique({
      where: { email },
    })
    console.log('Data/user.ts User: ', user)
    return user
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}

export const getUserById = async (id?: string) => {
  try {
    if (!id) return null
    const user = await prisma.user.findUnique({
      where: { id },
    })
    return user
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    return null
  }
}
