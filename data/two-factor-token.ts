import clientPromise from '@/lib/db'

export const getTwoFactorTokenByEmail = async (email: string) => {
  const client = await clientPromise
  const db = client.db()

  try {
    const twoFactorToken = await db.collection('twoFactorToken').findOne({
      email,
    })

    return twoFactorToken
  } catch {
    return null
  }
}
