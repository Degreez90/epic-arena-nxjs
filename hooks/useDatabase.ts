import { useState, useEffect } from 'react'
import clientPromise from '@/lib/db'
import { MongoClient, Db } from 'mongodb'

export default function useDatabase() {
  const [db, setDb] = useState<Db | null>(null)
  const [client, setClient] = useState<MongoClient | null>(null)

  useEffect(() => {
    async function fetchDatabase() {
      const client = await clientPromise
      const database = client.db()
      setDb(database)
      setClient(client)
    }

    fetchDatabase()

    // Clean-up function to close the MongoDB client connection
    return () => {
      if (client) {
        client.close()
      }
    }
  }, [client])

  return db
}
