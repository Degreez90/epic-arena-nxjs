import { useSession } from 'next-auth/react'

//used for client components to get the current user
export const useCurrentUser = () => {
  const session = useSession()

  return session.data?.user
}
