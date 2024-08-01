import { Suspense } from 'react'
import { RegisterForm } from '@/components/Auth/Register-Form'

const RegisterPage = () => {
  return (
    <Suspense fallback={<div>...loading</div>}>
      <RegisterForm />
    </Suspense>
  )
}

export default RegisterPage
