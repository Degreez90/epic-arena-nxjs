'use client'

import React from 'react'
import { useEffect } from 'react'
import { Suspense } from 'react'
import AddInfo from '@/components/AdditionalInfo/Add-Info'
import { useCurrentUser } from '@/hooks/use-current-user'

const page = () => {
  const user = useCurrentUser()

  //TODO:: Find a better solution then a reload
  useEffect(() => {
    if (!user) {
      window.location.reload()
    }
  }, [user])

  console.log(user)

  // if (!user) {
  //   return <div>Loading...</div>
  // }

  return (
    <Suspense fallback={<div>...loading</div>}>
      <AddInfo user={user} />
    </Suspense>
  )
}

export default page
