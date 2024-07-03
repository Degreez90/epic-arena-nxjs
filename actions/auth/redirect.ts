'use server'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { redirect } from 'next/navigation'

export async function navigate(data: FormData) {
  redirect(DEFAULT_LOGIN_REDIRECT)
}
