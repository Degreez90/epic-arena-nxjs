import Hero from '@/components/hero/Hero'
import CurrentTournaments from '@/components/home/CurrentTournaments'

export default async function Home() {
  return (
    <div>
      <Hero />
      <CurrentTournaments />
    </div>
  )
}
