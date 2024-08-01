import { LogoutButton } from '@/components/Auth/buttons/logout-button'
import Container from '@/components/PageComponents/Container'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const SettingsPage = async () => {
  const user = await currentUser()

  return (
    <Container>
      <div className='flex'>
        <div className='mr-4'>
          <Avatar className='size-36'>
            <AvatarImage src={user?.image} alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className='flex-col'>
          <div className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>{`${user?.userName}`}</div>
          <div>
            <LogoutButton>
              <Button variant={'secondary'}>Logout</Button>
            </LogoutButton>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default SettingsPage
