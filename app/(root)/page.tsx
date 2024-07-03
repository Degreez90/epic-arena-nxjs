import Image from 'next/image'
import Headline from '@/components/headline/Headline'
import Hero from '@/components/Hero/Hero'
import Games from '@/components/games/Games'
import { currentUser } from '@/lib/auth'

export default async function Home() {
  const user = await currentUser()
  return (
    <div>
      <Headline user={user} />
      <Hero />
      <Games />
    </div>
  )
}
