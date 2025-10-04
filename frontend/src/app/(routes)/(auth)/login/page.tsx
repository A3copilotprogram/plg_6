'use client'

import {useActionState, useState} from 'react'
import Link from 'next/link'

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
          href='/signup' 
          className='bg-[#2D3748] hover:bg-[#4A5568] text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm sm:text-base'
        >
          Sign up
        </Link>
      </header>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 py-8'>
        <div className='w-full max-w-md'>
          {/* Login Card */}
          <div className='bg-[#2D3748] rounded-lg p-6 sm:p-8 shadow-xl'>
            {/* Title and Subtitle */}
            <div className='text-center mb-6 sm:mb-8'>
              <h1 className='text-xl sm:text-2xl font-bold text-white mb-2'>
                Welcome back
              </h1>
              <p className='text-[#A0AEC0] text-sm'>
                Sign in to continue to your study space.
              </p>
            </div>

            {/* Form */}
            <form action={formAction} className='space-y-5'>
              {/* Email Field */}
              <div>
                <label htmlFor='email' className='block text-white text-sm font-medium mb-2'>
                  Email address
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <svg className='h-5 w-5 text-[#A0AEC0]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                    </svg>
                  </div>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='Enter your email'
                    required
                    className='w-full pl-10 pr-4 py-3 bg-[#4A5568] border-0 rounded-md text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
                    onBlur={handleBlur}
                  />
                </div>
                {errors.email && (
                  <p className='mt-1 text-sm text-red-400'>{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor='password' className='block text-white text-sm font-medium mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <svg className='h-5 w-5 text-[#A0AEC0]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                    </svg>
                  </div>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    required
                    className='w-full pl-10 pr-12 py-3 bg-[#4A5568] border-0 rounded-md text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
                    onBlur={handleBlur}
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
                    className='h-4 w-4 text-[#2563EB] focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label htmlFor='remember-me' className='ml-2 block text-sm text-white'>
                    Remember me
                  </label>
                </div>
                <Link
                  href='/recover-password'
                  className='text-sm text-[#2563EB] hover:text-[#1D4ED8] transition-colors duration-200'
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type='submit'
                className='w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#1E40AF] disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors duration-200 mt-6'
                disabled={isPending}
              >
                {isPending ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>

          {/* Footer Link */}
          <div className='text-center mt-8'>
            <p className='text-[#A0AEC0] text-sm'>
              Don't have an account?{' '}
              <Link
                href='/signup'
                className='text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors duration-200'
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
