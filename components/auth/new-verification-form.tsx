'use client'

import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { newVerification } from '@/actions/auth/new-verification'
import { CardWrapper } from '@/components/auth/Card-Wrapper'
import { FormError } from '@/components/Form-Error'
import { FormSuccess } from '@/components/Form-Success'

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  console.log('%cSearch params token: ', 'color: red', token)

  const onSubmit = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError('Missing token!')

      return
    }

    newVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success)
        } else if (data.error) {
          setError(data.error)
        }
      })
      .catch(() => {
        setError('Something went wrong!')
      })
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <CardWrapper
      headerLabel='Confirm your verification!'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
    >
      <div className='w-full flex items-center justify-center'>
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  )
}
