import React from 'react'
import Container from '../Container'
import tourneydata from '@/app/utils/games'
import Gamelist from './Gamelist'

console.log('this web burn 5656 67676 wergdf')

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
