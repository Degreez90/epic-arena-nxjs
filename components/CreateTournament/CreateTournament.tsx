'use client'

import { CreateTournamentSchema } from '@/schemas/createTournament'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import { Form, useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'
import { CardWrapper } from '../Auth/Card-Wrapper'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { FormError } from '../Form-Error'
import { FormSuccess } from '../Form-Success'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'

const CreateTournament = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof CreateTournamentSchema>>({
    resolver: zodResolver(CreateTournamentSchema),
    defaultValues: {
      tName: '',
      description: '',
      type: 'Single Elimintation',
      thirdPlaceMatch: false,
    },
  })

  const onSubmit = (values: z.infer<typeof CreateTournamentSchema>) => {
    console.log('submit:', values)
    setError('')
    setSuccess('')

    startTransition(() => {
      // register(values).then((data) => {
      //   setError(data.error)
      //   setSuccess(data.success)
      // })
    })
  }

  return (
    <FormProvider {...form}>
      <div>
        <CardWrapper
          headerLabel='Create a Tournament'
          backButtonLabel=''
          backButtonHref='/'
          title='Create a tournament'
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='tName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder='John Doe'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        disabled={isPending}
                        placeholder='Enter description here...'
                        className='form-textarea'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='thirdPlaceMatch'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center space-x-2'>
                      <FormLabel>Third Place Match</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type='submit' disabled={isPending} className='w-full'>
              Create an account
            </Button>
          </form>
        </CardWrapper>
      </div>
    </FormProvider>
  )
}

export default CreateTournament
