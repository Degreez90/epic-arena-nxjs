// 'use client'

// import React, { useEffect } from 'react'
// import axios from 'axios'

// const page = () => {
//   useEffect(() => {
//     const renderBrackets = async () => {
//       const params = new URLSearchParams({
//         tournamentId: '1737670616240',
//       })
//       try {
//         const response = await axios.get(`/api/tournament?${params.toString()}`)
//         const data = response.data
//         console.log('Data for bracketsViewer:', {
//           stages: data.stage,
//           matches: data.match,
//           matchGames: data.match_game,
//           participants: data.participant,
//         })

//         // Ensure bracketsViewer is available
//         if (window.bracketsViewer) {
//           window.bracketsViewer.render({
//             stages: data.stages,
//             matches: data.matches,
//             matchGames: data.match_games,
//             participants: data.participants,
//           })
//         } else {
//           console.error('bracketsViewer is not available')
//         }
//       } catch (error) {
//         console.error('Error fetching tournament brackets', error)
//       }
//     }
//     renderBrackets()
//   }, [])
//   return <div className='brackets-viewer'></div>
// }

// export default page

'use client'

import React, { useEffect } from 'react'
import Script from 'next/script'
import axios from 'axios'

const Page = () => {
  useEffect(() => {
    const renderBrackets = async () => {
      const params = new URLSearchParams({
        tournamentId: '1737670616240',
      })

      try {
        // Fetch tournament data
        const response = await axios.get(`/api/tournament?${params.toString()}`)
        const { data } = response.data

        console.log('Data for bracketsViewer:', data)

        // Ensure bracketsViewer is available before rendering
        if (window.bracketsViewer) {
          window.bracketsViewer.render({
            stages: data.stage,
            matches: data.match,
            matchGames: data.match_game,
            participants: data.participant,
          })
        } else {
          console.error('bracketsViewer is not available')
        }
      } catch (error) {
        console.error('Error fetching tournament brackets', error)
      }
    }

    // Wait for the script to load before rendering
    if (window.bracketsViewer) {
      renderBrackets()
    } else {
      const interval = setInterval(() => {
        if (window.bracketsViewer) {
          clearInterval(interval)
          renderBrackets()
        }
      }, 100) // Check every 100ms
    }
  }, [])

  return (
    <>
      <Script
        src='https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.js'
        strategy='lazyOnload'
        onError={() => console.error('Failed to load bracketsViewer script')}
      />
      <link
        rel='stylesheet'
        href='https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.css'
      />
      <div className='brackets-viewer' id='brackets-viewer'></div>
    </>
  )
}

export default Page
