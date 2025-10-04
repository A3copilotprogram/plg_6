import React, {useState} from 'react'

// Define the props for the PasswordInput component
interface PasswordInputProps {
  className?: string
  error?: string | null
  label?: string
  leftIcon?: React.ReactNode
}

const PasswordInput: React.FC<
  PasswordInputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({className, error, label, leftIcon, ...props}) => {
  // State to manage the visibility of the password
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={props.id || 'password'}
          className='block text-sm font-medium mb-2'
        >
          {label}
        </label>
      )}
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        required
        className={className}
      />
      <button
        type='button'
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1'
        onClick={() => setShowPassword(!showPassword)}
      >
        <span className='material-symbols-outlined text-lg'>
          {showPassword ? 'visibility_off' : 'visibility'}
        </span>
        <span className='sr-only'>
          {showPassword ? 'Hide password' : 'Show password'}
        </span>
      </button>
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  )
}

export default PasswordInput
