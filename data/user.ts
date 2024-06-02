import clientPromise from '@/lib/db'

export const getUserByEmail = async (email: string) => {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection('users')
    const user = await collection.findOne({ email })

    return user
  } catch {
    return null
  }
}
