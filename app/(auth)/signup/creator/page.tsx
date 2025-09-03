'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { signupSchema, calculatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor, type SignupData } from '@/lib/validators'

export default function CreatorSignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPInput, setShowOTPInput] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  })

  const password = watch('password', '')
  const passwordStrength = calculatePasswordStrength(password)

  const onSubmit = async (data: SignupData) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/auth/signup/creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setError('email', { message: 'Email already exists' })
        } else if (response.status === 429) {
          setErrorMessage('Too many signup attempts. Please try again later.')
        } else if (result.details) {
          // Handle validation errors
          result.details.forEach((error: any) => {
            if (error.path.length > 0) {
              setError(error.path[0] as keyof SignupData, { message: error.message })
            }
          })
        } else {
          setErrorMessage(result.error || 'Failed to create account')
        }
        return
      }

      setSuccessMessage(result.message)
      setShowOTPInput(true)
    } catch (error) {
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit code')
      return
    }

    setIsVerifying(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: watch('email'),
          code: otpCode,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrorMessage(result.error || 'Failed to verify email')
        return
      }

      setSuccessMessage(result.message)
      // Redirect to KYC onboarding after successful verification
      setTimeout(() => {
        window.location.href = '/onboarding/creator/kyc'
      }, 2000)
    } catch (error) {
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleOAuthSignIn = (provider: 'google' | 'apple') => {
    signIn(provider, { callbackUrl: '/onboarding/creator' })
  }

  if (showOTPInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verify Your Email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a 6-digit code to your email address
            </p>
          </div>

          {successMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={isVerifying || otpCode.length !== 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join as a Creator
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start earning and connecting with your fans
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getPasswordStrengthColor(passwordStrength)}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {getPasswordStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                {...register('isAdult')}
                id="isAdult"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isAdult" className="ml-2 block text-sm text-gray-900">
                I confirm that I am 18 years of age or older
              </label>
            </div>
            {errors.isAdult && (
              <p className="text-sm text-red-600">{errors.isAdult.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthSignIn('google')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn('apple')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C9.396 0 8.924.025 8.447.048 6.96.089 5.84.24 4.908.386 3.986.53 3.16.695 2.458 1.397c-.702.703-.867 1.528-1.01 2.45-.147.933-.297 2.053-.338 3.54C1.085 8.924 1.06 9.396 1.06 12.017s.025 3.093.048 3.57c.041 1.487.191 2.607.338 3.54.143.922.308 1.747 1.01 2.45.702.702 1.528.867 2.45 1.01.933.147 2.053.297 3.54.338.477.023.949.048 3.57.048s3.093-.025 3.57-.048c1.487-.041 2.607-.191 3.54-.338.922-.143 1.747-.308 2.45-1.01.702-.702.867-1.528 1.01-2.45.147-.933.297-2.053.338-3.54.023-.477.048-.949.048-3.57s-.025-3.093-.048-3.57c-.041-1.487-.191-2.607-.338-3.54-.143-.922-.308-1.747-1.01-2.45-.702-.702-1.528-.867-2.45-1.01-.933-.147-2.053-.297-3.54-.338C15.11.025 14.638 0 12.017 0zm0 21.6c-2.569 0-2.888-.012-3.897-.06-.85-.031-1.49-.142-2.071-.3-.562-.165-1.075-.385-1.565-.875-.49-.49-.71-1.003-.875-1.565-.158-.581-.269-1.221-.3-2.071-.048-1.009-.06-1.328-.06-3.897s.012-2.888.06-3.897c.031-.85.142-1.49.3-2.071.165-.562.385-1.075.875-1.565.49-.49 1.003-.71 1.565-.875.581-.158 1.221-.269 2.071-.3 1.009-.048 1.328-.06 3.897-.06s2.888.012 3.897.06c.85.031 1.49.142 2.071.3.562.165 1.075.385 1.565.875.49.49.71 1.003.875 1.565.158.581.269 1.221.3 2.071.048 1.009.06 1.328.06 3.897s-.012 2.888-.06 3.897c-.031.85-.142 1.49-.3 2.071-.165.562-.385 1.075-.875 1.565-.49.49-1.003.71-1.565.875-.581.158-1.221.269-2.071.3-1.009.048-1.328.06-3.897.06z"/>
                </svg>
                <span className="ml-2">Apple</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}