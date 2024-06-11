import clientPromise from '@/lib/db'

const db = async () => {
  const client = await clientPromise
  const mongodb = client.db()
  return mongodb
}

export default async function getDatabase() {
  return await db()
}
