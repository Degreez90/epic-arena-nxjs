import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'

export const getAccountByUserId = async (userId: string) => {
  try {
    await connectDB()
    const account = await mongoose.model('Account').findOne({ userId }).exec()

    console.log('data/db: account: ', account)

    return account
  } catch {
    return null
  }
}
