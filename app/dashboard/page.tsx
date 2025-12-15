'use client'

import { useState } from 'react'
import { StatCard } from '@/components/dashboard/Stat-Card'
import { PlacementCard } from '@/components/dashboard/Placement-Card'
import { TopGamesCard } from '@/components/dashboard/Top-Game-Card'
import { RecentTournaments } from '@/components/dashboard/Recent-Tournaments'
import { GameStats, TournamentHistory } from '@/types/users/users'
import {
  Trophy,
  Target,
  TrendingUp,
  DollarSign,
  Gamepad2,
  Calendar,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data - replace with API calls
const mockStats = {
  totalTournaments: 127,
  firstPlace: 15,
  secondPlace: 22,
  thirdPlace: 18,
  topTen: 89,
  totalEarnings: 12500,
  winRate: 11.8,
  favoriteGame: 'Valorant',
}

const mockGames: GameStats[] = [
  {
    id: '1',
    name: 'Valorant',
    count: 45,
    icon: '/games/valorant.png',
    color: 'text-red-500',
    recentPlacements: [1, 2, 5, 1, 3],
  },
  {
    id: '2',
    name: 'Counter-Strike 2',
    count: 32,
    icon: '/games/cs2.png',
    color: 'text-orange-500',
    recentPlacements: [2, 3, 1, 4, 2],
  },
  {
    id: '3',
    name: 'League of Legends',
    count: 28,
    icon: '/games/lol.png',
    color: 'text-blue-500',
    recentPlacements: [3, 5, 2, 1, 4],
  },
  {
    id: '4',
    name: 'Dota 2',
    count: 12,
    icon: '/games/dota2.png',
    color: 'text-purple-500',
    recentPlacements: [1, 2, 3, 4, 5],
  },
  {
    id: '5',
    name: 'Rocket League',
    count: 10,
    icon: '/games/rl.png',
    color: 'text-green-500',
    recentPlacements: [2, 1, 4, 3, 2],
  },
]

const mockRecentTournaments: TournamentHistory[] = [
  {
    id: '1',
    name: 'Valorant Champions Tour 2024',
    game: 'Valorant',
    date: '2024-03-15',
    placement: 1,
    totalParticipants: 128,
    earnings: 5000,
  },
  {
    id: '2',
    name: 'CS2 Major Championship',
    game: 'Counter-Strike 2',
    date: '2024-03-10',
    placement: 2,
    totalParticipants: 64,
    earnings: 2500,
  },
  {
    id: '3',
    name: 'LoL World Championship',
    game: 'League of Legends',
    date: '2024-03-05',
    placement: 5,
    totalParticipants: 32,
    earnings: 1000,
  },
  {
    id: '4',
    name: 'Dota 2 International',
    game: 'Dota 2',
    date: '2024-02-28',
    placement: 3,
    totalParticipants: 256,
    earnings: 3000,
  },
  {
    id: '5',
    name: 'Rocket League Championship',
    game: 'Rocket League',
    date: '2024-02-20',
    placement: 1,
    totalParticipants: 128,
    earnings: 2000,
  },
]

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('all-time')
  const [activeGame, setActiveGame] = useState('all')

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Tournament Dashboard
            </h1>
            <p className='text-muted-foreground'>
              Track your tournament performance and statistics
            </p>
          </div>
          <div className='flex items-center space-x-4'>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select time range' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='last-30'>Last 30 days</SelectItem>
                <SelectItem value='last-90'>Last 90 days</SelectItem>
                <SelectItem value='this-year'>This Year</SelectItem>
                <SelectItem value='all-time'>All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activeGame} onValueChange={setActiveGame}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by game' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Games</SelectItem>
                {mockGames.map((game) => (
                  <SelectItem key={game.id} value={game.id}>
                    {game.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <StatCard
            title='Total Tournaments'
            value={mockStats.totalTournaments}
            description={`${mockStats.winRate}% win rate`}
            icon={<Trophy className='h-4 w-4 text-muted-foreground' />}
            trend={{ value: 12.5, label: 'from last month', isPositive: true }}
          />
          <StatCard
            title='Total Earnings'
            value={`$${mockStats.totalEarnings?.toLocaleString()}`}
            description='Lifetime earnings'
            icon={<DollarSign className='h-4 w-4 text-muted-foreground' />}
            trend={{ value: 8.2, label: 'from last month', isPositive: true }}
          />
          <StatCard
            title='Favorite Game'
            value={mockStats.favoriteGame}
            description='Most played game'
            icon={<Gamepad2 className='h-4 w-4 text-muted-foreground' />}
          />
          <StatCard
            title='Tournaments This Month'
            value='8'
            description='5 tournaments remaining'
            icon={<Calendar className='h-4 w-4 text-muted-foreground' />}
          />
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='placements'>Placements</TabsTrigger>
            <TabsTrigger value='history'>History</TabsTrigger>
            <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Placement Cards */}
              <div className='space-y-4'>
                <PlacementCard
                  title='First Place'
                  count={mockStats.firstPlace}
                  total={mockStats.totalTournaments}
                  icon='trophy'
                  color='text-yellow-500'
                  description='Tournaments won'
                />
                <PlacementCard
                  title='Second Place'
                  count={mockStats.secondPlace}
                  total={mockStats.totalTournaments}
                  icon='medal'
                  color='text-gray-400'
                  description='Runner-up finishes'
                />
                <PlacementCard
                  title='Third Place'
                  count={mockStats.thirdPlace}
                  total={mockStats.totalTournaments}
                  icon='award'
                  color='text-amber-700'
                  description='Third place finishes'
                />
              </div>

              {/* Top Games */}
              <TopGamesCard
                games={mockGames}
                totalGames={mockStats.totalTournaments}
              />

              {/* Additional Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Target className='h-5 w-5 mr-2' />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Top 10 Rate
                      </span>
                      <span className='font-medium'>
                        {(
                          (mockStats.topTen / mockStats.totalTournaments) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (mockStats.topTen / mockStats.totalTournaments) * 100
                      }
                      className='h-2'
                    />
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Podium Rate
                      </span>
                      <span className='font-medium'>
                        {(
                          ((mockStats.firstPlace +
                            mockStats.secondPlace +
                            mockStats.thirdPlace) /
                            mockStats.totalTournaments) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        ((mockStats.firstPlace +
                          mockStats.secondPlace +
                          mockStats.thirdPlace) /
                          mockStats.totalTournaments) *
                        100
                      }
                      className='h-2'
                    />
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Average Placement
                      </span>
                      <span className='font-medium'>6.2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Tournaments */}
            <RecentTournaments tournaments={mockRecentTournaments} />
          </TabsContent>

          <TabsContent value='placements'>
            <Card>
              <CardHeader>
                <CardTitle>Placement Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add placement chart/visualization here */}
                <div className='h-[300px] flex items-center justify-center border rounded-lg'>
                  <p className='text-muted-foreground'>
                    Placement chart visualization would go here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='history'>
            <RecentTournaments tournaments={mockRecentTournaments} />
          </TabsContent>
        </Tabs>

        {/* Quick Stats Footer */}
        <div className='mt-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
          <Card>
            <CardContent className='pt-6 text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {mockStats.topTen}
              </div>
              <p className='text-sm text-muted-foreground'>Top 10 Finishes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6 text-center'>
              <div className='text-2xl font-bold'>
                {(
                  mockStats.totalTournaments - mockStats.topTen
                ).toLocaleString()}
              </div>
              <p className='text-sm text-muted-foreground'>Other Placements</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6 text-center'>
              <div className='text-2xl font-bold'>
                {mockStats.totalTournaments > 0
                  ? (
                      (mockStats.topTen / mockStats.totalTournaments) *
                      100
                    ).toFixed(1) + '%'
                  : '0%'}
              </div>
              <p className='text-sm text-muted-foreground'>Consistency Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6 text-center'>
              <div className='text-2xl font-bold'>
                {mockRecentTournaments.length}
              </div>
              <p className='text-sm text-muted-foreground'>Recent Entries</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
