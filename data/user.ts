import clientPromise from '@/lib/db'
import { UserType } from '@/models/User'

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

export const getUserById = async (id?: string) => {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection('users')
    const user = await collection.findOne({ id })

    return user
  } catch {
    return null
  }
}
