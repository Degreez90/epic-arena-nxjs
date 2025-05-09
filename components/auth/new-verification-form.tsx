'use client'

import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { useRouter, useSearchParams } from 'next/navigation'
import { newVerification } from '@/actions/auth/new-verification'
import { CardWrapper } from '@/components/auth/Card-Wrapper'
import { FormError } from '@/components/Form-Error'
import { FormSuccess } from '@/components/Form-Success'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const searchParams = useSearchParams()

  const router = useRouter()

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
          setTimeout(() => {
            router.push(DEFAULT_LOGIN_REDIRECT)
          }, 2000)
        } else if (data.error) {
          setError(data.error)
        }
      })
      .catch(() => {
        setError('Page error')
      })
  }, [token, success, error, router])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <div className='my-60'>
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
    </div>
  )
}
