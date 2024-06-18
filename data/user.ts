import { db } from '@/lib/db'

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findFirst({ where: { email } })
    console.log(user)
    return user
  } catch {
    return null
  }
}

export const getUserById = async (id?: string) => {
  try {
    const user = await db.user.findFirst({ where: { id } })
    return user
  } catch {
    return null
  }
}
