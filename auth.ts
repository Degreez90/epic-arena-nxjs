import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from './lib/db'
import authConfig from '@/auth.config'
import { getUserById } from './data/user'
import { getAccountByUserId } from './data/accounts'

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
  callbacks: {
    async signIn({ user, account }) {
      //Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true

      const existingUser = await getUserById(user.id)

      // //Prevent sign in without email verification
      // if (!existingUser?.emailVerified) return false

      // //2FA check
      // if (existingUser.isTwoFactorEnabled) {
      //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
      //     existingUser.id
      //   )

      //   if (!twoFactorConfirmation) return false

      //   //Delete the two factor confirmation for next sign in
      //   await db.twoFactorConfirmation.delete({
      //     where: { id: twoFactorConfirmation.id },
      //   })
      // }

      return true
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      // if (token.role && session.user) {
      //   session.user.role = token.role as UserRole
      // }

      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.isOAuth = token.isOAuth as boolean
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.firstName
      token.email = existingUser.email
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: 'jwt' },
  ...authConfig,
})
