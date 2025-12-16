/**
 * Initialize Brackets for Existing Tournaments
 * This script initializes bracket data for tournaments that don't have it yet
 *
 * Run with: npx ts-node scripts/init-tournament-brackets.ts
 */

import prisma from '@/lib/prisma'
import { getTournamentManager } from '@/data/Tournaments/tournaments'
import {
  InputStage,
  StageType,
  SeedOrdering,
  Participant,
} from 'brackets-model'
import { Prisma } from '@prisma/client'

async function initTournamentBrackets() {
  try {
    console.log('🏆 Starting tournament bracket initialization...\n')

    // Get all tournaments that don't have bracket data
    const tournaments = await prisma.tournament.findMany({
      where: {
        OR: [
          { stage: { equals: Prisma.JsonNull } },
          { group: { equals: Prisma.JsonNull } },
          { round: { equals: Prisma.JsonNull } },
          { match: { equals: Prisma.JsonNull } },
        ],
      },
      include: {
        participants: true,
      },
    })

    console.log(
      `Found ${tournaments.length} tournaments without bracket data\n`
    )

    for (const tournament of tournaments) {
      console.log(`🎮 Processing: ${tournament.name}`)

      try {
        // Get tournament participants/users
        const participants = await prisma.tournamentParticipant.findMany({
          where: { tournamentId: tournament.id },
          include: { user: true },
        })

        if (participants.length === 0) {
          console.log(`  ⚠️  No participants found, skipping\n`)
          continue
        }

        console.log(`  📋 Found ${participants.length} participants`)

        // Initialize bracket manager
        const manager = await getTournamentManager(tournament.id)

        // Map participants for bracket
        const seedParticipants: Omit<Participant, 'id'>[] = participants.map(
          (p, i) => ({
            name: p.user?.userName || `Participant ${i + 1}`,
            tournament_id: Number(tournament.id.charCodeAt(0)), // Use first char code as number
          })
        )

        // Create the stage
        const stageType = (tournament.type || 'single_elimination') as StageType
        const inputStage: InputStage = {
          tournamentId: 1, // brackets-manager uses numeric IDs
          name: tournament.name,
          type: stageType,
          seeding: seedParticipants,
          settings: {
            seedOrdering: [
              (tournament.seedingOrder || 'natural') as SeedOrdering,
            ],
          },
        }

        // Add type-specific settings
        if (stageType === 'double_elimination') {
          inputStage.settings = inputStage.settings || {}
          ;(inputStage.settings as any).grandFinal = 'double'
        } else if (stageType === 'single_elimination') {
          if (participants.length > 2) {
            inputStage.settings = inputStage.settings || {}
            ;(inputStage.settings as any).consolationFinal =
              tournament.hasThirdPlaceMatch ?? true
          }
        }

        console.log(`  🔧 Creating ${stageType} stage...`)
        await manager.create.stage(inputStage)

        console.log(`  ✓ Bracket initialized successfully`)
        console.log(`  📊 Stage type: ${stageType}`)
        console.log(`  👥 Participants: ${seedParticipants.length}\n`)
      } catch (error) {
        console.error(
          `  ❌ Error initializing bracket: ${
            error instanceof Error ? error.message : String(error)
          }\n`
        )
      }
    }

    console.log('✅ Tournament bracket initialization completed!')
  } catch (error) {
    console.error('❌ Error during initialization:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

initTournamentBrackets()
