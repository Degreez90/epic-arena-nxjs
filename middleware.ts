import { NextRequest, NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  ADDITIONAL_INFO,
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes'
import authConfig from '@/auth.config'
import NextAuth from 'next-auth'
import { getUserInfo } from '@/lib/getUserInfo'

// Initialize Auth.js with the configuration
const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req) {
  const session = await auth()

  console.log('middleware.ts, session: ', session)

  const isLoggedIn = !!session

  const { nextUrl } = req
  console.log('the req from middleware.ts: ', req.auth)

  const { user } = await getUserInfo(req)

  const headers = new Headers()

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isAddInfoRoute = ADDITIONAL_INFO.includes(nextUrl.pathname)

  console.log('middleware.ts, session: ', session)

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  //TODO:: Handle the information back from the session (email), and fix routes accordingly.

  // if (session) {
  //   {
  //     return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  //   }
  //   if (isAuthRoute) {
  //     return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  //   }
  //   return NextResponse.next()
  // }

  // if (isLoggedIn && session && !session.userName) {
  //   if (!isAddInfoRoute) {
  //     return NextResponse.redirect(new URL(ADDITIONAL_INFO, nextUrl))
  //   }
  // }

  // if (isAuthRoute) {
  //   if (isLoggedIn && !session.userName) {
  //     return NextResponse.redirect(new URL(ADDITIONAL_INFO, nextUrl), {
  //       headers,
  //     })
  //   }
  //   if (isLoggedIn && session.userName) {
  //     return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl), {
  //       headers,
  //     })
  //   }
  //   return NextResponse.next({ headers })
  // }

  // if (!isLoggedIn && !isPublicRoute) {
  //   let callbackUrl = nextUrl.pathname
  //   if (nextUrl.search) {
  //     callbackUrl += nextUrl.search
  //   }

  //   const encodedCallbackUrl = encodeURIComponent(callbackUrl)

  //   return NextResponse.redirect(
  //     new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
  //   )
  // }

  return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
