import Image from 'next/image'
import Link from 'next/link'
import { getAllTournaments } from '@/data/Tournaments/tournaments'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Trophy, Gamepad2 } from 'lucide-react'
import Container from '@/components/Container'

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  progress: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-700 border-green-500/20',
  archived: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
}

const statusLabels = {
  pending: 'Upcoming',
  progress: 'Live',
  completed: 'Completed',
  archived: 'Archived',
}

export default async function CurrentTournaments() {
  const tournaments = await getAllTournaments()

  if (!tournaments || tournaments.length === 0) {
    return null
  }

  // Filter to show only active/upcoming tournaments (not archived)
  const activeTournaments = tournaments
    .filter((t) => t.status !== 'archived')
    .slice(0, 6) // Show max 6 tournaments

  if (activeTournaments.length === 0) {
    return null
  }

  return (
    <section className='py-16 bg-gradient-to-b from-background to-secondary/20'>
      <Container>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
            Current Tournaments
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Join the competition and showcase your skills in our active gaming
            tournaments
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {activeTournaments.map((tournament) => {
            const gameImage =
              tournament.game?.images?.[0] || '/placeholder-game.jpg'
            const participantCount = tournament.participants?.length || 0

            return (
              <Card
                key={tournament.id}
                className='group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col'
              >
                <div className='relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-purple-600/20'>
                  {tournament.game?.images?.[0] ? (
                    <Image
                      src={gameImage}
                      alt={tournament.game?.name || 'Tournament'}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <Gamepad2 className='w-16 h-16 text-muted-foreground/30' />
                    </div>
                  )}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

                  {/* Status Badge */}
                  <div className='absolute top-4 right-4'>
                    <Badge
                      className={`${
                        statusColors[
                          tournament.status as keyof typeof statusColors
                        ]
                      } border font-semibold`}
                    >
                      {tournament.status === 'progress' && (
                        <span className='flex items-center gap-1'>
                          <span className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></span>
                          {
                            statusLabels[
                              tournament.status as keyof typeof statusLabels
                            ]
                          }
                        </span>
                      )}
                      {tournament.status !== 'progress' &&
                        statusLabels[
                          tournament.status as keyof typeof statusLabels
                        ]}
                    </Badge>
                  </div>

                  {/* Game Badge */}
                  {tournament.game && (
                    <div className='absolute bottom-4 left-4'>
                      <Badge
                        variant='secondary'
                        className='bg-black/60 backdrop-blur-sm border-white/20'
                      >
                        <Gamepad2 className='w-3 h-3 mr-1' />
                        {tournament.game.name}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className='space-y-2'>
                  <CardTitle className='line-clamp-2 group-hover:text-primary transition-colors'>
                    {tournament.name}
                  </CardTitle>
                  {tournament.description && (
                    <CardDescription className='line-clamp-2'>
                      {tournament.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className='space-y-3 flex-grow'>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                      <Users className='w-4 h-4' />
                      <span>{participantCount} players</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Trophy className='w-4 h-4' />
                      <span className='capitalize'>
                        {tournament.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {tournament.progress > 0 && (
                    <div className='space-y-1'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Progress</span>
                        <span className='font-medium'>
                          {tournament.progress}%
                        </span>
                      </div>
                      <div className='h-2 bg-secondary rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500'
                          style={{ width: `${tournament.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className='pt-4 border-t'>
                  <Button
                    asChild
                    className='w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors'
                  >
                    <Link href={`/tournaments/${tournament.id}`}>
                      View Tournament
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {tournaments.length > 6 && (
          <div className='text-center mt-12'>
            <Button asChild size='lg' variant='outline' className='group'>
              <Link href='/tournaments' className='flex items-center gap-2'>
                View All Tournaments
                <Trophy className='w-4 h-4 group-hover:rotate-12 transition-transform' />
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </section>
  )
}
