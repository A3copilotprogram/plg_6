'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {useRouter} from 'next/navigation'
import {zodResolver} from '@hookform/resolvers/zod'
import Link from 'next/link'
import {Zap} from 'react-feather'

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
    <div className='min-h-screen bg-sb-background flex flex-col'>
      {/* Header */}
      <header className='flex justify-between items-center px-4 sm:px-6 py-4 border-b border-sb-border'>
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-sb-primary rounded-lg flex items-center justify-center'>
            <Zap className='w-4 h-4 text-sb-text-primary' />
          </div>
          <span className='text-sb-text-primary text-lg sm:text-xl font-semibold'>StudyBuddy</span>
        </div>
        <Link 
          href='/login' 
          className='text-sb-text-primary hover:text-sb-primary-light transition-colors duration-200 text-sm sm:text-base'
        >
          Log In
        </Link>
      </header>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 py-8'>
        <div className='w-full max-w-md'>
          {/* Title and Subtitle - Outside the card */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl sm:text-4xl font-bold text-sb-text-primary mb-3'>
              Create your account
            </h1>
            <p className='text-sb-text-secondary text-base'>
              Join our community of learners.
            </p>
          </div>

          {/* Sign Up Card */}
          <div className='bg-sb-surface rounded-lg p-6 sm:p-8 shadow-xl'>
            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                {/* Name */}
                <FormField
                  control={form.control}
                  name='full_name'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className='text-sb-text-primary text-sm font-medium'>
                        Name
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <svg className='h-5 w-5 text-sb-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                            </svg>
                          </div>
                          <input
                            {...field}
                            placeholder='Enter your name'
                            className='w-full pl-10 pr-4 py-3 bg-sb-surface-hover border-0 rounded-md text-sb-text-primary placeholder-sb-text-secondary focus:outline-none focus:ring-2 focus:ring-sb-primary transition-colors duration-200'
                          />
                        </div>
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
                      <FormLabel className='text-sb-text-primary text-sm font-medium'>
                        Email address
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <svg className='h-5 w-5 text-sb-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                            </svg>
                          </div>
                          <input
                            {...field}
                            type='email'
                            placeholder='Enter your email'
                            className='w-full pl-10 pr-4 py-3 bg-sb-surface-hover border-0 rounded-md text-sb-text-primary placeholder-sb-text-secondary focus:outline-none focus:ring-2 focus:ring-sb-primary transition-colors duration-200'
                          />
                        </div>
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
                      <FormLabel className='text-sb-text-primary text-sm font-medium'>
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <svg className='h-5 w-5 text-sb-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                            </svg>
                          </div>
                          <input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Enter your password'
                            className='w-full pl-10 pr-12 py-3 bg-sb-surface-hover border-0 rounded-md text-sb-text-primary placeholder-sb-text-secondary focus:outline-none focus:ring-2 focus:ring-sb-primary transition-colors duration-200'
                          />
                          <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-sb-text-secondary hover:text-sb-text-primary transition-colors duration-200'
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
                      <FormLabel className='text-sb-text-primary text-sm font-medium'>
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <svg className='h-5 w-5 text-sb-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                            </svg>
                          </div>
                          <input
                            {...field}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Confirm your password'
                            className='w-full pl-10 pr-12 py-3 bg-sb-surface-hover border-0 rounded-md text-sb-text-primary placeholder-sb-text-secondary focus:outline-none focus:ring-2 focus:ring-sb-primary transition-colors duration-200'
                          />
                          <button
                            type='button'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-sb-text-secondary hover:text-sb-text-primary transition-colors duration-200'
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
                  className='w-full py-3 px-4 bg-sb-primary hover:bg-sb-primary-hover disabled:bg-sb-primary-hover disabled:cursor-not-allowed text-sb-text-primary font-semibold rounded-md transition-colors duration-200 mt-2'
                  disabled={isPending}
                >
                  {isPending ? 'Creating account...' : 'Sign Up'}
                </button>
              </form>
            </Form>
          </div>

          {/* Footer Link */}
          <div className='text-center mt-6'>
            <p className='text-sb-text-secondary text-base'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-sb-primary hover:text-sb-primary-hover font-medium transition-colors duration-200'
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
