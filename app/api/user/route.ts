import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { getUserById } from '@/data/user'

const { auth } = NextAuth(authConfig)

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log(`req from: user/route.ts: `, req)
  const session = await auth()
  console.log(`session from: user/route.ts: `, session)
  if (!session?.user?._id) {
    return NextResponse.json({ isLoggedIn: false, user: null })
  }
  const user = await getUserById(session.user._id)
  console.log(`user from: user/route.ts: `, user)
  return NextResponse.json({ isLoggedIn: true, user })
}
