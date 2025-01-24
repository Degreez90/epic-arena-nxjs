'use client'
// components/BracketsViewer.js
import { useEffect } from 'react'

const BracketsViewer = ({ data }) => {
  console.log('Data for bracketsViewer1:', data)
  useEffect(() => {
    console.log('Data for bracketsViewer:', {
      stages: data.stages,
      matches: data.matches,
      matchGames: data.match_games,
      participants: data.participants,
    })
    // Load the CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.css'
    document.head.appendChild(link)

    // Load the JS
    const script = document.createElement('script')
    script.src =
      'https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.js'
    script.onload = () => {
      // Initialize the brackets viewer once the script is loaded
      window.bracketsViewer.render({
        stages: data.stage,
        matches: data.match,
        matchGames: data.match_game,
        participants: data.participant,
      })
    }
    document.body.appendChild(script)

    // Cleanup
    return () => {
      document.head.removeChild(link)
      document.body.removeChild(script)
    }
  }, [data])

  return <div id='brackets-viewer'></div>
}

export default BracketsViewer
