'use client'

import {useActionState, useState} from 'react'
import Link from 'next/link'

import {authenticate} from '@/actions/auth'
import {IAuthState} from '@/types/auth'
import {validateField} from '@/lib/form'
import PasswordInput from '@/components/ui/auth/PasswordInput'

export default function Login() {
  const [errors, setErrors] = useState<Record<string, string>>({})

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
            href="/signup" 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-5 bg-transparent border border-gray-600 text-white text-sm font-semibold leading-normal hover:bg-gray-800 transition-colors"
          >
            <span className="truncate">Sign up</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-900/50 backdrop-blur-sm p-10 shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--text-primary)]">Welcome back</h2>
            <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">Sign in to continue to your study space.</p>
          </div>
          
          <form action={formAction} className="mt-8 space-y-6" method="POST">
            <input name="remember" type="hidden" value="true" />
            
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Username or Email"
                  required
                  className="form-input block w-full rounded-t-md border-0 bg-gray-800 py-3 pl-12 pr-3 text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm"
                  onBlur={handleBlur}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div className="relative">
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  required
                  className="form-input block w-full rounded-b-md border-0 bg-gray-800 py-3 pl-12 pr-3 text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm"
                  onBlur={handleBlur}
                  error={errors?.password || null}
                  leftIcon={<span className="material-symbols-outlined">lock</span>}
                />
                {state && !state?.ok && (
                  <div className="text-red-500 text-sm mt-1">{state?.error?.message}</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[var(--primary-color)] focus:ring-[var(--primary-color)] focus:ring-2"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                />
                <label className="ml-2 block text-sm text-[var(--text-secondary)]" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="/recover-password"
                  className="font-medium text-[var(--primary-color)] hover:text-blue-400"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--primary-color)] py-3 px-4 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out"
                disabled={isPending}
              >
                Login{isPending && '...'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-[var(--primary-color)] hover:text-blue-400">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
