import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export type TournamentDTO = Prisma.Tournament & { _id: string }

const toDTO = (t: Prisma.Tournament): TournamentDTO => ({
  ...t,
  _id: t.id,
})

export const getAllTournaments = async (): Promise<TournamentDTO[]> => {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return tournaments.map(toDTO)
}

export const getTournamentById = async (
  id: string | number
): Promise<TournamentDTO | null> => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: String(id) },
  })

  if (!tournament) return null

  return toDTO(tournament)
}
