import { NextRequest, NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  ADDITIONAL_INFO,
  UNAUTHORIZED_USER,
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  privateRoutes,
} from '@/routes'
import authConfig from '@/auth.config'
import NextAuth from 'next-auth'
import { getUserInfo } from '@/lib/getUserInfo'

// Initialize Auth.js with the configuration.
const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req) {
  const { nextUrl } = req

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isAddInfoRoute = ADDITIONAL_INFO.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  const session = await auth()

  const isLoggedIn = !!session

  const headers = new Headers()

  if (!isLoggedIn && isPrivateRoute) {
    return NextResponse.redirect(new URL(UNAUTHORIZED_USER, nextUrl))
  }

  //If is a authentication route and user is logged in with no username send them to additional info.
  // if (isAuthRoute) {
  //If not session send user to register.
  // if (!session) {
  //   return NextResponse.redirect(new URL(UNAUTHORIZED_USER, nextUrl))
  // }
  // if (isLoggedIn && !session.user.userName) {
  //   return NextResponse.redirect(new URL(ADDITIONAL_INFO, nextUrl), {
  //     headers,
  //   })
  // }

  //   //No session send user back to register.
  //   // const userName = session.user.userName

  //   console.log('middleware.ts, session: ', session)

  //   //TODO:: Handle the information back from the session (email), and fix routes accordingly.
  //   //Send user to default login redirect if they are logged in and have a username.
  //   // if (session && userName) {
  //   //   {
  //   //     return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  //   //   }
  //   // }

  //   //Send user to get additional info if they are logged in and do not have a username.
  //   // if (isLoggedIn && session && !session.user.userName) {
  //   //   if (!isAddInfoRoute) {
  //   //     return NextResponse.redirect(new URL(ADDITIONAL_INFO, nextUrl))
  //   //   }
  //   // }

  //   //If is a authentication route and user is logged in with a username send them to default login redirect.
  //   // if (isLoggedIn && session.user.userName) {
  //   //   return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl), {
  //   //     headers,
  //   //   })
  //   // }
  //   // return NextResponse.next({ headers })
  // }

  //If user is not logged in and is not a public route send them to login with a callback to the page they were trying to access.
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

  // if (!isLoggedIn && isAuthRoute) {
  //   return NextResponse.redirect(new URL(UNAUTHORIZED_USER, nextUrl))
  // }

  // if (isLoggedIn && isAddInfoRoute) {
  //   const userName = session.user.userName
  //   if (!userName) {
  //     return NextResponse.redirect(new URL('/additional-info', nextUrl))
  //   }
  // }

  return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
