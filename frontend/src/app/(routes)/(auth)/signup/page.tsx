'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {useRouter} from 'next/navigation'
import {zodResolver} from '@hookform/resolvers/zod'
import Link from 'next/link'

import {IAuthState} from '@/types/auth'
import {register} from '@/actions/auth'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  PasswordFormInput,
} from '@/components/ui/form'
import {signUpSchema, SignUpSchema} from '@/types/form'

export default function SignUpPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [state, setState] = useState<IAuthState>({
    error: undefined,
    ok: false,
  })

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  async function onSubmit(data: SignUpSchema) {
    try {
      setIsPending(true)
      const response = await register(data)
      if (response.ok) {
        router.push('/login')
      } else {
        setState({
          error: response.error,
          ok: false,
        })
      }
    } catch {
      // Do nothing
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#1A202C] flex flex-col'>
      {/* Header */}
      <header className='flex justify-between items-center px-4 sm:px-6 py-4'>
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>!</span>
          </div>
          <span className='text-white text-lg sm:text-xl font-semibold'>StudyBuddy</span>
        </div>
        <Link 
          href='/login' 
          className='text-white hover:text-[#60A5FA] transition-colors duration-200 text-sm sm:text-base'
        >
          Log In
        </Link>
      </header>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 py-8'>
        <div className='w-full max-w-md'>
          {/* Sign Up Card */}
          <div className='bg-[#2D3748] rounded-lg p-6 sm:p-8 shadow-xl'>
            {/* Title and Subtitle */}
            <div className='text-center mb-6 sm:mb-8'>
              <h1 className='text-xl sm:text-2xl font-bold text-white mb-2'>
                Create your account
              </h1>
              <p className='text-[#A0AEC0] text-sm'>
                Join our community of learners.
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                {/* Name */}
                <FormField
                  control={form.control}
                  name='full_name'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className='text-white text-sm font-medium'>
                        Name
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          placeholder='Enter your name'
                          className='w-full px-4 py-3 bg-[#4A5568] border-0 rounded-md text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name='email'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className='text-white text-sm font-medium'>
                        Email address
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type='email'
                          placeholder='Enter your email'
                          className='w-full px-4 py-3 bg-[#4A5568] border-0 rounded-md text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name='password'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className='text-white text-sm font-medium'>
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Enter your password'
                            className='w-full px-4 py-3 pr-12 bg-[#4A5568] border-0 rounded-md text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
                          />
                          <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-[#A0AEC0] hover:text-white transition-colors duration-200'
                          >
                            {showPassword ? (
                              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21' />
                              </svg>
                            ) : (
                              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                              </svg>
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name='confirm_password'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className='text-white text-sm font-medium'>
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <input
                            {...field}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Confirm your password'
                            className='w-full px-4 py-3 pr-12 bg-[#4A5568] border-0 rounded-md text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
                          />
                          <button
                            type='button'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-[#A0AEC0] hover:text-white transition-colors duration-200'
                          >
                            {showConfirmPassword ? (
                              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21' />
                              </svg>
                            ) : (
                              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                              </svg>
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Server error */}
                {state && !state.ok && (
                  <div className='text-red-400 text-sm'>{state.error?.message}</div>
                )}

                {/* Submit Button */}
                <button
                  type='submit'
                  className='w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#1E40AF] disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors duration-200 mt-6'
                  disabled={isPending}
                >
                  {isPending ? 'Creating account...' : 'Sign Up'}
                </button>
              </form>
            </Form>
          </div>

          {/* Footer Link */}
          <div className='text-center mt-8'>
            <p className='text-[#A0AEC0] text-sm'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors duration-200'
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
