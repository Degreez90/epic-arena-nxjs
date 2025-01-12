import { auth } from '@/auth'

//used for server components to get the current user
export const currentUser = async () => {
  const session = await auth()

  return session?.user
}
