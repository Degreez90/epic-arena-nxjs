'use client'

import React from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Container from '@/components/Container'
import { useCurrentUser } from '@/hooks/use-current-user'
import SideNav from './SideNav'
import type { ExtendedUser } from '@/next-auth'

const Nav: React.FC = () => {
  const user: ExtendedUser | null = useCurrentUser() ?? null

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
          {user && (
            <>
              <Avatar className='mx-4'>
                <AvatarImage src={user.image} alt={user.fName || 'User'} />
                <AvatarFallback>
                  {user.fName ? user.fName[0] : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='flex items-center'>{user.fName}</div>
            </>
          )}
          <SideNav />
        </div>
      </div>
    </Container>
  )
}

export default Nav
