import { ObjectId } from 'mongoose'
import {
  DefaultSession,
  User as NextAuthUser,
  AdapterUser as NextAuthAdapterUser,
} from 'next-auth'

import { JWT } from 'next-auth/jwt'

export type ExtendedUser = DefaultSession['user'] & {
  _id: ObjectId
  id: string // This is the id string assigned by Auth.js to the user.
  firstName: string
  lastName: string
  email: string
  image?: string
  isTwoFactorEnabled: boolean
  isOAuth: boolean
  userName: string
  role: string
}

declare module 'next-auth' {
  // Keep your existing Session user override
  interface Session {
    user: ExtendedUser
  }

  // Add User and AdapterUser overrides too
  interface Users extends NextAuthUser {
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
    role?: string
  }
}
