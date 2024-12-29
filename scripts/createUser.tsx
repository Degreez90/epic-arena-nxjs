import { register } from '@/actions/auth/register'
import { RegisterSchema } from '@/schemas/index'
import * as z from 'zod'

import dotenv from 'dotenv'

dotenv.config()

async function createUser() {
  const data: z.infer<typeof RegisterSchema> = {
    email: 'offitt90@gmail.com',
    password: 'password123',
    vPassword: 'password123', // Assuming this is for password verification
    fName: 'Test',
    lName: 'User',
    admin: false, // Assuming this is a boolean indicating admin status
    phoneNumber: '1234567890',
    isTwoFactorEnabled: false, // Assuming this is a boolean for two-factor authentication
  }

  try {
    const user = await register(data)
    console.log('User created successfully:', user)
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    process.exit(0)
  }
}

createUser()

// Use this command to run the script: npx tsx scripts/createUser.tsx
