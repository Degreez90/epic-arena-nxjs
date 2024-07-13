import React from 'react'

const Container = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <div className='max-w-full m-auto mx-4'>{children}</div>
}

export default Container
