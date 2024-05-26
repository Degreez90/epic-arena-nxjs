import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SignIn, SignOut } from '@/components/auth/Auth-Components'

import { FcGoogle } from 'react-icons/fc'

const Register = () => {
  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Register Your Account</CardTitle>
        <CardDescription>Fill out these fields</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex text-3xl'>
          🔏
          <SignIn />
          <Button className='bg-slate-600'>
            <FcGoogle />
          </Button>
        </div>
        <form>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' placeholder='Name of your project' />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='firstname'>First Name</Label>
              <Input id='firstname' placeholder='Name of your project' />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='lastname'>Last Name</Label>
              <Input id='lastname' placeholder='Name of your project' />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='phonenumber'>Phone Number</Label>
              <Input id='phonenumber' placeholder='Name of your project' />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Name of your project'
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='confirmpassword'>Confirm Password</Label>
              <Input
                id='confirmpassword'
                type='password'
                placeholder='Name of your project'
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  )
}

export default Register
