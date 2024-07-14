import * as z from 'zod'

export const RegisterSchema = z.object({
  fName: z.string().min(1, {
    message: 'First name is required',
  }),
  lName: z.string().min(1, {
    message: 'Last name is required',
  }),
  email: z.string().email({
    message: 'Invalid email format',
  }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: 'Invalid phone number format',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  vPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  isTwoFactorEnabled: z.optional(z.boolean()),
  // date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: 'Date must be in the format YYYY-MM-DD',
  // }),
})

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string()),
})

export const LoginTokenSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  existingToken: z.optional(z.string()),
})

export const AdditionInfoSchema = z.object({
  userName: z.string().min(6, {
    message: 'User Name is required',
  }),
})
