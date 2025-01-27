'use client'
import React, { useEffect, useState } from 'react'
import Script from 'next/script'

import { TournamentType } from '@/models/tournament'
import { useRouter } from 'next/router'

interface TournamentDetailsProps {
  tournament: TournamentType | null
}

export const dynamic = 'force-dynamic' // Force dynamic rendering

const TournamentDetails: React.FC<TournamentDetailsProps> = ({
  tournament,
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    if (scriptLoaded && tournament) {
      console.log('Rendering brackets viewer')

      const container = document.getElementById('brackets-viewer')
      if (container) {
        // Clear any existing content
        container.innerHTML = ''

        window.bracketsViewer.render({
          stages: tournament.stage,
          matches: tournament.match,
          matchGames: tournament.match_game,
          participants: tournament.participant,
        })
      }
    }
  }, [scriptLoaded, tournament])

  if (!tournament) {
    return <div>Tournament not found</div>
  }

  return (
    <>
      <link
        rel='stylesheet'
        href='https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.css'
      />
      <div className='brackets-viewer' id='brackets-viewer'></div>
      <Script
        src='https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.js'
        strategy='lazyOnload'
        onLoad={() => setScriptLoaded(true)}
        onError={() => console.error('Failed to load bracketsViewer script')}
      />
    </>
  )
}

export default TournamentDetails
