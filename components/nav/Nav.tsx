'use client'

import React from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Container from '@/components/Container'
import { useCurrentUser } from '@/hooks/use-current-user'
import SideNav from '@/components/Nav/SideNav'
import type { ExtendedUser } from '@/next-auth'
import { useSession } from 'next-auth/react'

const Nav: React.FC = () => {
  const { data: session, status } = useSession()
  const user = session?.user as ExtendedUser | undefined

  return (
    <Container>
      <div className='flex p-3 justify-between'>
        <div className=' border-black text-black px-5'>
          <Link
            className='scroll-m-20 text-2xl font-semibold tracking-tight'
            href='/'
          >
            Epic Arena Tourneys
          </Link>
        </div>
        <div className='flex space-x-5'>
          {status === 'authenticated' && user && (
            <>
              <Avatar className='mx-4'>
                <AvatarImage src={user.image} alt={user.firstName || 'User'} />
                <AvatarFallback>
                  {user.firstName ? user.firstName[0] : ''}
                </AvatarFallback>
              </Avatar>
              <div className='flex items-center'>{user.firstName}</div>
            </>
          )}
          <SideNav />
        </div>
      </div>
    </Container>
  )
}

export default Nav
