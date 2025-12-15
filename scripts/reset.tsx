import { PrismaClient } from '@prisma/client'
import readline from 'readline'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Define a default set of tables to clear
const defaultTables = ['User', 'Game', 'Tournament']

async function reset(tableNames: string[] = defaultTables) {
  for (const tableName of tableNames) {
    try {
      const result = await (
        prisma[tableName.toLowerCase() as any] as any
      ).deleteMany({})
      console.log(
        `${result.count || 0} records deleted from the ${tableName} table.`
      )
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error)
    }
  }
}

async function main() {
  try {
    rl.question(
      'Which tables do you want to reset? (comma-separated, or press ENTER for default): ',
      async (input) => {
        const tableNames = input
          ? input.split(',').map((name) => name.trim())
          : defaultTables
        try {
          await reset(tableNames)
          console.log('Reset completed successfully!')
        } catch (e) {
          console.error('Error during deletion:', e)
        } finally {
          await prisma.$disconnect()
          rl.close()
        }
      }
    )
  } catch (err) {
    console.error('Error:', err)
    await prisma.$disconnect()
    rl.close()
  }
}

main()

// Use this command to run the script: npx tsx scripts/reset.tsx
