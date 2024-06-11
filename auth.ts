import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from './lib/db'
import authConfig from '@/auth.config'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/login',
  },
  events: {
    async linkAccount({ user }) {
      const client = await clientPromise
      const db = client.db()
      await db.collection('user').updateOne(
        {
          id: user.id,
        },
        { $set: { emailVerified: new Date() } }
      )
    },
  },
  // callbacks: {},
  adapter: MongoDBAdapter(clientPromise),
  // session: { strategy: 'jwt' },
  ...authConfig,
})
