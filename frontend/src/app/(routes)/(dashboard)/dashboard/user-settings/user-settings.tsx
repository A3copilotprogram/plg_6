'use client'

import {useEffect, useState, useActionState} from 'react'

import {
  getMe,
  updateProfileAction,
  updatePasswordAction,
} from '@/actions/users'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import PasswordInput from '@/components/ui/auth/PasswordInput'

export default function UserSettingsClient() {
  const [profileDefaults, setProfileDefaults] = useState<{
    full_name: string
    email: string
  }>({full_name: '', email: ''})
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfileAction,
    {ok: false, error: undefined},
  )
  const [passwordState, passwordAction, passwordPending] = useActionState(
    updatePasswordAction,
    {ok: false, error: undefined},
  )

  useEffect(() => {
    (async () => {
      const result = await getMe()
      if (result.ok) {
        setProfileDefaults({
          full_name: result.data.full_name!,
          email: result.data.email,
        })
      }
    })()
  }, [])

  return (
    <div className='flex flex-col gap-6 bg-[#1A202C] min-h-screen p-6'>
      <h1 className='text-2xl font-semibold text-white'>User Settings</h1>

      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className='bg-[#2D3748] border border-[#4A5568]'>
          <TabsTrigger 
            value='profile'
            className='data-[state=active]:bg-[#4A5568] data-[state=active]:text-white text-[#A0AEC0] hover:text-white'
          >
            My profile
          </TabsTrigger>
          <TabsTrigger 
            value='password'
            className='data-[state=active]:bg-[#4A5568] data-[state=active]:text-white text-[#A0AEC0] hover:text-white'
          >
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value='profile' className='mt-4'>
          <div className='max-w-xl'>
            <h2 className='text-base font-medium mb-3 text-white'>User Information</h2>
            <form action={profileAction} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2 text-white'>
                  Full name
                </label>
                <Input
                  name='full_name'
                  defaultValue={profileDefaults.full_name}
                  placeholder='John Doe'
                  className='bg-[#4A5568] border-[#4A5568] text-white placeholder-[#A0AEC0] focus:ring-[#2563EB]'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2 text-white'>Email</label>
                <Input
                  name='email'
                  type='email'
                  defaultValue={profileDefaults.email}
                  placeholder='you@example.com'
                  className='bg-[#4A5568] border-[#4A5568] text-white placeholder-[#A0AEC0] focus:ring-[#2563EB]'
                />
              </div>
              <div className='flex gap-2'>
                <Button 
                  type='submit' 
                  disabled={profilePending}
                  className='bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-0'
                >
                  Save{profilePending && '…'}
                </Button>
                <Button 
                  type='reset' 
                  variant='outline'
                  className='bg-[#4A5568] hover:bg-[#5A6578] text-white border-[#4A5568]'
                >
                  Cancel
                </Button>
              </div>
              <p
                className={
                  profileState.ok
                    ? 'text-green-400 text-sm'
                    : 'text-red-400 text-sm'
                }
              >
                {profileState.ok
                  ? 'Profile updated successfully'
                  : profileState.error?.message}
              </p>
            </form>
          </div>
        </TabsContent>

        <TabsContent value='password' className='mt-4'>
          <div className='max-w-xl'>
            <h2 className='text-base font-medium mb-3 text-white'>Reset password</h2>
            <form action={passwordAction} className='space-y-4'>
              <PasswordInput
                id='current_password'
                name='current_password'
                label='Current password'
              />
              <PasswordInput
                id='new_password'
                name='new_password'
                label='New password'
              />
              <div className='flex gap-2'>
                <Button 
                  type='submit' 
                  disabled={passwordPending}
                  className='bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-0'
                >
                  Save{passwordPending && '…'}
                </Button>
                <Button 
                  type='reset' 
                  variant='outline'
                  className='bg-[#4A5568] hover:bg-[#5A6578] text-white border-[#4A5568]'
                >
                  Cancel
                </Button>
              </div>
              <p
                className={
                  passwordState.ok
                    ? 'text-green-400 text-sm'
                    : 'text-red-400 text-sm'
                }
              >
                {passwordState.ok
                  ? 'Password updated successfully'
                  : passwordState.error?.message}
              </p>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
