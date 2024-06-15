import clientPromise from '@/lib/db'

export const getAccountByUserId = async (userId: string) => {
  const client = await clientPromise
  const db = client.db()

  try {
    const account = await db.collection('account').findOne({
      userId,
    })

    console.log('lib/db: account: ', account)

    return account
  } catch {
    return null
  }
}
