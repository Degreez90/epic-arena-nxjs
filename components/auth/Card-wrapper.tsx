'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Header } from '@/components/Auth/Header'
import { Social } from '@/components/Auth/Social'
import { BackButton } from '@/components/Auth/buttons/Back-Button'

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: React.ReactNode // <-- changed from string to React.ReactNode
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
    <Card className='w-[400px] h-fit shadow-md rounded-2xl bg-white'>
      <CardHeader>
        <div className='text-center'>{headerLabel}</div>
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
