import NextAuth, { Account, Session, Users } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { connectDB } from '@/lib/mongodb'
import authConfig from '@/auth.config'
import { getUserById } from '@/data/user'
import { getAccountByUserId } from '@/data/accounts'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'

import { TwoFactorConfirmation } from './models/TwoFactorConfirmation'

import { User } from '@/models/User'
import client from '@/lib/mongoclient'

import { JWT } from 'next-auth/jwt'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: MongoDBAdapter(client),
  pages: {
    signIn: '/login',
  },
  events: {
    async linkAccount({ user }) {
      await connectDB() // Ensure the database connection is established
      await User.updateOne(
        { email: user.email },
        { $set: { emailVerified: new Date() } }
      )
    },
  },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }: { user: Users; account: Account | null }) {
      //Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true

      if (!user._id) throw new Error('No user ID found')
      const existingUser = await getUserById(user._id)

      //Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false

      // 2FA check
      /*
      !:: 2FA Currently throws an error when trying to 
      !:: redirect after Email Verification
      */
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        )

        if (!twoFactorConfirmation) return false

        //Delete the two factor confirmation for next sign in
        await TwoFactorConfirmation.deleteOne({
          _id: twoFactorConfirmation.id,
        })
      }

      user.id = user._id.toString()

      return true
    },

    async redirect({ url, baseUrl }) {
      // Add custom redirect logic here
      return baseUrl
    },

    //:: This is where the token is modified to include the user's data from the database
    async jwt({ token, user }: { token: JWT; user: Users }) {
      if (!token.sub) return token

      const tokenUserId = user?._id

      const existingUser = await getUserById(tokenUserId)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)
      token.id = existingUser._id.toString()
      token.isOAuth = !!existingAccount
      token.firstName = existingUser.firstName
      token.lastName = existingUser.lastName
      token.email = existingUser.email
      token.image = existingUser.image
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      token.userName = existingUser.userName

      return token
    },
  },
  session: { strategy: 'jwt' },
})
