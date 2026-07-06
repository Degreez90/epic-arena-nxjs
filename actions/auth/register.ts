'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { RegisterSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/token'
import { sendVerificationEmail } from '@/lib/mail'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const {
    email,
    password,
    vPassword,
    firstName,
    lastName,
    admin,
    phoneNumber,
    isTwoFactorEnabled,
  } = validatedFields.data

  // Log the values before they are submitted
  console.log('Registering user with values:', {
    email,
    password,
    vPassword,
    firstName,
    lastName,
    admin,
    phoneNumber,
    isTwoFactorEnabled,
  })

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (password !== vPassword) {
    return { error: 'Passwords do not match' }
  }
  if (existingUser) {
    return { error: 'Email already in use!' }
  }

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber,
      isTwoFactorEnabled,
      role: admin ? 'admin' : 'user',
    },
  })

  const verificationToken = await generateVerificationToken(email)

  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: 'Confirmation email sent!' }
}
