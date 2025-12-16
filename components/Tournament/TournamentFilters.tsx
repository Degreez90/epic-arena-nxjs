'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { getAllGames } from '@/actions/games/manage-games'

interface TournamentFiltersProps {
  onFilterChange: (filters: {
    search?: string
    status?: string
    type?: string
    gameId?: string
    createdBy?: string
  }) => void
  showCreatorFilter?: boolean
  creators?: Array<{ id: string; userName: string }>
}

export function TournamentFilters({
  onFilterChange,
  showCreatorFilter = false,
  creators = [],
}: TournamentFiltersProps) {
  const [games, setGames] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [gameId, setGameId] = useState('all')
  const [createdBy, setCreatedBy] = useState('all')

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getAllGames()
        setGames(data)
      } catch (error) {
        console.error('Error fetching games:', error)
      }
    }
    fetchGames()
  }, [])

  const handleFilterChange = () => {
    onFilterChange({
      search: search || undefined,
      status: status === 'all' ? undefined : status,
      type: type === 'all' ? undefined : type,
      gameId: gameId === 'all' ? undefined : gameId,
      createdBy: createdBy === 'all' ? undefined : createdBy,
    })
  }

  const handleReset = () => {
    setSearch('')
    setStatus('all')
    setType('all')
    setGameId('all')
    setCreatedBy('all')
    onFilterChange({})
  }

  return (
    <div className='space-y-4 rounded-lg border p-4 bg-card'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
        <div>
          <label className='text-sm font-medium'>Search</label>
          <Input
            placeholder='Search tournaments...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <label className='text-sm font-medium'>Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder='All statuses' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Statuses</SelectItem>
              <SelectItem value='pending'>Pending</SelectItem>
              <SelectItem value='progress'>In Progress</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
              <SelectItem value='archived'>Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm font-medium'>Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder='All types' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Types</SelectItem>
              <SelectItem value='single_elimination'>
                Single Elimination
              </SelectItem>
              <SelectItem value='double_elimination'>
                Double Elimination
              </SelectItem>
              <SelectItem value='round_robin'>Round Robin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm font-medium'>Game</label>
          <Select value={gameId} onValueChange={setGameId}>
            <SelectTrigger>
              <SelectValue placeholder='All games' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Games</SelectItem>
              {games.map((game) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showCreatorFilter && creators.length > 0 && (
          <div>
            <label className='text-sm font-medium'>Creator</label>
            <Select value={createdBy} onValueChange={setCreatedBy}>
              <SelectTrigger>
                <SelectValue placeholder='All creators' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Creators</SelectItem>
                {creators.map((creator) => (
                  <SelectItem key={creator.id} value={creator.id}>
                    {creator.userName || creator.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className='flex gap-2 justify-end'>
        <Button variant='outline' onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleFilterChange}>Apply Filters</Button>
      </div>
    </div>
  )
}

export default TournamentFilters
