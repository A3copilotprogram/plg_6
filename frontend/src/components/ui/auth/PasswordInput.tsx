import React, {useState} from 'react'
import {Eye, EyeOff} from 'react-feather'

// Define the props for the PasswordInput component
interface PasswordInputProps {
  className?: string
  error?: string | null
  label: string
}

const PasswordInput: React.FC<
  PasswordInputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({className, error, label, ...props}) => {
  // State to manage the visibility of the password
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor='password'
        className='block text-sm font-medium mb-2 text-white'
      >
        {label}
      </label>
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        placeholder='••••••••••'
        required
        className={`w-full px-4 py-3 pr-12 border rounded-md focus:outline-none focus:ring-2 transition-colors bg-[#4A5568] text-white placeholder-[#A0AEC0] ${
          error
            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
            : 'border-[#4A5568] focus:ring-[#2563EB] focus:border-[#2563EB]'
        }`}
      />
      <button
        type='button'
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className='absolute right-3 top-9 text-[#A0AEC0] hover:text-white p-1.5'
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <Eye height={20} width={20} className='text-[#A0AEC0] hover:text-white' />
        ) : (
          <EyeOff height={20} width={20} className='text-[#A0AEC0] hover:text-white' />
        )}
        <span className='sr-only'>
          {showPassword ? 'Hide password' : 'Show password'}
        </span>
      </button>
      {error && <p className='mt-1 text-sm text-red-400'>{error}</p>}
    </div>
  )
}

export default PasswordInput
