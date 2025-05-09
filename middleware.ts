import { NextRequest, NextResponse } from 'next/server'
import {
  ADDITIONAL_INFO,
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes'
import { getUserInfo } from '@/lib/getUserInfo'

export async function middleware(req: NextRequest) {
  const { nextUrl } = req

  const { isLoggedIn, user } = await getUserInfo(req)

  const headers = new Headers()

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isAddInfoRoute = ADDITIONAL_INFO.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (isLoggedIn && user && user.userName) {
    if (isAddInfoRoute) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return NextResponse.next()
  }

  if (isLoggedIn && user && !user.userName) {
    if (!isAddInfoRoute) {
      return NextResponse.redirect(new URL(ADDITIONAL_INFO, nextUrl))
    }
  }

  if (isAuthRoute) {
    if (isLoggedIn && !user.userName) {
      return NextResponse.redirect(new URL(ADDITIONAL_INFO, nextUrl), {
        headers,
      })
    }
    if (isLoggedIn && user.userName) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl), {
        headers,
      })
    }
    return NextResponse.next({ headers })
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    )
  }

  return NextResponse.next()
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
