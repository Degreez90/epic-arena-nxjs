import clientPromise from '@/lib/db'

export const getVerificationTokenByToken = async (token: string) => {
  const client = await clientPromise
  const db = client.db()
  const collection = db.collection('VerificationToken')

  try {
    const verificationToken = await collection.find({ token })

    return verificationToken
  } catch {
    return null
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  const client = await clientPromise
  const db = client.db()
  const collection = db.collection('VerificationToken')
  try {
    const verificationToken = await collection.find({ email })

    return verificationToken
  } catch {
    return null
  }
}
