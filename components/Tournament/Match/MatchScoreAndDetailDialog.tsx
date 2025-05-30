'use client'
import { useEffect, useState } from 'react'
import { Tournament, TournamentStatus } from '@/models/tournament'
import { useTournamentStore } from '@/store/useTournamentStore'
import { MatchFrontend } from '@/types/tournament/tournament'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
export const tabs = {
  matchDetails: 'matchDetails',
  reportScore: 'reportScore',
} as const

export interface IMatchScoreAndDetailDialog {
  open: boolean
  onClose: () => void
  match: MatchFrontend
  tab: string
}

const MatchScoreAndDetailDialog: React.FC<IMatchScoreAndDetailDialog> = ({
  open,
  onClose,
  match,
  tab = tabs.reportScore,
}) => {
  const [tabIndex, setTabIndex] = useState<'matchDetails' | 'reportScore'>(
    'matchDetails'
  )
  const tournamentData = useTournamentStore((state) => state.tournamentData)

  // Determine if the "Edit Score" button should be hidden (2 = ready, 3 = running)
  const hideEditScoreButton =
    (match?.status !== 2 && match?.status !== 3) ||
    tournamentData?.status !== TournamentStatus.progress

  useEffect(() => {
    if (hideEditScoreButton) setTabIndex('matchDetails')
    else {
      setTabIndex('reportScore')
    }
  }, [tab, hideEditScoreButton])

  const handleTabChange = (value: string) => {
    if (value === 'matchDetails' || value === 'reportScore') {
      setTabIndex(value)
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[425px]'>
          <Tabs
            value={tabIndex}
            onValueChange={handleTabChange}
            defaultValue='matchdetails'
            className='w-[350px]'
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value={tabs.matchDetails}>Match Details</TabsTrigger>

              <TabsTrigger
                value={tabs.reportScore}
                disabled={hideEditScoreButton}
              >
                Report Score
              </TabsTrigger>
            </TabsList>
            <TabsContent value={tabs.matchDetails}></TabsContent>
            {!hideEditScoreButton && (
              <TabsContent value={tabs.reportScore}>
                Change your password here.
              </TabsContent>
            )}

            <TabsContent value={tabs.matchDetails}>
              <Card>
                <CardHeader>
                  <DialogTitle className='flex justify-center'>
                    Match Detials
                  </DialogTitle>
                  <CardDescription className='flex justify-center'>
                    Details on the match
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='flex items-center justify-center gap-4'>
                    <div className='relative w-20 h-20'>
                      <Image
                        src='/images/hero.png'
                        alt='Player 1'
                        fill
                        className='object-cover rounded'
                      />
                    </div>
                    <span className='text-2xl font-bold text-gray-700'>VS</span>
                    <div className='relative w-20 h-20'>
                      <Image
                        src='/images/hero.png'
                        alt='Player 2'
                        fill
                        className='object-cover rounded'
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-center'>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value={tabs.reportScore}>
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged
                    out.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='space-y-1'>
                    <Label htmlFor='current'>Current password</Label>
                    <Input id='current' type='password' />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='new'>New password</Label>
                    <Input id='new' type='password' />
                  </div>
                </CardContent>
                <CardFooter className='flex justify-center'>
                  <Button>Save password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MatchScoreAndDetailDialog
