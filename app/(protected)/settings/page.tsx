import { LogoutButton } from '@/components/auth/buttons/logout-button'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/auth'

const SettingsPage = async () => {
  const user = await currentUser()

  return (
    <div>
      <div>{`Hello, ${user?.fName}`}</div>
      <div>
        <LogoutButton>
          <Button variant={'secondary'}>Logout</Button>
        </LogoutButton>
      </div>
    </div>
  )
}

export default SettingsPage
