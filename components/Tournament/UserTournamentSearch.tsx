'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UserTournamentSearchProps {
  onSearchComplete?: (results: any[]) => void
}

export function UserTournamentSearch({
  onSearchComplete,
}: UserTournamentSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      alert('Please enter a search query')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/tournaments/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: searchQuery }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.tournaments || [])
      setSearched(true)
      onSearchComplete?.(data.tournaments || [])

      if (data.tournaments.length === 0) {
        console.info('No tournaments found')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Failed to search tournaments')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find User Tournaments</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <form onSubmit={handleSearch} className='flex gap-2'>
          <Input
            placeholder='Search by username or email...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
          <Button type='submit' disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {searched && (
          <div className='text-sm text-muted-foreground'>
            Found {results.length} tournament{results.length !== 1 ? 's' : ''}
          </div>
        )}

        {results.length > 0 && (
          <div className='space-y-2 mt-4'>
            {results.map((tournament) => (
              <div
                key={tournament.id}
                className='border rounded-lg p-3 bg-muted/50'
              >
                <h3 className='font-semibold'>{tournament.name}</h3>
                <p className='text-sm text-muted-foreground'>
                  {tournament.description}
                </p>
                <div className='flex gap-4 mt-2 text-xs'>
                  <span className='inline-block px-2 py-1 bg-primary text-primary-foreground rounded'>
                    {tournament.type?.replace(/_/g, ' ') || 'Unknown'}
                  </span>
                  <span className='inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded'>
                    Status: {tournament.status}
                  </span>
                  {tournament.game && (
                    <span className='inline-block px-2 py-1 bg-accent text-accent-foreground rounded'>
                      {tournament.game.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UserTournamentSearch
