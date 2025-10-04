'use client'

import {useState} from 'react'
import Link from 'next/link'

import {emailPattern} from '@/lib/auth'

export default function RecoverPasswordPage() {
  const [error, _setError] = useState<string | null>(null)
  const [isLoading, _setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmitted, _setIsSubmitted] = useState(false)


  const validateEmail = (value: string) => {
    if (!value) {
      return 'Email is required'
    }
    if (!emailPattern.value.test(value)) {
      return emailPattern.message
    }
    return ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    setEmail(value)

    // Clear error when user starts typing
    if (emailError) {
      setEmailError('')
    }
    // if (error) {
    //   resetError()
    // }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const {value} = e.target
    const error = validateEmail(value)
    setEmailError(error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // if (isLoading) return

    // resetError()

    // Validate email
    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }

    try {
      // const success = await recoverPassword(email)
      // if (success) {
      //   setIsSubmitted(true)
      //   setEmail('')
      // }
    } catch {
      // Error is handled by useAuth hook
    }
  }

  if (isSubmitted) {
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
            Sign In
          </Link>
        </header>

        {/* Main Content */}
        <div className='flex-1 flex items-center justify-center px-4 sm:px-6 py-8'>
          <div className='w-full max-w-md'>
            {/* Success Card */}
            <div className='bg-[#2D3748] rounded-lg p-6 sm:p-8 shadow-xl text-center'>
              <div className='mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-500/20 mb-6'>
                <svg
                  className='h-6 w-6 text-green-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h2 className='text-xl sm:text-2xl font-bold text-white mb-2'>
                Check your email
              </h2>
              <p className='text-[#A0AEC0] text-sm mb-8'>
                We&apos;ve sent a password recovery link to your email address.
              </p>
              <Link
                href='/login'
                className='w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-md transition-colors duration-200 inline-block'
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
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
          Sign In
        </Link>
      </header>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 py-8'>
        <div className='w-full max-w-md'>
          {/* Recovery Card */}
          <div className='bg-[#2D3748] rounded-lg p-6 sm:p-8 shadow-xl'>
            {/* Title and Subtitle */}
            <div className='text-center mb-6 sm:mb-8'>
              <h1 className='text-xl sm:text-2xl font-bold text-white mb-2'>
                Password Recovery
              </h1>
              <p className='text-[#A0AEC0] text-sm'>
                A password recovery email will be sent to the registered account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-5'>
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
                    value={email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 bg-[#4A5568] border-0 rounded-md text-white placeholder-[#A0AEC0] focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      emailError || error
                        ? 'focus:ring-red-500'
                        : 'focus:ring-blue-500'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className='mt-1 text-sm text-red-400'>{emailError}</p>
                )}
              </div>

              {error && (
                <div className='text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-md p-3'>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type='submit'
                className='w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#1E40AF] disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors duration-200 mt-6'
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Recovery Email'}
              </button>
            </form>
          </div>

          {/* Footer Link */}
          <div className='text-center mt-8'>
            <p className='text-[#A0AEC0] text-sm'>
              Remember your password?{' '}
              <Link
                href='/login'
                className='text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors duration-200'
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
