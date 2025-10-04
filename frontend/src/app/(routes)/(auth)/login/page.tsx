'use client'

import {useActionState, useState} from 'react'
import Link from 'next/link'
import {Zap} from 'react-feather'

import {authenticate} from '@/actions/auth'
import {IAuthState} from '@/types/auth'
import {validateField} from '@/lib/form'

export default function Login() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [state, formAction, isPending] = useActionState<
    IAuthState | undefined,
    FormData
  >(authenticate, {
    error: undefined,
    ok: false,
  })

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    const fieldError = validateField(name, value)
    setErrors((prev) => ({...prev, [name]: fieldError}))
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
          href='/signup' 
          className='text-sb-text-primary hover:text-sb-primary-light transition-colors duration-200 text-sm sm:text-base'
        >
          Sign up
        </Link>
      </header>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 py-8'>
        <div className='w-full max-w-md'>
          {/* Title and Subtitle - Outside the card */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl sm:text-4xl font-bold text-sb-text-primary mb-3'>
              Welcome back
            </h1>
            <p className='text-sb-text-secondary text-base'>
              Sign in to continue to your study space.
            </p>
          </div>

          {/* Login Card */}
          <div className='bg-sb-surface rounded-lg p-6 sm:p-8 shadow-xl'>
            {/* Form */}
            <form action={formAction} className='space-y-4'>
              {/* Email Field */}
              <div>
                <label htmlFor='email' className='block text-sb-text-primary text-sm font-medium mb-2'>
                  Email address
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <svg className='h-5 w-5 text-sb-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                    </svg>
                  </div>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='Enter your email'
                    required
                    className='w-full pl-10 pr-4 py-3 bg-sb-surface-hover border-0 rounded-md text-sb-text-primary placeholder-sb-text-secondary focus:outline-none focus:ring-2 focus:ring-sb-primary transition-colors duration-200'
                    onBlur={handleBlur}
                  />
                </div>
                {errors.email && (
                  <p className='mt-1 text-sm text-red-400'>{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor='password' className='block text-sb-text-primary text-sm font-medium mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <svg className='h-5 w-5 text-sb-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                    </svg>
                  </div>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    required
                    className='w-full pl-10 pr-12 py-3 bg-sb-surface-hover border-0 rounded-md text-sb-text-primary placeholder-sb-text-secondary focus:outline-none focus:ring-2 focus:ring-sb-primary transition-colors duration-200'
                    onBlur={handleBlur}
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
                {errors.password && (
                  <p className='mt-1 text-sm text-red-400'>{errors.password}</p>
                )}
                {state && !state?.ok && (
                  <div className='text-red-400 text-sm mt-1'>{state?.error?.message}</div>
                )}
              </div>

              {/* Remember Me and Forgot Password */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className='h-4 w-4 text-sb-primary focus:ring-sb-primary border-sb-border rounded'
                  />
                  <label htmlFor='remember-me' className='ml-2 block text-sm text-sb-text-primary'>
                    Remember me
                  </label>
                </div>
                <Link
                  href='/recover-password'
                  className='text-sm text-sb-primary hover:text-sb-primary-hover transition-colors duration-200'
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type='submit'
                className='w-full py-3 px-4 bg-sb-primary hover:bg-sb-primary-hover disabled:bg-sb-primary-hover disabled:cursor-not-allowed text-sb-text-primary font-semibold rounded-md transition-colors duration-200 mt-2'
                disabled={isPending}
              >
                {isPending ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>

          {/* Footer Link */}
          <div className='text-center mt-6'>
            <p className='text-sb-text-secondary text-base'>
              Don't have an account?{' '}
              <Link
                href='/signup'
                className='text-sb-primary hover:text-sb-primary-hover font-medium transition-colors duration-200'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
