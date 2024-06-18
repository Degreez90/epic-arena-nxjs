import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function reset() {
  const result = await prisma.user.deleteMany({})
  console.log(`${result.count} users deleted.`)
}

reset()
  .catch((e) => {
    console.error('Error during user deletion:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

//use node --loader ts-node/esm scripts/reset.ts
