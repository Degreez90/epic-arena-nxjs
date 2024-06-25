// import { PrismaClient } from '@prisma/client'
// import readline from 'readline'

// const prisma = new PrismaClient()
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// })

// async function reset(collectionName: string) {
//   const result = await (prisma as any)[collectionName].deleteMany({})
//   console.log(
//     `${result.count} records deleted from the ${collectionName} collection.`
//   )
// }

// rl.question('Which collection do you want to reset? ', (collectionName) => {
//   reset(collectionName)
//     .catch((e) => {
//       console.error(
//         `Error during deletion from the ${collectionName} collection:`,
//         e
//       )
//     })
//     .finally(async () => {
//       await prisma.$disconnect()
//       rl.close()
//     })
// })

import { PrismaClient } from '@prisma/client'
import readline from 'readline'

const prisma = new PrismaClient()
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Define a default set of collections
const defaultCollections = ['users', 'posts', 'comments']

async function reset(collectionNames: string[] = defaultCollections) {
  for (const collectionName of collectionNames) {
    const result = await (prisma as any)[collectionName].deleteMany({})
    console.log(
      `${result.count} records deleted from the ${collectionName} collection.`
    )
  }
}

rl.question(
  'Which collections do you want to reset? (comma-separated, or press ENTER for default): ',
  (input) => {
    const collectionNames = input
      ? input.split(',').map((name) => name.trim())
      : defaultCollections
    Promise.all(collectionNames.map((name) => reset([name])))
      .catch((e) => {
        console.error('Error during deletion:', e)
      })
      .finally(async () => {
        await prisma.$disconnect()
        rl.close()
      })
  }
)

// Use this command to run the script: npx tsx scripts/reset.tsx
