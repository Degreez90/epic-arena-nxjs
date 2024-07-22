import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import authConfig from '@/auth.config'
import { getUserById } from '@/data/user'
import { getAccountByUserId } from '@/data/accounts'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getSession } from 'next-auth/react'

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
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      //Allow OAuth without email verification
      console.log('auth.ts, user: ', user)

      if (account?.provider !== 'credentials') return true

      const existingUser = await getUserById(user.id)

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
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        })
      }

      return true
    },

    // async redirect() {
    //   const session = await getSession()
    //   if (!session?.user.userName) {
    //     return '/nickname'
    //   } else {
    //     return '/sign-in'
    //   }
    // },

    async session({ token, session }) {
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
    async jwt({ token }) {
      console.log(`from: auth.ts: `, token)
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)
      token.id = existingUser.id
      token.isOAuth = !!existingAccount
      token.fName = existingUser.fName
      token.lName = existingUser.lName
      token.email = existingUser.email
      token.image = existingUser.image
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      token.userName = existingUser.userName

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
