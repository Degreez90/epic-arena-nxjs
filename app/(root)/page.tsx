import Hero from '@/components/hero/Hero'
import Games from '@/components/games/Games'
import { currentUser } from '@/lib/auth'

export default async function Home() {
  const user = await currentUser()
  return (
    <div>
      <Hero />
      <Games />
    </div>
  )
}
