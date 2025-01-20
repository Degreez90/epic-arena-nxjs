'use client'

import { CreateTournamentSchema } from '@/schemas/createTournament'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import { Form, useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'
import { CardWrapper } from '../auth/Card-Wrapper'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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

import { tournamentStageType } from '@/models/tournament'
import { SeedOrdering } from '@/schemas/createTournament'

const CreateTournament = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof CreateTournamentSchema>>({
    resolver: zodResolver(CreateTournamentSchema),
    defaultValues: {
      tournamentName: '',
      description: '',
      type: tournamentStageType.singleElimination,
      thirdPlaceMatch: false,
      seedOrdering: SeedOrdering.InnerOuter,
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
                name='tournamentName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Name</FormLabel>
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
                        className='resize-none w-full h-32'
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
                    <FormLabel>Tournament Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a tournament type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          value={tournamentStageType.singleElimination}
                        >
                          Single Elimination
                        </SelectItem>
                        <SelectItem
                          value={tournamentStageType.doubleElimination}
                        >
                          Double Elimenation
                        </SelectItem>
                        <SelectItem value={tournamentStageType.roundRobin}>
                          Round Robin
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                name='Participants'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants{' (User)'}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder='' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='seedOrdering'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seed Order</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a Seed Order type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SeedOrdering.Natural}>
                          Natural
                        </SelectItem>
                        <SelectItem value={SeedOrdering.Reverse}>
                          Reverse
                        </SelectItem>
                        <SelectItem value={SeedOrdering.HalfShift}>
                          Half Shift
                        </SelectItem>
                        <SelectItem value={SeedOrdering.ReverseHalfShift}>
                          Reverse Half Shift
                        </SelectItem>
                        <SelectItem value={SeedOrdering.PairFlip}>
                          Pair Flip
                        </SelectItem>
                        <SelectItem value={SeedOrdering.InnerOuter}>
                          Inner Outer
                        </SelectItem>
                        <SelectItem value={SeedOrdering.EffortBalanced}>
                          Effort Balanced
                        </SelectItem>
                        <SelectItem value={SeedOrdering.SeedOptimized}>
                          Seed Optimized
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
