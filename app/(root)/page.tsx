import Hero from '@/components/Hero/Hero'
import Games from '@/components/Games/Games'
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
