import { NextRequest } from 'next/server'

export async function getUserInfo(
  req: NextRequest
): Promise<{ isLoggedIn: boolean; user: any }> {
  const res = await fetch(`${req.nextUrl.origin}/api/user/`)
  const data = await res.json()
  return { isLoggedIn: data.isLoggedIn, user: data.user }
}
