'use client'
import React from 'react'
import { TiThMenu } from 'react-icons/ti'
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

import { useCurrentUser } from '@/hooks/use-current-user'

const SideNav: React.FC = () => {
  const user = useCurrentUser()
  return (
    <Sheet>
      <SheetTrigger>
        <div className='flex items-center'>
          <TiThMenu size={30} />
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Welcome {user?.userName}</SheetTitle>
          <SheetDescription>
            <LogoutButton>
              <Button variant={'secondary'}>Logout</Button>
            </LogoutButton>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default SideNav
