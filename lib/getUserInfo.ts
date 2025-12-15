import { NextRequest } from 'next/server'

export async function getUserInfo(
  req: NextRequest
): Promise<{ isLoggedIn: boolean; user: any }> {
  try {
    const res = await fetch(`${req.nextUrl.origin}/api/user/`)
    if (!res.ok) {
      throw new Error(`Failed to fetch user info: ${res.statusText}`)
    }
    const data = await res.json()
    return { isLoggedIn: data.isLoggedIn, user: data.user }
  } catch (error) {
    console.error('Error fetching user info:', error)
    return { isLoggedIn: false, user: null }
  }
}
