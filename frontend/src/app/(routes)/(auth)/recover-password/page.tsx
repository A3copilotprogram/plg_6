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
      <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[var(--secondary-color)]" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between whitespace-nowrap px-10 py-5">
          <Link href="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
            <h1 className="text-xl font-bold leading-tight tracking-[-0.015em]">StudyBuddy</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-5 bg-transparent border border-gray-600 text-white text-sm font-semibold leading-normal hover:bg-gray-800 transition-colors"
            >
              <span className="truncate">Log In</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-900/50 backdrop-blur-sm p-10 shadow-2xl text-center">
            <div>
              <div className='mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-6'>
                <svg
                  className='h-6 w-6 text-green-600'
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
              <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Check your email
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                We&apos;ve sent a password recovery link to your email address.
              </p>
            </div>
            <div>
              <Link
                href="/login"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--primary-color)] py-3 px-4 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out"
              >
                Back to Sign in
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[var(--secondary-color)]" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between whitespace-nowrap px-10 py-5">
        <Link href="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
          <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
          </svg>
          <h1 className="text-xl font-bold leading-tight tracking-[-0.015em]">StudyBuddy</h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-5 bg-transparent border border-gray-600 text-white text-sm font-semibold leading-normal hover:bg-gray-800 transition-colors"
          >
            <span className="truncate">Log In</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-900/50 backdrop-blur-sm p-10 shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--text-primary)]">Password Recovery</h2>
            <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
              A password recovery email will be sent to the registered account.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor='email' className="text-sm font-medium block mb-2 text-[var(--text-primary)]">
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email'
                required
                value={email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="form-input block w-full rounded-md border-0 bg-gray-800 py-3 px-4 text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm"
              />
              {emailError && (
                <p className='mt-1 text-sm text-red-600'>{emailError}</p>
              )}
            </div>

            {error && (
              <div className='text-red-500 text-sm'>{error}</div>
            )}

            <div>
              <button
                type='submit'
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--primary-color)] py-3 px-4 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Recovery Email'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Remember your password?{' '}
            <Link
              href='/login'
              className="font-medium text-[var(--primary-color)] hover:text-blue-400"
            >
              Back to Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
