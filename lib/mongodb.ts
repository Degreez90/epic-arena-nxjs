import mongoose from 'mongoose'

const openMongooseConnection = async (MONGO_URI = null): Promise<void> => {
  const URI = process.env.MONGO_URI
  if (MONGO_URI) {
    await mongoose.connect(MONGO_URI)
  } else if (URI) {
    await mongoose.connect(URI)
  } else {
    throw new Error('No MONGO_URI found in process.env')
  }
  console.log('Mongoose connection opened successfully')
}

const closeMongooseConnection = async (): Promise<void> => {
  await mongoose.connection.close()
  console.log('Mongoose connection closed successfully')
}

export { openMongooseConnection, closeMongooseConnection, mongoose }
