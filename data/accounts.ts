import { db } from '@/lib/db'

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findMany({
      userId,
    })

    console.log('lib/db: account: ', account)

    return account
  } catch {
    return null
  }
}
