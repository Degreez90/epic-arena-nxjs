import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TournamentHistory } from '@/types/users/users'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Trophy } from 'lucide-react'

interface RecentTournamentsProps {
  tournaments: TournamentHistory[]
}

export function RecentTournaments({ tournaments }: RecentTournamentsProps) {
  const getPlacementColor = (placement: number) => {
    if (placement === 1) return 'bg-yellow-500/20 text-yellow-700'
    if (placement === 2) return 'bg-gray-400/20 text-gray-700'
    if (placement === 3) return 'bg-amber-700/20 text-amber-900'
    if (placement <= 10) return 'bg-green-500/20 text-green-700'
    return 'bg-gray-200 text-gray-700'
  }

  const getPlacementText = (placement: number) => {
    if (placement === 1) return '1st'
    if (placement === 2) return '2nd'
    if (placement === 3) return '3rd'
    return `${placement}th`
  }

  return (
    <Card className='col-span-1 md:col-span-3'>
      <CardHeader>
        <CardTitle>Recent Tournaments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className='flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors'
            >
              <div className='flex items-center space-x-4'>
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full ${getPlacementColor(
                    tournament.placement
                  )}`}
                >
                  <Trophy className='h-5 w-5' />
                </div>
                <div>
                  <h4 className='font-medium'>{tournament.name}</h4>
                  <div className='flex items-center space-x-4 text-sm text-muted-foreground mt-1'>
                    <span className='flex items-center'>
                      <Calendar className='h-3 w-3 mr-1' />
                      {tournament.date}
                    </span>
                    <span className='flex items-center'>
                      <Users className='h-3 w-3 mr-1' />
                      {tournament.totalParticipants} players
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <Badge
                  variant='secondary'
                  className={getPlacementColor(tournament.placement)}
                >
                  {getPlacementText(tournament.placement)}
                </Badge>
                {tournament.earnings && (
                  <div className='text-right'>
                    <p className='font-medium text-green-600'>
                      ${tournament.earnings.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
