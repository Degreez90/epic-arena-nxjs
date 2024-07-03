import NextAuth, { type DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  lName: string
  fName: string
  email: string
  image?: string
  isTwoFactorEnabled: boolean
  isOAuth: boolean
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
