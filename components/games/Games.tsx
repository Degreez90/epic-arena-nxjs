import React from 'react'
import Container from '../Container'
import tourneydata from '@/utils/games'
import Gamelist from './Gamelist'

const Games = () => {
  return (
    <Container>
      <div className='flex justify-center p-3 mt-28'>
        <Gamelist gameslist={tourneydata} />
      </div>
    </Container>
  )
}

export default Games
