import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Container from '@/components/Container'
import { TiThMenu } from 'react-icons/ti'
import { currentUser } from '@/lib/auth'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LogoutButton } from '@/components/Auth/buttons/logout-button'
import { Button } from '../ui/button'
import SideNav from './SideNav'
import type { ExtendedUser } from '@/next-auth'

const Nav: React.FC = async () => {
  const user: ExtendedUser | null = (await currentUser()) ?? null
  return (
    <Container>
      <div className='flex p-3 justify-between'>
        <div className=' border-black text-black px-5'>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
            Epic Arena Tourneys
          </h3>
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
