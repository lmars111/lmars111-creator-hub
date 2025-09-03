'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Mail, ArrowLeft } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/'
  const error = searchParams?.get('error')

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl,
      })

      if (result?.ok) {
        setEmailSent(true)
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl })
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We've sent a sign in link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Click the link in your email to sign in to your account.
              </p>
              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="w-full"
              >
                Use a different email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <CardTitle>Sign in to CreatorChat Hub</CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error === 'OAuthSignin' && 'Error with OAuth sign in'}
              {error === 'OAuthCallback' && 'Error with OAuth callback'}
              {error === 'OAuthCreateAccount' && 'Error creating OAuth account'}
              {error === 'EmailCreateAccount' && 'Error creating email account'}
              {error === 'Callback' && 'Error in callback'}
              {error === 'OAuthAccountNotLinked' && 'OAuth account not linked'}
              {error === 'EmailSignin' && 'Error sending email'}
              {error === 'CredentialsSignin' && 'Invalid credentials'}
              {error === 'SessionRequired' && 'Please sign in to access this page'}
              {!['OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'EmailCreateAccount', 'Callback', 'OAuthAccountNotLinked', 'EmailSignin', 'CredentialsSignin', 'SessionRequired'].includes(error) && 'An error occurred'}
            </div>
          )}

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
            type="button"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email}
            >
              {isLoading ? 'Sending...' : 'Send magic link'}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}