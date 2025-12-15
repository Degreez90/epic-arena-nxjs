'use client'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'
import { DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const MatchDetailsTab = () => (
  <Card>
    <CardHeader>
      <DialogTitle className='flex justify-center'>Match Details</DialogTitle>
      <CardDescription className='flex justify-center'>
        Details on the match
      </CardDescription>
    </CardHeader>
    <CardContent className='space-y-2'>
      <div className='flex items-center justify-center gap-4'>
        <div className='relative w-20 h-20'>
          <Image
            src='/images/hero.png'
            alt='Player 1'
            fill
            className='object-cover rounded'
          />
        </div>
        <span className='text-2xl font-bold text-gray-700'>VS</span>
        <div className='relative w-20 h-20'>
          <Image
            src='/images/hero.png'
            alt='Player 2'
            fill
            className='object-cover rounded'
          />
        </div>
      </div>
    </CardContent>
    <CardFooter className='flex justify-center'>
      <Button>Save changes</Button>
    </CardFooter>
  </Card>
)

export default MatchDetailsTab
