import mongoose from 'mongoose'
import readline from 'readline'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const { MONGODB_URI } = process.env

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Define a default set of collections
const defaultCollections = ['users', 'posts', 'comments']

async function reset(collectionNames: string[] = defaultCollections) {
  for (const collectionName of collectionNames) {
    const result = await mongoose.connection
      .collection(collectionName)
      .deleteMany({})
    console.log(
      `${result.deletedCount} records deleted from the ${collectionName} collection.`
    )
  }
}

mongoose
  .connect(MONGODB_URI as string)
  .then(() => {
    rl.question(
      'Which collections do you want to reset? (comma-separated, or press ENTER for default): ',
      async (input) => {
        const collectionNames = input
          ? input.split(',').map((name) => name.trim())
          : defaultCollections
        try {
          await reset(collectionNames)
        } catch (e) {
          console.error('Error during deletion:', e)
        } finally {
          await mongoose.disconnect()
          rl.close()
        }
      }
    )
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err)
    rl.close()
  })

// Use this command to run the script: npx tsx scripts/reset.tsx
