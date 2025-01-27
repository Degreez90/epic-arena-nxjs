// 'use client'

// import React, { useEffect, useState } from 'react'
// import Script from 'next/script'
// import axios from 'axios'

// interface BracketData {
//   stage: any[]
//   match: any[]
//   match_game: any[]
//   participant: any[]
// }

// const Page = () => {
//   const [bracketData, setData] = useState<BracketData | null>(null)

//   const [scriptLoaded, setScriptLoaded] = useState(false)

//   const renderBrackets = async () => {
//     const params = new URLSearchParams({
//       tournamentId: '1737670616240',
//     })

//     try {
//       // Fetch tournament data
//       const response = await axios.get(`/api/tournament?${params.toString()}`)
//       const { data } = response.data

//       console.log('Data for bracketsViewer:', data)

//       if (data) {
//         setData(data)
//       } else {
//         console.error('Data not available')
//       }
//     } catch (error) {
//       console.error('Bracket data wasnt fetched', error)
//     }
//   }

//   useEffect(() => {
//     if (scriptLoaded && !bracketData) {
//       renderBrackets()
//     }
//     if (scriptLoaded && bracketData) {
//       window.bracketsViewer.render({
//         stages: bracketData.stage,
//         matches: bracketData.match,
//         matchGames: bracketData.match_game,
//         participants: bracketData.participant,
//       })
//     }
//   }, [scriptLoaded, bracketData])

//   return (
//     <>
//       <link
//         rel='stylesheet'
//         href='https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.css'
//       />
//       <div className='brackets-viewer' id='brackets-viewer'></div>
//       <Script
//         src='https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.js'
//         strategy='lazyOnload'
//         onLoad={() => setScriptLoaded(true)}
//         onError={() => console.error('Failed to load bracketsViewer script')}
//       />
//     </>
//   )
// }

// export default Page

import React from 'react'
import TournamentList from '@/components/Tournament/TournamentList'
import { getAllTournaments } from '@/data/Tournaments/tournaments'
import { TournamentType } from '@/models/tournament'

// const getTournamentList = async () => {
//   try {
//     const tournaments: TournamentType[] = await getAllTournaments()

//     if (!tournaments) {
//       throw new Error('Error fetching tournaments')
//     }

//     return tournaments
//   } catch (error) {
//     console.error('Error fetching tournaments', error)
//   }
// }
const page = async () => {
  const tournaments: TournamentType[] = await getAllTournaments()

  if (!tournaments) {
    throw new Error('Error fetching tournaments')
  }

  return (
    <div>
      <TournamentList Tournaments={tournaments} />
    </div>
  )
}

export default page
