/**
 * Comprehensive Seed Script - Insert All
 * This script seeds ALL dummy data at once: users, games, tournaments, and relationships
 *
 * Run with: npx ts-node scripts/seed-all-dummy-data.ts
 *
 * Creates complete test environment:
 * - 30 dummy users with different roles
 * - 4 dummy games
 * - 8 dummy tournaments with various types and statuses
 * - Tournament participants (users registered for tournaments)
 */

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const DUMMY_DATA = {
  users: [
    // Admin users (2)
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
      userName: 'adminuser',
      email: 'adminuser@example.com',
      password: 'TestPassword123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      emailVerified: new Date(),
    },
    // Regular users (28)
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
    {
      userName: 'gamer_phoenix',
      email: 'phoenix@example.com',
      password: 'TestPassword123!',
      firstName: 'Phoenix',
      lastName: 'Gamer',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'shadow_knight',
      email: 'shadow@example.com',
      password: 'TestPassword123!',
      firstName: 'Shadow',
      lastName: 'Knight',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'striker_pro',
      email: 'striker@example.com',
      password: 'TestPassword123!',
      firstName: 'Striker',
      lastName: 'Pro',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'dragon_master',
      email: 'dragon@example.com',
      password: 'TestPassword123!',
      firstName: 'Dragon',
      lastName: 'Master',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'wolf_hunter',
      email: 'wolf@example.com',
      password: 'TestPassword123!',
      firstName: 'Wolf',
      lastName: 'Hunter',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'titan_force',
      email: 'titan@example.com',
      password: 'TestPassword123!',
      firstName: 'Titan',
      lastName: 'Force',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'storm_breaker',
      email: 'storm@example.com',
      password: 'TestPassword123!',
      firstName: 'Storm',
      lastName: 'Breaker',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'echo_warrior',
      email: 'echo@example.com',
      password: 'TestPassword123!',
      firstName: 'Echo',
      lastName: 'Warrior',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'nova_star',
      email: 'nova@example.com',
      password: 'TestPassword123!',
      firstName: 'Nova',
      lastName: 'Star',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'nexus_pro',
      email: 'nexus@example.com',
      password: 'TestPassword123!',
      firstName: 'Nexus',
      lastName: 'Pro',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'cyber_ninja',
      email: 'cyber@example.com',
      password: 'TestPassword123!',
      firstName: 'Cyber',
      lastName: 'Ninja',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'apex_legend',
      email: 'apex@example.com',
      password: 'TestPassword123!',
      firstName: 'Apex',
      lastName: 'Legend',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'blaze_fire',
      email: 'blaze@example.com',
      password: 'TestPassword123!',
      firstName: 'Blaze',
      lastName: 'Fire',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'frost_ice',
      email: 'frost@example.com',
      password: 'TestPassword123!',
      firstName: 'Frost',
      lastName: 'Ice',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'volt_electric',
      email: 'volt@example.com',
      password: 'TestPassword123!',
      firstName: 'Volt',
      lastName: 'Electric',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'ocean_wave',
      email: 'ocean@example.com',
      password: 'TestPassword123!',
      firstName: 'Ocean',
      lastName: 'Wave',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'earth_soil',
      email: 'earth@example.com',
      password: 'TestPassword123!',
      firstName: 'Earth',
      lastName: 'Soil',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'lunar_moon',
      email: 'lunar@example.com',
      password: 'TestPassword123!',
      firstName: 'Lunar',
      lastName: 'Moon',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'solar_sun',
      email: 'solar@example.com',
      password: 'TestPassword123!',
      firstName: 'Solar',
      lastName: 'Sun',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'cosmic_space',
      email: 'cosmic@example.com',
      password: 'TestPassword123!',
      firstName: 'Cosmic',
      lastName: 'Space',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'prism_light',
      email: 'prism@example.com',
      password: 'TestPassword123!',
      firstName: 'Prism',
      lastName: 'Light',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'vortex_spin',
      email: 'vortex@example.com',
      password: 'TestPassword123!',
      firstName: 'Vortex',
      lastName: 'Spin',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'pulse_beat',
      email: 'pulse@example.com',
      password: 'TestPassword123!',
      firstName: 'Pulse',
      lastName: 'Beat',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'genesis_origin',
      email: 'genesis@example.com',
      password: 'TestPassword123!',
      firstName: 'Genesis',
      lastName: 'Origin',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'cipher_code',
      email: 'cipher@example.com',
      password: 'TestPassword123!',
      firstName: 'Cipher',
      lastName: 'Code',
      role: 'user',
      emailVerified: new Date(),
    },
    {
      userName: 'nexus_link',
      email: 'link@example.com',
      password: 'TestPassword123!',
      firstName: 'Nexus',
      lastName: 'Link',
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
    // Fighting game tournaments
    {
      name: 'Street Fighter Championship 2024',
      description: 'Premier SF6 fighting tournament',
      type: 'single_elimination',
      status: 'pending',
      seedingOrder: 'natural',
      hasThirdPlaceMatch: true,
      gameIndex: 0,
      participantIndices: [2, 3, 4, 5, 6, 7, 8],
    },
    {
      name: 'Tekken Pro League',
      description: 'Professional Tekken 8 league',
      type: 'double_elimination',
      status: 'progress',
      seedingOrder: 'reverse',
      hasThirdPlaceMatch: true,
      gameIndex: 1,
      participantIndices: [3, 4, 5, 9, 10, 11],
    },
    {
      name: 'Summer Fighting Festival',
      description: 'Multi-game fighting tournament',
      type: 'round_robin',
      status: 'completed',
      seedingOrder: 'half_shift',
      hasThirdPlaceMatch: false,
      gameIndex: 0,
      participantIndices: [2, 6, 7, 12, 13],
    },
    // MOBA tournaments
    {
      name: 'League of Legends Worlds',
      description: 'Premier League of Legends tournament',
      type: 'single_elimination',
      status: 'pending',
      seedingOrder: 'natural',
      hasThirdPlaceMatch: true,
      gameIndex: 2,
      participantIndices: [2, 8, 9, 10, 14, 15, 16, 17],
    },
    {
      name: 'Dota 2 International',
      description: 'The International Dota 2 championship',
      type: 'double_elimination',
      status: 'progress',
      seedingOrder: 'reverse',
      hasThirdPlaceMatch: true,
      gameIndex: 3,
      participantIndices: [3, 5, 11, 18, 19, 20],
    },
    {
      name: 'MOBA Masters Series',
      description: 'Combined MOBA tournament series',
      type: 'round_robin',
      status: 'pending',
      seedingOrder: 'natural',
      hasThirdPlaceMatch: false,
      gameIndex: 2,
      participantIndices: [4, 12, 13, 14, 21, 22],
    },
    {
      name: 'Regional Qualifier - South',
      description: 'Regional qualifying tournament',
      type: 'single_elimination',
      status: 'completed',
      seedingOrder: 'half_shift',
      hasThirdPlaceMatch: true,
      gameIndex: 3,
      participantIndices: [6, 15, 16, 23, 24],
    },
    {
      name: 'Grand Finals 2024',
      description: 'Year-end grand championship',
      type: 'double_elimination',
      status: 'completed',
      seedingOrder: 'reverse',
      hasThirdPlaceMatch: true,
      gameIndex: 2,
      participantIndices: [7, 8, 9, 17, 18, 19, 20, 25, 26, 27, 28, 29],
    },
  ],
}

