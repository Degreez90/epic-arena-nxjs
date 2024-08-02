import NextAuth from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import {
  ADDITIONAL_INFO,
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes'

import { currentUser } from './lib/auth'
import authConfig from '@/auth.config'

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const user = await currentUser()
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  // const user = req.auth?.user

  const headers = new Headers()

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isAddInfoRoute = ADDITIONAL_INFO.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return
  }
  if (isAuthRoute) {
    headers.set('x-debug-is-logged-in', isLoggedIn.toString())
    headers.set('x-debug-has-username', user?.userName ? 'yes' : 'no')
    headers.set('x-debug-username', user?.userName || 'none')
    headers.set('x-debug-username', user?.userName as string)

    if (isLoggedIn && !user?.userName) {
      headers.set('x-debug-redirect', 'ADDITIONAL_INFO')
      return NextResponse.redirect(new URL(ADDITIONAL_INFO, nextUrl), {
        headers,
      })
    }
    if (isLoggedIn && user?.userName) {
      headers.set('x-debug-redirect', 'DEFAULT_LOGIN_REDIRECT')
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl), {
        headers,
      })
    }
    return NextResponse.next({ headers })
  }
  // if (isAuthRoute) {
  //   //If user does not have a userName
  //   if (isLoggedIn && !user?.userName)
  //     return Response.redirect(new URL(ADDITIONAL_INFO, nextUrl))
  //   if (isLoggedIn && !!user?.userName) {
  //     return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  //   }
  //   return
  // }

  // if (isAddInfoRoute) {
  //   if (isLoggedIn && user?.userName)
  //     return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  // }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    )
  }

  return
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
