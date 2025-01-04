/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  '/',
  '/new-verification',
  '/tournament/new',
  '/settings',
]

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /settings.
 * @type {string[]}
 */

//TODO:: handle additionalinfo approprietly
export const authRoutes: string[] = [
  '/login',
  '/register',
  '/error',
  '/reset',
  '/new-password',
]

/**
 * The prefix for api authentication routes.
 * Routes that starts with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth'

/**
 * The default redirect path after a successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/settings'

/**
 *The route for collecting a users username
 * @type {string}
 */
export const ADDITIONAL_INFO: string = '/additionalinfo'
