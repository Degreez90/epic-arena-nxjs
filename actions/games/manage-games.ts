'use server'

import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export interface CreateGameRequest {
  name: string
  description?: string
  genre?: string
  rules?: Record<string, any>
  images?: string[]
}

export interface GameResponse {
  success?: string
  error?: string
  game?: any
}

/**
 * Create a new game
 */
export const createGame = async (
  data: CreateGameRequest
): Promise<GameResponse> => {
  const user = await currentUser()

  if (!user) {
    return { error: 'User not found' }
  }

  try {
    const game = await prisma.game.create({
      data: {
        name: data.name,
        description: data.description,
        genre: data.genre,
        rules: data.rules,
        images: data.images || [],
        createdBy: user.id,
      },
    })

    return { success: 'Game created successfully', game }
  } catch (error) {
    console.error('Error creating game:', error)
    return { error: (error as Error).message }
  }
}

/**
 * Get all games
 */
export const getAllGames = async (): Promise<any[]> => {
  try {
    const games = await prisma.game.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return games
  } catch (error) {
    console.error('Error fetching games:', error)
    return []
  }
}

/**
 * Get games by creator
 */
export const getGamesByCreator = async (createdBy: string): Promise<any[]> => {
  try {
    const games = await prisma.game.findMany({
      where: { createdBy },
      orderBy: { createdAt: 'desc' },
    })
    return games
  } catch (error) {
    console.error('Error fetching games:', error)
    return []
  }
}

/**
 * Update a game
 */
export const updateGame = async (
  gameId: string,
  data: Partial<CreateGameRequest>
): Promise<GameResponse> => {
  const user = await currentUser()

  if (!user) {
    return { error: 'User not found' }
  }

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    })

    if (!game) {
      return { error: 'Game not found' }
    }

    if (game.createdBy !== user.id && user.role !== 'admin') {
      return { error: 'You do not have permission to update this game' }
    }

    const updated = await prisma.game.update({
      where: { id: gameId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.genre !== undefined && { genre: data.genre }),
        ...(data.rules !== undefined && { rules: data.rules }),
        ...(data.images && { images: data.images }),
      },
    })

    return { success: 'Game updated successfully', game: updated }
  } catch (error) {
    console.error('Error updating game:', error)
    return { error: (error as Error).message }
  }
}

/**
 * Delete a game
 */
export const deleteGame = async (gameId: string): Promise<GameResponse> => {
  const user = await currentUser()

  if (!user) {
    return { error: 'User not found' }
  }

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    })

    if (!game) {
      return { error: 'Game not found' }
    }

    if (game.createdBy !== user.id && user.role !== 'admin') {
      return { error: 'You do not have permission to delete this game' }
    }

    await prisma.game.delete({
      where: { id: gameId },
    })

    return { success: 'Game deleted successfully' }
  } catch (error) {
    console.error('Error deleting game:', error)
    return { error: (error as Error).message }
  }
}
