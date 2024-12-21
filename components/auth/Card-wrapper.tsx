'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Header } from '@/components/auth/Header'
import { Social } from '@/components/auth/Social'
import { BackButton } from '@/components/auth/buttons/Back-Button'

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
  title?: string
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  title,
}: CardWrapperProps) => {
  return (
    <Card className='w-[400px] h-fit shadow-md'>
      <CardHeader>
        <Header title={title} label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  )
}
