import React from 'react'

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getProviders } from 'next-auth/react'

import Register from '@/components/auth/Register'

const signup = () => {
  return (
    <div>
      <Register />
    </div>
  )
}

export default signup
