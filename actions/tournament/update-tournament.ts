'use server'

import { currentUser } from '@/lib/auth'
import {
  getTournamentById,
  updateTournament as updateTournamentService,
} from '@/data/Tournaments/tournaments'
import type { Prisma } from '@prisma/client'

export interface UpdateTournamentRequest {
  tournamentId: string
  name?: string
  description?: string
  status?: 'pending' | 'progress' | 'completed' | 'archived'
  progress?: number
  additionalData?: Record<string, any>
}

export interface UpdateTournamentResponse {
  success?: string
  error?: string
}

/**
 * Update tournament details
 */
export const updateTournament = async (
  data: UpdateTournamentRequest
): Promise<UpdateTournamentResponse> => {
  const user = await currentUser()

  if (!user) {
    return { error: 'User not found' }
  }

  try {
    // Verify tournament exists and user has permission
    const tournament = await getTournamentById(data.tournamentId)
    if (!tournament) {
      return { error: 'Tournament not found' }
    }

    if (tournament.createdBy !== user.id && user.role !== 'admin') {
      return { error: 'You do not have permission to update this tournament' }
    }

    // Build update data
    const updateData: Prisma.TournamentUpdateInput = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined)
      updateData.description = data.description
    if (data.status !== undefined) updateData.status = data.status
    if (data.progress !== undefined) updateData.progress = data.progress

    // Update additional JSON fields
    if (data.additionalData) {
      const additionalKeys = Object.keys(data.additionalData)
      additionalKeys.forEach((key) => {
        // Map to JSON fields in the schema
        if (key === 'game') {
          updateData.game = data.additionalData![key]
        } else if (key === 'participantGameMatrix') {
          updateData.participantGameMatrix = data.additionalData![key]
        }
      })
    }

    // Perform update
    const updated = await updateTournamentService(data.tournamentId, updateData)

    return { success: 'Tournament updated successfully' }
  } catch (error) {
    console.error('Error updating tournament:', error)
    return { error: (error as Error).message }
  }
}

export default updateTournament