async function seedAllDummyData() {
  try {
    console.log('🌱 Starting comprehensive dummy data seeding...\n')

    // Step 1: Create users
    console.log('👤 Step 1: Creating dummy users...')
    const createdUsers = []
    for (const userData of DUMMY_DATA.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      let user = await prisma.user.findUnique({
        where: { email: userData.email },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
          },
        })
        console.log(`  ✓ Created user: ${user.userName}`)
      } else {
        console.log(`  ℹ️  User already exists: ${user.userName}`)
      }
      createdUsers.push(user)
    }

    // Step 2: Create games
    console.log('\n🎮 Step 2: Creating dummy games...')
    const createdGames = []
    const adminUser = createdUsers[0]
    for (const gameData of DUMMY_DATA.games) {
      let game = await prisma.game.findFirst({
        where: { name: gameData.name },
      })

      if (game) {
        console.log(`  ℹ️  Game already exists: ${game.name}`)
      } else {
        game = await prisma.game.create({
          data: {
            ...gameData,
            createdBy: adminUser.id,
          },
        })
        console.log(`  ✓ Created game: ${game.name}`)
      }
      createdGames.push(game)
    }

    // Step 3: Create tournaments
    console.log('\n🏆 Step 3: Creating dummy tournaments...')
    const createdTournaments = []
    for (let i = 0; i < DUMMY_DATA.tournaments.length; i++) {
      const tournamentData = DUMMY_DATA.tournaments[i]
      const selectedGame = createdGames[tournamentData.gameIndex]

      let tournament = await prisma.tournament.findFirst({
        where: { name: tournamentData.name },
      })

      if (tournament) {
        console.log(`  ℹ️  Tournament already exists: ${tournament.name}`)
      } else {
        tournament = await prisma.tournament.create({
          data: {
            name: tournamentData.name,
            description: tournamentData.description,
            type: tournamentData.type,
            status: tournamentData.status as any,
            seedingOrder: tournamentData.seedingOrder,
            hasThirdPlaceMatch: tournamentData.hasThirdPlaceMatch,
            createdBy: adminUser.id,
            gameId: selectedGame.id,
            progress: Math.floor(Math.random() * 100),
          },
        })
        console.log(
          `  ✓ Created tournament: ${tournament.name} (${tournament.status})`
        )
      }
      createdTournaments.push(tournament)
    }

    // Step 4: Add tournament participants
    console.log('\n👥 Step 4: Adding tournament participants...')
    for (let i = 0; i < DUMMY_DATA.tournaments.length; i++) {
      const tournamentData = DUMMY_DATA.tournaments[i]
      const tournament = createdTournaments[i]
      const selectedGame = createdGames[tournamentData.gameIndex]

      for (const userIndex of tournamentData.participantIndices) {
        const participant = createdUsers[userIndex]

        // Skip if participant doesn't exist (shouldn't happen but be safe)
        if (!participant) {
          console.warn(
            `  ⚠️  Participant at index ${userIndex} not found, skipping`
          )
          continue
        }

        // Check if participant already exists
        const existing = await prisma.tournamentParticipant.findFirst({
          where: {
            tournamentId: tournament.id,
            userId: participant.id,
            gameId: selectedGame.id,
          },
        })

        if (!existing) {
          await prisma.tournamentParticipant.create({
            data: {
              tournamentId: tournament.id,
              userId: participant.id,
              gameId: selectedGame.id,
            },
          })
          console.log(`  ✓ Added ${participant.userName} to ${tournament.name}`)
        }
      }
    }

    console.log('\n✅ Comprehensive seeding completed successfully!')
    console.log(`\n📊 Created/Verified:`)
    console.log(`  • ${createdUsers.length} users`)
    console.log(`  • ${createdGames.length} games`)
    console.log(`  • ${createdTournaments.length} tournaments`)
    console.log(`\n💡 Test Credentials:`)
    console.log(`  Admin: testadmin@example.com / TestPassword123!`)
    console.log(`  User 1: testuser1@example.com / TestPassword123!`)
    console.log(`  User 2: testuser2@example.com / TestPassword123!`)
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedAllDummyData()
