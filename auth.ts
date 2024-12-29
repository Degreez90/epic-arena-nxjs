import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { connectDB } from '@/lib/mongodb'
import authConfig from '@/auth.config'
import { getUserByEmail, getUserById } from '@/data/user'
import { getAccountByUserId } from '@/data/accounts'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'

import { TwoFactorConfirmation } from './models/TwoFactorConfirmation'

import { User } from '@/models/User'
import clientPromise from '@/lib/mongoclient'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/login',
  },
  events: {
    async linkAccount({ user }) {
      console.log('auth.ts, user: running linkAccount', user)
      await connectDB() // Ensure the database connection is established
      await User.updateOne(
        { email: user.email },
        { $set: { emailVerified: new Date() } }
      )
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      //Allow OAuth without email verification
      console.log('auth.ts, user: ', user)

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

    //:: This is where the session is modified to include the user's data from the token
    async session({ token, session }) {
      await connectDB() // Ensure the database connection is established

      console.log(`session from: auth.ts token: `, token)
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      // if (token.role && session.user) {
      //   session.user.role = token.role as UserRole
      // }

      if (session.user) {
        session.user.id = token.id as string
        session.user.fName = token.fName as string
        session.user.lName = token.lName as string
        session.user.email = token.email as string
        session.user.image = token.image as string
        session.user.isOAuth = token.isOAuth as boolean
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
        session.user.userName = token.userName as string
      }

      return session
    },

    //:: This is where the token is modified to include the user's data from the database
    async jwt({ token, user }) {
      await connectDB() // Ensure the database connection is established
      console.log(`from: auth.ts: `, token, user)
      if (!token.sub) return token

      const tokenUserId = user?._id

      const existingUser = await getUserById(tokenUserId)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)
      token.id = existingUser._id
      token.isOAuth = !!existingAccount
      token.fName = existingUser.firstName
      token.lName = existingUser.lastName
      token.email = existingUser.email
      token.image = existingUser.image
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      token.userName = existingUser.userName

      return token
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
})
