import { NewVerificationForm } from '@/components/Auth/new-verification-form'
import { Suspense } from 'react'
const NewVerificationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewVerificationForm />
    </Suspense>
  )
}

export default NewVerificationPage
