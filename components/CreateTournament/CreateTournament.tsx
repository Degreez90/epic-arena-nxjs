'use client'

import { CreateTournamentSchema } from '@/schemas/createTournament'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'
import { CardWrapper } from '../Auth/Card-Wrapper'
import {
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '../ui/input'
import { FormError } from '../Form-Error'
import { FormSuccess } from '../Form-Success'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import Link from 'next/link'
import { SeedOrdering, StageType } from '@prisma/client'

const CreateTournament = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  //TODO:: Particpent placeholder should probably be moved later
  const participants = ['Player One', 'Player Two']

  const form = useForm<z.infer<typeof CreateTournamentSchema>>({
    resolver: zodResolver(CreateTournamentSchema),
    defaultValues: {
      tName: '',
      description: '',
      type: StageType.single_elimination,
      thirdPlaceMatch: false,
      seedOrdering: SeedOrdering.INNER_OUTER,
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
          title='Create a Tournament'
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='tName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder='Name of tournament...'
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
                        className='resize-none w-full'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a verified email to display' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={StageType.single_elimination}>
                          Single Elimination
                        </SelectItem>
                        <SelectItem value={StageType.double_elimination}>
                          Double Elimination
                        </SelectItem>
                        <SelectItem value={StageType.round_robin}>
                          Round Robin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the stage for your tournament.
                    </FormDescription>
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
              <FormField
                control={form.control}
                name='seedOrdering'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seed Ordering</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a verified email to display' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SeedOrdering.INNER_OUTER}>
                          Inner Outer
                        </SelectItem>
                        <SelectItem value={SeedOrdering.NATURAL}>
                          Natural
                        </SelectItem>
                        <SelectItem value={SeedOrdering.REVERSE}>
                          Reverse
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the Seeding Order for the tournament.{' '}
                    </FormDescription>
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
