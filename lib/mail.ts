import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL

// export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
//   await resend.emails.send({
//     from: 'onboarding@resend.dev',
//     to: email,
//     subject: '2FA code',
//     html: `<p>Your 2FA code is <b>${token} </b></p>`,
//   })
// }

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  })
}

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const confirmLink = `${domain}/auth/new-verification?token=${token}`

//   await resend.emails.send({
//     from: 'onboarding@resend.dev',
//     to: email,
//     subject: 'Confirm your email',
//     html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
//   })
// }

//mailgun

import Mailgun from 'mailgun.js'
import FormData from 'form-data'

export const sendVerificationEmail = async (email: string, token: string) => {
  const mailgun = new Mailgun(FormData)
  const DOMAIN = process.env.MAILGUN_DOMAIN
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY!,
  })

  const confirmLink = `${domain}/new-verification?token=${token}`

  console.log(confirmLink)

  const data = {
    from: 'Mailgun Sandbox <postmaster@sandboxc0b51ebf7e96440898b92e0607d14934.mailgun.org>',
    to: email,
    subject: '2FA code',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  }

  mg.messages
    .create(DOMAIN!, data)
    .then((result) => {
      console.log(result) // Success
    })
    .catch((error) => {
      console.error(error) // Error handling
    })
}
// You can see a record of this email in your logs: https://app.mailgun.com/app/logs.

// You can send up to 300 emails/day from this sandbox server.
// Next, you should add your own domain so you can send 10000 emails/month for free.
