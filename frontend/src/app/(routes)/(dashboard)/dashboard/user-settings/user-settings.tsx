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
    <div className='flex flex-col gap-6 bg-sb-content min-h-screen p-6'>
      <h1 className='text-2xl font-semibold text-sb-text-primary'>User Settings</h1>

      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className='bg-sb-surface border border-sb-border'>
          <TabsTrigger 
            value='profile'
            className='data-[state=active]:bg-sb-surface-hover data-[state=active]:text-sb-text-primary text-sb-text-secondary hover:text-sb-text-primary'
          >
            My profile
          </TabsTrigger>
          <TabsTrigger 
            value='password'
            className='data-[state=active]:bg-sb-surface-hover data-[state=active]:text-sb-text-primary text-sb-text-secondary hover:text-sb-text-primary'
          >
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value='profile' className='mt-4'>
          <div className='max-w-xl'>
            <h2 className='text-base font-medium mb-3 text-sb-text-primary'>User Information</h2>
            <form action={profileAction} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2 text-sb-text-primary'>
                  Full name
                </label>
                <Input
                  name='full_name'
                  defaultValue={profileDefaults.full_name}
                  placeholder='John Doe'
                  className='bg-sb-surface-hover border-sb-border text-sb-text-primary placeholder-sb-text-secondary focus:ring-sb-primary'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2 text-sb-text-primary'>Email</label>
                <Input
                  name='email'
                  type='email'
                  defaultValue={profileDefaults.email}
                  placeholder='you@example.com'
                  className='bg-sb-surface-hover border-sb-border text-sb-text-primary placeholder-sb-text-secondary focus:ring-sb-primary'
                />
              </div>
              <div className='flex gap-2'>
                <Button 
                  type='submit' 
                  disabled={profilePending}
                  className='bg-sb-primary hover:bg-sb-primary-hover text-sb-text-primary border-0'
                >
                  Save{profilePending && '…'}
                </Button>
                <Button 
                  type='reset' 
                  variant='outline'
                  className='bg-sb-surface-hover hover:bg-sb-surface-active text-sb-text-primary border-sb-border'
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
            <h2 className='text-base font-medium mb-3 text-sb-text-primary'>Reset password</h2>
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
                  className='bg-sb-primary hover:bg-sb-primary-hover text-sb-text-primary border-0'
                >
                  Save{passwordPending && '…'}
                </Button>
                <Button 
                  type='reset' 
                  variant='outline'
                  className='bg-sb-surface-hover hover:bg-sb-surface-active text-sb-text-primary border-sb-border'
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
