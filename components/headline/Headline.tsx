import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Container from '@/components/Container'

import { ExtendedUser } from '@/next-auth'

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
        <div>
          <Avatar>
            <AvatarImage src={user?.image} alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Container>
  )
}

export default Headline
