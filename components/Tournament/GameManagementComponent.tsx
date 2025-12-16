'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2, Edit } from 'lucide-react'
import {
  createGame,
  getAllGames,
  updateGame,
  deleteGame,
} from '@/actions/games/manage-games'

const gameFormSchema = z.object({
  name: z.string().min(2, 'Game name must be at least 2 characters').max(100),
  description: z.string().optional(),
  genre: z.string().optional(),
})

type GameFormValues = z.infer<typeof gameFormSchema>

export function GameManagementComponent() {
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<any | null>(null)

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      name: '',
      description: '',
      genre: '',
    },
  })

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    setLoading(true)
    try {
      const data = await getAllGames()
      setGames(data)
    } catch (error) {
      console.error('Error loading games:', error)
      alert('Failed to load games')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: GameFormValues) => {
    try {
      if (isEditDialogOpen && selectedGame) {
        const result = await updateGame(selectedGame.id, values)
        if (result.error) {
          alert(`Error: ${result.error}`)
        } else {
          alert('Game updated successfully')
          loadGames()
          setIsEditDialogOpen(false)
          form.reset()
        }
      } else {
        const result = await createGame(values)
        if (result.error) {
          alert(`Error: ${result.error}`)
        } else {
          alert('Game created successfully')
          loadGames()
          setIsDialogOpen(false)
          form.reset()
        }
      }
    } catch (error) {
      alert('Something went wrong')
    }
  }

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return

    try {
      const result = await deleteGame(gameId)
      if (result.error) {
        alert(`Error: ${result.error}`)
      } else {
        alert('Game deleted successfully')
        loadGames()
      }
    } catch (error) {
      alert('Failed to delete game')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Game Management</h2>
          <p className='text-muted-foreground'>
            Create and manage games for tournaments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='gap-2'>
              <Plus className='w-4 h-4' />
              Add Game
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Create New Game</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter game name' {...field} />
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
                        <Input placeholder='Game description' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='genre'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., Fighting, Strategy, RPG'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full'>
                  Create Game
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid gap-4'>
        {loading ? (
          <Card>
            <CardContent className='pt-6'>
              <p className='text-center text-muted-foreground'>
                Loading games...
              </p>
            </CardContent>
          </Card>
        ) : games.length === 0 ? (
          <Card>
            <CardContent className='pt-6'>
              <p className='text-center text-muted-foreground'>
                No games created yet
              </p>
            </CardContent>
          </Card>
        ) : (
          games.map((game) => (
            <Card key={game.id} className='hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <CardTitle>{game.name}</CardTitle>
                    {game.description && (
                      <p className='text-sm text-muted-foreground mt-1'>
                        {game.description}
                      </p>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => {
                            setSelectedGame(game)
                            form.reset({
                              name: game.name,
                              description: game.description,
                              genre: game.genre,
                            })
                          }}
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                      </DialogTrigger>
                      {selectedGame?.id === game.id && (
                        <DialogContent className='max-w-md'>
                          <DialogHeader>
                            <DialogTitle>Edit Game</DialogTitle>
                          </DialogHeader>
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className='space-y-4'
                            >
                              <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Game Name</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
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
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name='genre'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Genre</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <Button type='submit' className='w-full'>
                                Update Game
                              </Button>
                            </form>
                          </Form>
                        </DialogContent>
                      )}
                    </Dialog>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => handleDeleteGame(game.id)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-2 text-sm'>
                  {game.genre && (
                    <p>
                      <span className='text-muted-foreground'>Genre:</span>{' '}
                      {game.genre}
                    </p>
                  )}
                  <p>
                    <span className='text-muted-foreground'>Used in:</span>{' '}
                    {game.tournaments?.length || 0} tournament
                    {game.tournaments?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default GameManagementComponent
