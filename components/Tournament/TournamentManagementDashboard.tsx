'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TournamentForm from './TournamentForm'
import TournamentFilters from './TournamentFilters'
import UserTournamentSearch from './UserTournamentSearch'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

interface Tournament {
  id: string
  name: string
  description?: string
  type?: string
  status: string
  progress: number
  createdAt: Date | string
  updatedAt: Date | string
  game?: any
  user?: any
}

export function TournamentManagementDashboard() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    loadTournaments()
  }, [])

  const loadTournaments = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/tournaments')
      if (!response.ok) {
        throw new Error('Failed to fetch tournaments')
      }
      const json = await response.json()
      const data = json.data || []
      setTournaments(data as any)
      setFilteredTournaments(data as any)
    } catch (error) {
      console.error('Error loading tournaments:', error)
      alert('Failed to load tournaments')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = async (filters: any) => {
    let filtered = tournaments

    if (filters.search) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.description?.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status)
    }

    if (filters.type) {
      filtered = filtered.filter((t) => t.type === filters.type)
    }

    if (filters.gameId) {
      filtered = filtered.filter((t) => t.game?.id === filters.gameId)
    }

    setFilteredTournaments(filtered)
  }

  const handleDeleteTournament = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return

    try {
      const response = await fetch(`/api/tournaments/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        alert('Tournament deleted successfully')
        loadTournaments()
      } else {
        alert('Failed to delete tournament')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete tournament')
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'progress':
        return 'default'
      case 'completed':
        return 'outline'
      case 'archived':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getTypeLabel = (type?: string) => {
    if (!type) return 'Unknown'
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className='w-full space-y-6'>
      <Tabs defaultValue='tournaments' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='tournaments'>Tournaments</TabsTrigger>
          <TabsTrigger value='search'>Search Users</TabsTrigger>
        </TabsList>

        <TabsContent value='tournaments' className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Tournament Management</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className='gap-2'>
                  <Plus className='w-4 h-4' />
                  Create Tournament
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-md'>
                <DialogHeader>
                  <DialogTitle>Create New Tournament</DialogTitle>
                </DialogHeader>
                <TournamentForm
                  onSuccess={() => {
                    setIsDialogOpen(false)
                    loadTournaments()
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <TournamentFilters onFilterChange={handleFilterChange} />

          <div className='space-y-4'>
            {loading ? (
              <Card>
                <CardContent className='pt-6'>
                  <p className='text-center text-muted-foreground'>
                    Loading tournaments...
                  </p>
                </CardContent>
              </Card>
            ) : filteredTournaments.length === 0 ? (
              <Card>
                <CardContent className='pt-6'>
                  <p className='text-center text-muted-foreground'>
                    No tournaments found
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className='grid gap-4'>
                {filteredTournaments.map((tournament) => (
                  <Card
                    key={tournament.id}
                    className='hover:shadow-md transition-shadow'
                  >
                    <CardHeader>
                      <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                          <CardTitle className='text-xl'>
                            {tournament.name}
                          </CardTitle>
                          {tournament.description && (
                            <p className='text-sm text-muted-foreground mt-1'>
                              {tournament.description}
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
                                onClick={() =>
                                  setSelectedTournament(tournament)
                                }
                              >
                                <Edit className='w-4 h-4' />
                              </Button>
                            </DialogTrigger>
                            {selectedTournament?.id === tournament.id && (
                              <DialogContent className='max-w-md'>
                                <DialogHeader>
                                  <DialogTitle>Edit Tournament</DialogTitle>
                                </DialogHeader>
                                <TournamentForm
                                  tournament={tournament}
                                  isEditing
                                  onSuccess={() => {
                                    setIsEditDialogOpen(false)
                                    loadTournaments()
                                  }}
                                />
                              </DialogContent>
                            )}
                          </Dialog>
                          <Button
                            size='sm'
                            variant='destructive'
                            onClick={() =>
                              handleDeleteTournament(tournament.id)
                            }
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-3'>
                        <div className='flex flex-wrap gap-2'>
                          <Badge
                            variant={getStatusBadgeVariant(tournament.status)}
                          >
                            {tournament.status}
                          </Badge>
                          {tournament.type && (
                            <Badge variant='outline'>
                              {getTypeLabel(tournament.type)}
                            </Badge>
                          )}
                          {tournament.game && (
                            <Badge variant='secondary'>
                              {tournament.game.name}
                            </Badge>
                          )}
                        </div>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                          <div>
                            <p className='text-muted-foreground'>Progress</p>
                            <div className='w-full bg-muted rounded-full h-2 mt-1'>
                              <div
                                className='bg-primary h-2 rounded-full'
                                style={{ width: `${tournament.progress}%` }}
                              />
                            </div>
                            <p className='text-xs mt-1'>
                              {tournament.progress}%
                            </p>
                          </div>
                          <div>
                            <p className='text-muted-foreground'>Created</p>
                            <p className='text-xs'>
                              {new Date(
                                tournament.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value='search' className='space-y-4'>
          <UserTournamentSearch
            onSearchComplete={(results) => {
              console.log('Search results:', results)
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TournamentManagementDashboard
