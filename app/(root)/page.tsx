import Image from 'next/image'
import Nav from '@/components/nav/Nav'
import Hero from '@/components/hero/Hero'
import Games from '@/components/games/Games'
import { currentUser } from '@/lib/auth'

export default async function Home() {
  const user = await currentUser()
  return (
    <div>
      <Nav user={user} />
      <Hero />
      <Games />
    </div>
  )
}
