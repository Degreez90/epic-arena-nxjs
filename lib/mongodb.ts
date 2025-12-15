// lib/mongodb.ts
// Note: This file is now deprecated. Use lib/prisma.ts instead for database access.
// Migration to Prisma is complete. All database operations should use the Prisma client.

import prisma from './prisma'

// This export is kept for backward compatibility during migration
export const connectDB = async () => {
  try {
    // Test the connection by running a simple query
    await prisma.$queryRaw`SELECT 1`
    console.log('Database connected successfully via Prisma')
    return true
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

export { prisma }
