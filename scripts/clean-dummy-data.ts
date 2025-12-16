/**
 * Clean Dummy Data Script
 * This script removes all dummy test data from the database.
 *
 * Run with: npx ts-node scripts/clean-dummy-data.ts
 *
 * Removes:
 * - All dummy users (testadmin, testuser1, testuser2)
 * - All dummy games created by dummy users
 * - All dummy tournaments created by dummy users
 */

import prisma from '@/lib/prisma'

const DUMMY_EMAILS = [
  'testadmin@example.com',
  'testuser1@example.com',
  'testuser2@example.com',
]

async function cleanDummyData() {
  try {
    console.log('🧹 Starting cleanup of dummy data...')

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
      console.log('ℹ️  No dummy users found to delete.')
      return
    }

    const dummyUserIds = dummyUsers.map((u) => u.id)
    console.log(`  Found ${dummyUsers.length} dummy users`)

    // Delete tournaments created by dummy users
    console.log('🏆 Deleting dummy tournaments...')
    const tournamentsDeleted = await prisma.tournament.deleteMany({
      where: {
        createdBy: {
          in: dummyUserIds,
        },
      },
    })
    console.log(`  ✓ Deleted ${tournamentsDeleted.count} tournaments`)

    // Delete games created by dummy users
    console.log('🎮 Deleting dummy games...')
    const gamesDeleted = await prisma.game.deleteMany({
      where: {
        createdBy: {
          in: dummyUserIds,
        },
      },
    })
    console.log(`  ✓ Deleted ${gamesDeleted.count} games`)

    // Delete dummy users
    console.log('👤 Deleting dummy users...')
    const usersDeleted = await prisma.user.deleteMany({
      where: {
        email: {
          in: DUMMY_EMAILS,
        },
      },
    })
    console.log(`  ✓ Deleted ${usersDeleted.count} users`)

    console.log('\n✅ Cleanup completed successfully!')
    console.log(`\n📊 Deleted:`)
    console.log(`  • ${usersDeleted.count} users`)
    console.log(`  • ${gamesDeleted.count} games`)
    console.log(`  • ${tournamentsDeleted.count} tournaments`)
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

cleanDummyData()
