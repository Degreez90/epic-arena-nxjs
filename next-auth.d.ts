import { ObjectId } from 'mongoose'
import {
  DefaultSession,
  User as NextAuthUser,
  AdapterUser as NextAuthAdapterUser,
} from 'next-auth'

import { JWT } from 'next-auth/jwt'

export type ExtendedUser = DefaultSession['user'] & {
  _id: ObjectId
  id: string
  lastName: string
  firstName: string
  email: string
  image?: string
  isTwoFactorEnabled: boolean
  isOAuth: boolean
  userName: string
}

declare module 'next-auth' {
  // Keep your existing Session user override
  interface Session {
    user: ExtendedUser
  }

  // Add User and AdapterUser overrides too
  interface User extends NextAuthUser {
    _id?: ObjectId
  }

  interface AdapterUser extends NextAuthAdapterUser {
    _id?: ObjectId
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    firstName?: string
    lastName?: string
    email?: string
    image?: string
    isOAuth?: boolean
    isTwoFactorEnabled?: boolean
    userName?: string
  }
}
