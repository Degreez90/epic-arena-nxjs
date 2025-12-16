'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import createTournament from '@/actions/tournament/create-tournament'
import updateTournament from '@/actions/tournament/update-tournament'
import { getAllGames } from '@/actions/games/manage-games'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

const tournamentFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Tournament name must be at least 2 characters')
    .max(100),
  description: z.string().optional(),
  gameId: z.string().optional(),
  type: z.enum(['single_elimination', 'double_elimination', 'round_robin']),
  seedingOrder: z.enum([
    'natural',
    'reverse',
    'half_shift',
    'reverse_half_shift',
    'no_seeding',
  ]),
  hasThirdPlaceMatch: z.boolean().default(false),
  status: z.enum(['pending', 'progress', 'completed', 'archived']).optional(),
})

type TournamentFormValues = z.infer<typeof tournamentFormSchema>

interface TournamentFormProps {
  tournament?: any
  isEditing?: boolean
  onSuccess?: () => void
}

export function TournamentForm({
  tournament,
  isEditing = false,
  onSuccess,
}: TournamentFormProps) {
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [gamesLoading, setGamesLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getAllGames()
        setGames(data)
      } catch (error) {
        console.error('Error fetching games:', error)
      } finally {
        setGamesLoading(false)
      }
    }
    fetchGames()
  }, [])

  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: tournament?.name || '',
      description: tournament?.description || '',
      gameId: tournament?.gameId || '',
      type: tournament?.type || 'single_elimination',
      seedingOrder: tournament?.seedingOrder || 'natural',
      hasThirdPlaceMatch: tournament?.hasThirdPlaceMatch || false,
      status: tournament?.status || 'pending',
    },
  })

  const onSubmit = async (values: TournamentFormValues) => {
    setLoading(true)
    try {
      if (isEditing && tournament) {
        const result = await updateTournament({
          tournamentId: tournament.id,
          name: values.name,
          description: values.description,
          status: values.status,
        })

        if (result.error) {
          console.error('Error:', result.error)
          alert(`Error: ${result.error}`)
        } else {
          alert('Tournament updated successfully')
          onSuccess?.()
        }
      } else {
        const result = await createTournament({
          tournamentName: values.name,
          description: values.description || '',
          type: values.type,
          thirdPlaceMatch: values.hasThirdPlaceMatch,
          seedOrdering: (values.seedingOrder === 'no_seeding'
            ? undefined
            : values.seedingOrder) as any,
        })

        if (result.error) {
          console.error('Error:', result.error)
          alert(`Error: ${result.error}`)
        } else {
          alert(result.success)
          form.reset()
          onSuccess?.()
        }
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tournament Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter tournament name' {...field} />
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
                <Input
                  placeholder='Tournament description'
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Optional: Describe your tournament
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEditing && (
          <>
            <FormField
              control={form.control}
              name='gameId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger disabled={gamesLoading}>
                        <SelectValue placeholder='Select a game' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {games.map((game) => (
                        <SelectItem key={game.id} value={game.id}>
                          {game.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the game for this tournament
                  </FormDescription>
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
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='single_elimination'>
                        Single Elimination
                      </SelectItem>
                      <SelectItem value='double_elimination'>
                        Double Elimination
                      </SelectItem>
                      <SelectItem value='round_robin'>Round Robin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the bracket format</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='seedingOrder'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seeding Order</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='natural'>Natural</SelectItem>
                      <SelectItem value='reverse'>Reverse</SelectItem>
                      <SelectItem value='half_shift'>Half Shift</SelectItem>
                      <SelectItem value='reverse_half_shift'>
                        Reverse Half Shift
                      </SelectItem>
                      <SelectItem value='no_seeding'>
                        No Seeding (Random)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How participants will be ordered
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='hasThirdPlaceMatch'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Third Place Match
                    </FormLabel>
                    <FormDescription>
                      Include a third place match in the tournament
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {isEditing && (
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='progress'>In Progress</SelectItem>
                    <SelectItem value='completed'>Completed</SelectItem>
                    <SelectItem value='archived'>Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type='submit' disabled={loading} className='w-full'>
          {loading
            ? 'Loading...'
            : isEditing
            ? 'Update Tournament'
            : 'Create Tournament'}
        </Button>
      </form>
    </Form>
  )
}

export default TournamentForm
