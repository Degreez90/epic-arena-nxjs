import { ObjectId } from 'mongoose'
import {
  DefaultSession,
  User as NextAuthUser,
  AdapterUser as NextAuthAdapterUser,
} from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  _id: ObjectId
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
