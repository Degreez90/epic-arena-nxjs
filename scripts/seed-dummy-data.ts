/**
 * Seed Dummy Data Script
 * This script adds dummy users, games, and tournaments to the database for testing purposes.
 *
 * Run with: npx ts-node scripts/seed-dummy-data.ts
 *
 * Creates:
 * - 3 dummy users (admin and regular users)
 * - 4 dummy games (various genres)
 * - 3 dummy tournaments with different statuses and types
 */

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const DUMMY_DATA = {
  users: [
    {
      userName: 'testadmin',
      email: 'testadmin@example.com',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'Admin',
      role: 'admin',
      emailVerified: new Date(),
    },
    {
      userName: 'testuser1',
      email: 'testuser1@example.com',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User1',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'testuser2',
      email: 'testuser2@example.com',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User2',
      role: 'user',
      emailVerified: new Date(),
    },
  ],
  games: [
    {
      name: 'Street Fighter 6',
      description: 'Classic fighting game with modern mechanics',
      genre: 'Fighting',
    },
    {
      name: 'Tekken 8',
      description: '3D fighting game with deep combat system',
      genre: 'Fighting',
    },
    {
      name: 'League of Legends',
      description: 'Popular MOBA esports title',
      genre: 'MOBA',
    },
    {
      name: 'Dota 2',
      description: 'Complex strategy-based MOBA game',
      genre: 'MOBA',
    },
  ],
  tournaments: [
    {
      name: 'Spring Fighting Championship',
      description: 'A competitive tournament for fighting game enthusiasts',
      type: 'single_elimination',
      status: 'pending',
      seedingOrder: 'natural',
      hasThirdPlaceMatch: true,
    },
    {
      name: 'MOBA League Season 1',
      description: 'League-based MOBA tournament',
      type: 'round_robin',
      status: 'progress',
      seedingOrder: 'reverse',
      hasThirdPlaceMatch: false,
    },
    {
      name: 'Grand Finals 2024',
      description: 'Final tournament of the year',
      type: 'double_elimination',
      status: 'completed',
      seedingOrder: 'half_shift',
      hasThirdPlaceMatch: true,
    },
  ],
}

async function seedDummyData() {
  try {
    console.log('🌱 Starting dummy data seeding...')

    // Create users
    console.log('📝 Creating dummy users...')
    const createdUsers = []
    for (const userData of DUMMY_DATA.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userData,
          password: hashedPassword,
        },
      })
      createdUsers.push(user)
      console.log(`  ✓ Created user: ${user.userName} (${user.email})`)
    }

    // Create games
    console.log('🎮 Creating dummy games...')
    const createdGames = []
    const adminUser = createdUsers[0]
    for (const gameData of DUMMY_DATA.games) {
      // Check if game already exists
      let game = await prisma.game.findFirst({
        where: { name: gameData.name },
      })

      if (game) {
        // Update existing game
        game = await prisma.game.update({
          where: { id: game.id },
          data: {
            ...gameData,
            createdBy: adminUser.id,
          },
        })
      } else {
        // Create new game
        game = await prisma.game.create({
          data: {
            ...gameData,
            createdBy: adminUser.id,
          },
        })
      }
      createdGames.push(game)
      console.log(`  ✓ Created game: ${game.name}`)
    }

    // Create tournaments
    console.log('🏆 Creating dummy tournaments...')
    for (let i = 0; i < DUMMY_DATA.tournaments.length; i++) {
      const tournamentData = DUMMY_DATA.tournaments[i]
      const selectedGame = createdGames[i % createdGames.length]
      const tournament = await prisma.tournament.upsert({
        where: { id: `dummy-tournament-${i}` },
        update: {},
        create: {
          name: tournamentData.name,
          description: tournamentData.description,
          type: tournamentData.type,
          status: tournamentData.status as any,
          seedingOrder: tournamentData.seedingOrder,
          hasThirdPlaceMatch: tournamentData.hasThirdPlaceMatch,
          createdBy: adminUser.id,
          gameId: selectedGame.id,
          bracketData: {},
          progress: Math.floor(Math.random() * 100),
        },
      })
      console.log(
        `  ✓ Created tournament: ${tournament.name} (${tournament.status})`
      )
    }

    console.log('\n✅ Dummy data seeded successfully!')
    console.log(`\n📊 Created:`)
    console.log(`  • ${createdUsers.length} users`)
    console.log(`  • ${createdGames.length} games`)
    console.log(`  • ${DUMMY_DATA.tournaments.length} tournaments`)
    console.log('\n💡 Test credentials:')
    console.log(`  Admin: testadmin@example.com / TestPassword123!`)
    console.log(`  User: testuser1@example.com / TestPassword123!`)
  } catch (error) {
    console.error('❌ Error seeding dummy data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedDummyData()
