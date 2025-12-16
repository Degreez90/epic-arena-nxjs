import React from 'react'
import Container from '@/components/Container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TournamentManagementDashboard from '@/components/Tournament/TournamentManagementDashboard'
import GameManagementComponent from '@/components/Tournament/GameManagementComponent'

const TournamentsPage = () => {
  return (
    <Container>
      <div className='space-y-6 py-8'>
        <div>
          <h1 className='text-4xl font-bold tracking-tight'>
            Tournament Management Hub
          </h1>
          <p className='text-lg text-muted-foreground mt-2'>
            Create and manage tournaments and games. View all tournaments,
            manage games, and search for user participation.
          </p>
        </div>
        <Tabs defaultValue='tournaments' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='tournaments'>Tournaments</TabsTrigger>
            <TabsTrigger value='games'>Games</TabsTrigger>
          </TabsList>
          <TabsContent value='tournaments' className='space-y-4'>
            <TournamentManagementDashboard />
          </TabsContent>
          <TabsContent value='games' className='space-y-4'>
            <GameManagementComponent />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}

export default TournamentsPage
