import { Suspense } from 'react'
import { RegisterForm } from '@/components/auth/Register-Form'

const RegisterPage = () => {
  return (
    <Suspense fallback={<div>...loading</div>}>
      <RegisterForm />
    </Suspense>
  )
}

export default RegisterPage
