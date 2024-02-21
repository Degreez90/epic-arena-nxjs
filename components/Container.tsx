import React from 'react'

const Container = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <div className='max-w-[1536px] m-auto'>{children}</div>
}

export default Container
