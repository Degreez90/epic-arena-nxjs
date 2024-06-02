import clientPromise from '@/lib/db'

const mongoDB = async () => {
  const client = await clientPromise
  const mongoDB = client.db()

  return mongoDB
}

export default mongoDB
