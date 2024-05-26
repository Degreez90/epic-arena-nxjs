import CredentialsProvider from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import NextAuth from 'next-auth'

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username:',
          type: 'text',
          placeholder: 'your-cool-username',
        },
        password: {
          label: 'Password:',
          type: 'password',
          placeholder: 'your-awesome-password',
        },
      },
      async authorize(credentials) {
        // This is where you need to retrieve user data
        // to verify with credentials
        // Docs: https://next-auth.js.org/configuration/providers/credentials
        const user = { id: '42', name: 'Dave', password: 'nextauth' }

        if (
          credentials?.username === user.name &&
          credentials?.password === user.password
        ) {
          return user
        } else {
          return null
        }
      },
    }),
  ],
  basePath: '/auth/signup',
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === '/middleware-example') return !!auth
      return true
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === 'update') token.name = session.user.name
      if (account?.provider === 'keycloak') {
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken
      }
      return session
    },
  },
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
