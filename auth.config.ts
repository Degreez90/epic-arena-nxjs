import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { LoginSchema, LoginTokenSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'

//new code
import User from '@/models/User'

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: (profile) => {
        console.log('auth.config.ts / Profile info: ', profile)
        return {
          id: profile.sub,
          fName: profile.given_name,
          lName: profile.family_name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    Credentials({
      async authorize(credentials): Promise<any> {
        console.log(`auth.config.ts: credentials: `, credentials)
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
            if (passwordsMatch) return user
          }
        }

        return null
      },
    }),
  ],
} satisfies NextAuthConfig
