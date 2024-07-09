'use client'

import * as z from 'zod'
import { CardWrapper } from '@/components/auth/Card-Wrapper'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormError } from '@/components/Form-Error'
import { FormSuccess } from '@/components/Form-Success'
import { useForm } from 'react-hook-form'

import { AdditionInfoSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'

import additonalInfo from '@/actions/additional-info/additonal-info'

import { ADDITIONAL_INFO } from '@/routes'

import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'

const AddInfo = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const user = useCurrentUser()

  const form = useForm<z.infer<typeof AdditionInfoSchema>>({
    resolver: zodResolver(AdditionInfoSchema),
    defaultValues: {
      userName: '',
    },
  })

  const onSubmit = (values: z.infer<typeof AdditionInfoSchema>) => {
    setError('')
    setSuccess('')

    if (user) {
      startTransition(() => {
        additonalInfo(user.id, values)
          .then((data) => {
            if (data?.error) {
              form.reset()
              setError(data.error)
            }
            if (data.sucess) {
              setSuccess(data.sucess)
              setTimeout(() => router.push(ADDITIONAL_INFO))
              form.reset()
              setSuccess(data.sucess)
            }
          })
          .catch(() => 'something went wrong!')
      })
    }
  }

  return (
    <CardWrapper
      headerLabel='Tell us your Username.'
      backButtonLabel=''
      backButtonHref=''
      showSocial={false}
      title='Username'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <>
              <FormField
                control={form.control}
                name='userName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Your Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder='Username'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type='submit' disabled={isPending} className='w-full'>
            submit
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default AddInfo
