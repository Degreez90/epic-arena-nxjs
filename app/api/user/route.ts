import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { getUserById } from '@/data/user'

const { auth } = NextAuth(authConfig)

export async function GET(_req: Request) {
  const session = await auth()
  console.log(`session from: user/route.ts: `, session)
  if (!session?.user?.id) {
    return NextResponse.json({ isLoggedIn: false, user: null })
  }
  const user = await getUserById(session.user.id)
  console.log(`user from: user/route.ts: `, user)
  return NextResponse.json({ isLoggedIn: true, user })
}
