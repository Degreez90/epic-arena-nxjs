import { db } from '@/lib/db'

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findMany({
      where: { userId },
    })

    console.log('data/db: account: ', account)

    return account
  } catch {
    return null
  }
}
