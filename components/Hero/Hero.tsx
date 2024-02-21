import React from 'react'
import Image from 'next/image'

const Hero = () => {
  return (
    <div className='relative'>
      <div className='absolute z-50 inset-0 bg-gradient-to-t from-[#2B2A33] bg-opacity-50 '></div>
      <div className='flex mx-auto space-x-1 h-72 relative'>
        <div className='w-full relative'>
          <Image src='/images/pool_small.jpg' alt='pool' fill={true} />
        </div>
        <div className='w-full relative'>
          <Image src='/images/pool_small.jpg' fill={true} alt='pool' />
        </div>
        <div className='w-full relative'>
          <Image src='/images/pool_small.jpg' fill={true} alt='pool' />
        </div>
      </div>
      <div className='absolute h-20 bg-[#2B2A33] w-full'></div>
    </div>
  )
}

export default Hero
