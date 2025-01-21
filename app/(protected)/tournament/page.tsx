import React, { useEffect } from 'react'

async function render() {
  window.bracketsViewer.render({
    stages: data.stage,
    matches: data.match,
    matchGames: data.match_game,
    participants: data.participant,
  })
}

const page = () => {
  useEffect(() => {
    render()
  })
  return <div className='brackets-viewer'></div>
}

export default page
