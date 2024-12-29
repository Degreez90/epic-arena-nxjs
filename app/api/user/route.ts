import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserById } from '@/data/user'

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth(req, res)
  console.log(`session from: user/route.ts: `, session)
  if (!session?.user?._id) {
    return NextResponse.json({ isLoggedIn: false, user: null })
  }
  const user = await getUserById(session.user._id)
  return NextResponse.json({ isLoggedIn: true, user })
}
