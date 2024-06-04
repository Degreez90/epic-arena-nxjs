import clientPromise from '@/lib/db'

export const getPasswordResetTokenByEmail = async (token: string) => {
  const client = await clientPromise
  const db = client.db()
  const collection = db.collection('twofactorToken')

  try {
    const passwordResetToken = await collection.findOne({ token })

    return passwordResetToken
  } catch {
    return null
  }
}
