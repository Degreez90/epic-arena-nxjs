'use client'

import React, { useEffect, useState } from 'react'
import { TiThMenu } from 'react-icons/ti'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LoginButton } from '@/components/Auth/buttons/Login-Button'
import { LogoutButton } from '@/components/Auth/buttons/Logout-Button'
import { Button } from '../ui/button'

import { useCurrentUser } from '@/hooks/use-current-user'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const SideNav: React.FC = () => {
  const user = useCurrentUser()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    handleClose()
  }, [pathname, searchParams])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <div className='flex items-center' onClick={handleToggle}>
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
            <LoginButton>
              <Button variant={'secondary'}>Login</Button>
            </LoginButton>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default SideNav
