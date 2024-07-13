import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Container from '@/components/Container'
import { TiThMenu } from 'react-icons/ti'

import { ExtendedUser } from '@/next-auth'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LogoutButton } from '@/components/auth/buttons/logout-button'
import { Button } from '../ui/button'

interface HeadlineProps {
  user: ExtendedUser | null
}

const Headline: React.FC<HeadlineProps> = ({ user }) => {
  return (
    <Container>
      <div className='flex p-3 justify-between'>
        <div className=' border-black text-black px-5'>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
            Epic Arena Tourneys
          </h3>
        </div>
        <div className='flex space-x-5'>
          <Avatar className='mx-4'>
            <AvatarImage src={user?.image} alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex items-center'>{user?.fName}</div>
          <Sheet>
            <SheetTrigger>
              {' '}
              <div className='flex items-center'>
                <TiThMenu size={30} />
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                  <LogoutButton>
                    <Button variant={'secondary'}>Logout</Button>
                  </LogoutButton>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </Container>
  )
}

export default Headline
