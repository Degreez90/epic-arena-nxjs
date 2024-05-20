import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Tournament {
  id: number
  game: string
  prize: string
  date: string
  country: string
  difficulty: string
  enrolled: string
  entry_credits: number
  tourney_type: string
  type: string
  img: string
  team_size: string
  max_teams: number
  platform: string
  place: {
    first_place: string
    second_place: string
    third_place: string
  }
  registration: string
  start_time: string
}

interface Props {
  gameslist: Tournament[]
}

const Gamelist: React.FC<Props> = ({ gameslist }) => {
  return (
    <div className='flex flex-wrap w-full justify-center sm:justify-around'>
      {gameslist.map((game) => (
        <div key={game.id} className='w-96 mb-4'>
          <Card className='h-60'>
            <CardHeader>
              <CardTitle>{game.game}</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default Gamelist
