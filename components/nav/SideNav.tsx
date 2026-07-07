'use client'

import { useSession, signOut } from 'next-auth/react'
import React, { useEffect, useMemo, useState } from 'react'
import { TiThMenu } from 'react-icons/ti'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LoginButton } from '@/components/auth/buttons/Login-Button'
import { LogoutButton } from '@/components/auth/buttons/Logout-Button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '../ui/button'
import type { ExtendedUser } from '@/next-auth'
import { usePathname, useSearchParams } from 'next/navigation'

const SideNav: React.FC = () => {
  const { data: session, status } = useSession()
  const user =
    status === 'authenticated' ? (session?.user as ExtendedUser) : null
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const displayName = useMemo(
    () => user?.userName || user?.name || 'Guest',
    [user?.name, user?.userName],
  )

  const initials = useMemo(() => {
    const source = user?.userName || user?.name || user?.email || 'GA'
    return source
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [user?.email, user?.name, user?.userName])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    handleClose()
    signOut({ callbackUrl: '/login' })
  }

  useEffect(() => {
    handleClose()
  }, [pathname, searchParams])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full border border-border/60 shadow-sm'
          aria-label='Open navigation'
        >
          <TiThMenu size={22} />
          <span className='sr-only'>Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side='right'
        className='w-[320px] sm:w-[380px] border-l border-border/60 bg-background/95 backdrop-blur'
      >
        <SheetHeader className='space-y-1 text-left'>
          <SheetTitle className='text-base font-semibold tracking-tight'>
            Menu
          </SheetTitle>
          <SheetDescription className='text-sm text-muted-foreground'>
            Quick account access and actions.
          </SheetDescription>
        </SheetHeader>

        <div className='mt-6 flex flex-col gap-6'>
          <div className='flex items-center gap-3 rounded-xl bg-muted/60 p-3'>
            <Avatar className='h-11 w-11'>
              <AvatarFallback className='bg-primary/10 text-primary'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className='min-w-0'>
              <p className='text-sm font-semibold text-foreground'>
                {displayName}
              </p>
              <p className='truncate text-xs text-muted-foreground'>
                {user?.email || 'Not signed in'}
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            {user ? (
              <LogoutButton>
                <Button
                  className='w-full'
                  variant='secondary'
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </LogoutButton>
            ) : (
              <LoginButton>
                <Button
                  className='w-full'
                  variant='secondary'
                  onClick={handleClose}
                >
                  Login
                </Button>
              </LoginButton>
            )}
            <Button variant='outline' className='w-full' onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SideNav
