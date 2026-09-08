import NextAuth, { Account, Session, Users } from 'next-auth'
import prisma from './lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import authConfig from '@/auth.config'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { LoginSchema, LoginTokenSchema } from '@/schemas'
import { getUserByEmail, getUserById } from '@/data/user'
import { getAccountByUserId } from '@/data/accounts'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'

import { JWT } from 'next-auth/jwt'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  events: {
    async linkAccount({ user }) {
      // Update email verification status when OAuth account is linked
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  ...authConfig,
  providers: [
    ...(authConfig.providers ?? []),
    Credentials({
      async authorize(credentials): Promise<any> {
        if (!credentials || typeof credentials !== 'object') return null

        // Login user if they validated email through token flow.
        if ('email' in credentials && 'existingToken' in credentials) {
          const validatedFields = LoginTokenSchema.safeParse(credentials)

          if (validatedFields.success) {
            const email = validatedFields.data.email
            const user = await getUserByEmail(email)
            return user
          }

          throw new Error('Invalid credentials')
        }

        // Login user normally via email + password.
        if ('email' in credentials && 'password' in credentials) {
          const validatedFields = LoginSchema.safeParse(credentials)

          if (validatedFields.success) {
            const { email, password } = validatedFields.data
            const user = await getUserByEmail(email)
            if (!user || !user.password) return null

            const passwordsMatch = await bcrypt.compare(password, user.password)
            if (!passwordsMatch) return null

            return user
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }: { user: Users; account?: Account | null }) {
      //Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true

      if (!user.id) throw new Error('No user ID found')
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
        await prisma.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        })
      }

      return true
    },

    async redirect({ url, baseUrl }) {
      // Allow only internal redirects for security
      if (url.startsWith(baseUrl)) return url
      // Optionally, allow relative URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      return baseUrl
    },

    //:: This is where the token is modified to include the user's data from the database
    async jwt({ token, user }: { token: JWT; user: Users }) {
      if (user) {
        token.id = user.id
      }

      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)
      token.id = existingUser.id
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
