/**
 * Comprehensive Clean Script - Remove All
 * This script removes ALL dummy data at once: tournaments, games, participants, and users
 *
 * Run with: npx ts-node scripts/clean-all-dummy-data.ts
 *
 * Removes in order:
 * - All tournament participants
 * - All tournaments created by dummy users
 * - All games created by dummy users
 * - All dummy users
 */

import prisma from '@/lib/prisma'

const DUMMY_EMAILS = [
  'testadmin@example.com',
  'adminuser@example.com',
  'testuser1@example.com',
  'testuser2@example.com',
  'phoenix@example.com',
  'shadow@example.com',
  'striker@example.com',
  'dragon@example.com',
  'wolf@example.com',
  'titan@example.com',
  'storm@example.com',
  'echo@example.com',
  'nova@example.com',
  'nexus@example.com',
  'cyber@example.com',
  'apex@example.com',
  'blaze@example.com',
  'frost@example.com',
  'volt@example.com',
  'ocean@example.com',
  'earth@example.com',
  'lunar@example.com',
  'solar@example.com',
  'cosmic@example.com',
  'prism@example.com',
  'vortex@example.com',
  'pulse@example.com',
  'genesis@example.com',
  'cipher@example.com',
  'link@example.com',
]

async function cleanAllDummyData() {
  try {
    console.log('🧹 Starting comprehensive cleanup of all dummy data...\n')

    // Find dummy users
    console.log('🔍 Finding dummy users...')
    const dummyUsers = await prisma.user.findMany({
      where: {
        email: {
          in: DUMMY_EMAILS,
        },
      },
    })

    if (dummyUsers.length === 0) {
      console.log('ℹ️  No dummy users found. Nothing to clean up.')
      return
    }

    const dummyUserIds = dummyUsers.map((u) => u.id)
    console.log(`  Found ${dummyUsers.length} dummy users\n`)

    // Step 1: Delete tournament participants
    console.log('👥 Step 1: Removing tournament participants...')
    const tournamentsToDelete = await prisma.tournament.findMany({
      where: {
        createdBy: {
          in: dummyUserIds,
        },
      },
      select: { id: true },
    })

    const participantsDeleted = await prisma.tournamentParticipant.deleteMany({
      where: {
        tournamentId: {
          in: tournamentsToDelete.map((t) => t.id),
        },
      },
    })
    console.log(
      `  ✓ Deleted ${participantsDeleted.count} participant records\n`
    )

    // Step 2: Delete tournaments
    console.log('🏆 Step 2: Removing tournaments...')
    const tournamentsDeleted = await prisma.tournament.deleteMany({
      where: {
        createdBy: {
          in: dummyUserIds,
        },
      },
    })
    console.log(`  ✓ Deleted ${tournamentsDeleted.count} tournaments\n`)

    // Step 3: Delete games
    console.log('🎮 Step 3: Removing games...')
    const gamesDeleted = await prisma.game.deleteMany({
      where: {
        createdBy: {
          in: dummyUserIds,
        },
      },
    })
    console.log(`  ✓ Deleted ${gamesDeleted.count} games\n`)

    // Step 4: Delete users
    console.log('👤 Step 4: Removing users...')
    const usersDeleted = await prisma.user.deleteMany({
      where: {
        email: {
          in: DUMMY_EMAILS,
        },
      },
    })
    console.log(`  ✓ Deleted ${usersDeleted.count} users\n`)

    console.log('✅ Comprehensive cleanup completed successfully!')
    console.log(`\n📊 Deleted:`)
    console.log(`  • ${usersDeleted.count} users`)
    console.log(`  • ${gamesDeleted.count} games`)
    console.log(`  • ${tournamentsDeleted.count} tournaments`)
    console.log(`  • ${participantsDeleted.count} participant records`)
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

cleanAllDummyData()
