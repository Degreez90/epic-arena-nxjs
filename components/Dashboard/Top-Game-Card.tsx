import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GameStats } from '@/types/users/users'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

interface TopGamesCardProps {
  games: GameStats[]
  totalGames: number
}

export function TopGamesCard({ games, totalGames }: TopGamesCardProps) {
  return (
    <Card className='col-span-1 md:col-span-2'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Top Games Played
          <span className='text-sm font-normal text-muted-foreground'>
            Total: {totalGames} tournaments
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {games.map((game) => {
            const percentage = (game.count / totalGames) * 100
            return (
              <div key={game.id} className='flex items-center space-x-4'>
                <div className='flex items-center space-x-3 flex-1'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={game.icon} />
                    <AvatarFallback
                      className={game.color.replace('text-', 'bg-')}
                    >
                      {game.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-medium'>{game.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {game.count} tournaments
                      </p>
                    </div>
                    <Progress value={percentage} className='mt-2' />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
