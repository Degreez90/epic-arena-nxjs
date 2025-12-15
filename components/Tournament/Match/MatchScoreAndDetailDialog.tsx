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
import MatchDetailsTab from './MatchDetails'
import ReportScoreTab from './ReportScore'
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
                // disabled={hideEditScoreButton}//! This line is commented out to allow the tab to be clickable
              >
                Report Score
              </TabsTrigger>
            </TabsList>

            <TabsContent value={tabs.matchDetails}>
              <MatchDetailsTab />
            </TabsContent>
            <TabsContent value={tabs.reportScore}>
              <ReportScoreTab match={match} onClose={onClose} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MatchScoreAndDetailDialog
