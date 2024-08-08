'use client'

import Link from 'next/link'

interface LoginButtonProps {
  children?: React.ReactNode
}

export const LoginButton = ({ children }: LoginButtonProps) => {
  return (
    <Link href='/login'>
      <span className='cursor-pointer'>{children}</span>
    </Link>
  )
}
