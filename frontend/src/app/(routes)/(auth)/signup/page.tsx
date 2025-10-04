'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {useRouter} from 'next/navigation'
import {zodResolver} from '@hookform/resolvers/zod'
import Link from 'next/link'

import {IAuthState} from '@/types/auth'
import {register} from '@/actions/auth'
import {signUpSchema, SignUpSchema} from '@/types/form'

export default function SignUpPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
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
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--text-primary)]">Create your account</h2>
            <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">Join our community of learners.</p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div>
              <label className="text-sm font-medium block mb-2 text-[var(--text-primary)]" htmlFor="username">Username</label>
              <input 
                {...form.register('full_name')}
                className="form-input block w-full rounded-md border-0 bg-gray-800 py-3 px-4 text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm" 
                id="username" 
                name="full_name" 
                placeholder="e.g., studious_student" 
                required 
                type="text"
              />
              {form.formState.errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.full_name.message}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2 text-[var(--text-primary)]" htmlFor="email">Email address</label>
              <input 
                {...form.register('email')}
                autoComplete="email" 
                className="form-input block w-full rounded-md border-0 bg-gray-800 py-3 px-4 text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm" 
                id="email" 
                name="email" 
                placeholder="you@example.com" 
                required 
                type="email"
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2 text-[var(--text-primary)]" htmlFor="password">Password</label>
              <input 
                {...form.register('password')}
                autoComplete="new-password" 
                className="form-input block w-full rounded-md border-0 bg-gray-800 py-3 px-4 text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                type="password"
              />
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2 text-[var(--text-primary)]" htmlFor="confirm_password">Confirm Password</label>
              <input 
                {...form.register('confirm_password')}
                autoComplete="new-password" 
                className="form-input block w-full rounded-md border-0 bg-gray-800 py-3 px-4 text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm" 
                id="confirm_password" 
                name="confirm_password" 
                placeholder="••••••••" 
                required 
                type="password"
              />
              {form.formState.errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.confirm_password.message}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                {...form.register('terms')}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[var(--primary-color)] focus:ring-[var(--primary-color)] focus:ring-2"
                id="terms"
                name="terms"
                type="checkbox"
              />
              <label className="ml-2 block text-sm text-[var(--text-secondary)]" htmlFor="terms">
                I agree to the terms & policy
              </label>
            </div>
            {form.formState.errors.terms && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.terms.message}</p>
            )}
            
            <div>
              <button 
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--primary-color)] py-3 px-4 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out" 
                type="submit"
                disabled={isPending}
              >
                {isPending ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>
            
            {/* Server error */}
            {state && !state.ok && (
              <div className='text-red-500 text-sm'>{state.error?.message}</div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link 
              href="/login"
              className="font-medium text-[var(--primary-color)] hover:text-blue-400"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
