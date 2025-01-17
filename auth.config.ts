import type { NextAuthConfig, Session } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { LoginSchema, LoginTokenSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'

import { JWT } from 'next-auth/jwt'

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: (profile) => {
        console.log('auth.config.ts / Profile info: ', profile)
        return {
          id: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    Credentials({
      async authorize(credentials): Promise<any> {
        // const validatedFields = LoginSchema.safeParse(credentials)

        // console.log(
        //   `auth.config.ts: validatedfields: `,
        //   validatedFields.data?.verificationToken
        // )

        //Login user if they validate their email
        if ('email' in credentials && 'existingToken' in credentials) {
          const validatedFields = LoginTokenSchema.safeParse(credentials)

          console.log('validatedFields token: ', validatedFields)

          if (validatedFields.success) {
            const email = validatedFields.data.email
            const user = await getUserByEmail(email)

            return user
          } else {
            throw new Error('Invalid credentials')
          }
        }

        //login user normally via email and password
        if ('email' in credentials && 'password') {
          const validatedFields = LoginSchema.safeParse(credentials)

          if (validatedFields.success) {
            const { email, password } = validatedFields.data

            const user = await getUserByEmail(email)
            if (!user || !user.password) return null

            const passwordsMatch = await bcrypt.compare(password, user.password)
            if (passwordsMatch) console.log('user from credentials: ', user)
            return user
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    //:: This is where the session is modified to include the user's data from the token
    async session({ token, session }: { token: JWT; session: Session }) {
      // await connectDB() // Ensure the database connection is established
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      // if (token.role && session.user) {
      //   session.user.role = token.role as UserRole
      // }

      if (session.user) {
        session.user.id = token.id as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.email = token.email as string
        session.user.image = token.image as string
        session.user.isOAuth = token.isOAuth as boolean
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
        session.user.userName = token.userName as string
      }
      console.log(`session from: auth.ts session: `, session)

      return session
    },
  },
} satisfies NextAuthConfig
