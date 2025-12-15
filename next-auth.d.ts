import {
  DefaultSession,
  User as NextAuthUser,
  AdapterUser as NextAuthAdapterUser,
} from 'next-auth'

import { JWT } from 'next-auth/jwt'

export type ExtendedUser = DefaultSession['user'] & {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  image?: string | null
  isTwoFactorEnabled: boolean
  isOAuth: boolean
  userName: string | null
  role: string
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }

  interface Users extends NextAuthUser {
    firstName?: string | null
    lastName?: string | null
    isTwoFactorEnabled?: boolean
    userName?: string | null
    role?: string
  }

  interface AdapterUser extends NextAuthAdapterUser {
    firstName?: string | null
    lastName?: string | null
    isTwoFactorEnabled?: boolean
    userName?: string | null
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    image?: string | null
    isOAuth?: boolean
    isTwoFactorEnabled?: boolean
    userName?: string | null
    role?: string
  }
}
