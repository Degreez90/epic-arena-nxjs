// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// async function reset() {
//   const result = await prisma.user.deleteMany({})
//   console.log(`${result.count} users deleted.`)
// }

// reset()
//   .catch((e) => {
//     console.error('Error during user deletion:', e)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })

//use node --loader ts-node/esm scripts/reset.ts

import { PrismaClient } from '@prisma/client'
import readline from 'readline'

const prisma = new PrismaClient()
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function reset(collectionName: string) {
  const result = await (prisma as any)[collectionName].deleteMany({})
  console.log(
    `${result.count} records deleted from the ${collectionName} collection.`
  )
}

rl.question('Which collection do you want to reset? ', (collectionName) => {
  reset(collectionName)
    .catch((e) => {
      console.error(
        `Error during deletion from the ${collectionName} collection:`,
        e
      )
    })
    .finally(async () => {
      await prisma.$disconnect()
      rl.close()
    })
})

// Use this command to run the script: node --loader ts-node/esm scripts/reset.ts
