import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { TournamentListProps } from '@/types/tournament/tournament'

const TournamentList: React.FC<TournamentListProps> = ({ Tournaments }) => {
  return (
    <div>
      <h2>Tournament List</h2>
      <ul>
        {Tournaments.map((tournament) => (
          <li key={tournament._id}>
            <Link href={`/tournaments/${tournament._id}`}>
              {tournament.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default TournamentList
