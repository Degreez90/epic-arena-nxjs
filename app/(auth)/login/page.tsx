import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/Login-Form'

const signup = () => {
  return (
    <Suspense fallback={<div>..loading</div>}>
      <LoginForm />
    </Suspense>
  )
}

export default signup
