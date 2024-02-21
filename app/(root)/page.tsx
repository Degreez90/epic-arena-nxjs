import Image from 'next/image'
import Headline from '@/components/headline/Headline'
import Hero from '@/components/Hero/Hero'
import Games from '@/components/games/Games'

export default function Home() {
  return (
    <div>
      <Headline />
      <Hero />
      <Games />
    </div>
  )
}
