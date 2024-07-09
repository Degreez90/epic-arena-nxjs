import NextAuth, { type DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  id: string
  lName: string
  fName: string
  email: string
  image?: string
  isTwoFactorEnabled: boolean
  isOAuth: boolean
  userName: string
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
