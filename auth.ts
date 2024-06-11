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
    signIn: '/auth/login',
    error: '/auth/error',
  },
  // callbacks: {},
  // adapter: MongoDBAdapter(clientPromise),
  // session: { strategy: 'jwt' },
  ...authConfig,
})
