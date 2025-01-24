// lib/mongodb.ts
import mongoose from 'mongoose'

const { MONGODB_URI } = process.env

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

// Global cache for the Mongoose connection and models
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export const connectDB = async () => {
  if (cached.conn) {
    // Use existing database connection
    return cached.conn
  }

  if (!cached.promise) {
    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose
    })
  }

  try {
    // Await the connection promise
    cached.conn = await cached.promise
    console.log('MongoDB connected successfully')
    return cached.conn
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}
