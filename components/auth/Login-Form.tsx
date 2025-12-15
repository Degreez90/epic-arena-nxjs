'use client'

import * as z from 'zod'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

import { LoginSchema } from '@/schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CardWrapper } from '@/components/Auth/Card-Wrapper'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/Form-Error'
import { FormSuccess } from '@/components/Form-Success'
import { login } from '@/actions/auth/login'

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  const errorUrl =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with a different provider'
      : ''

  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset()
            setError(data.error)
          }

          if (data?.success) {
            form.reset()
            setSuccess(data.success)
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true)
          }
        })
        .catch(() => setError('Something went wrong!'))
    })
  }

  return (
    <div className='mt-10'>
      <CardWrapper
        headerLabel={
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 mb-1'>
              Welcome Back
            </h1>
            <p className='text-sm text-slate-500'>
              Sign in to continue to Epic Arena
            </p>
          </div>
        }
        backButtonLabel="Don't have an account?"
        backButtonHref='/register'
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Two factor code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder='123456'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder='john.doe@example.com'
                            type='email'
                            className='bg-white/80'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder='********'
                            type='password'
                            className='bg-white/80'
                          />
                        </FormControl>
                        <div className='flex justify-end mt-2'>
                          <Button
                            size='sm'
                            variant='link'
                            asChild
                            className='px-0 font-normal text-sm text-sky-600 hover:underline'
                          >
                            <Link href='/auth/reset'>Forgot password?</Link>
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <div className='pt-1'>
              <FormError message={error || errorUrl} />
              <FormSuccess message={success} />
            </div>
            <Button
              type='submit'
              disabled={isPending}
              className='w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg shadow-sm'
            >
              {showTwoFactor ? 'Confirm' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  )
}
