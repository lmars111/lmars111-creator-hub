'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { CheckCircle, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react'

type KycStatus = 'PENDING' | 'PROCESSING' | 'VERIFIED' | 'REJECTED'

export default function KycPage() {
  const { data: session } = useSession()
  const [status, setStatus] = useState<KycStatus>('PENDING')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [pollCount, setPollCount] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const handleStartVerification = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/kyc/create-verification-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          return_url: `${window.location.origin}/onboarding/creator/profile`
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create verification session')
      }

      setSessionId(data.sessionId)
      setStatus('PROCESSING')
      
      // Open Stripe Identity verification in new window
      if (data.client_secret) {
        window.open(data.url, '_blank')
        // Start polling for verification status
        startPolling(data.sessionId)
      }
    } catch (error) {
      console.error('KYC error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to start verification')
    } finally {
      setIsLoading(false)
    }
  }

  const startPolling = (sessionId: string) => {
    const poll = async () => {
      if (pollCount >= 30) { // Max 30 attempts (60 seconds)
        setErrorMessage('Verification timeout. Please try again.')
        return
      }

      try {
        const response = await fetch('/api/kyc/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json()
        
        if (response.ok && data.status) {
          setStatus(data.status)
          
          if (data.status === 'VERIFIED') {
            // Success! Redirect to next step after a delay
            setTimeout(() => {
              window.location.href = '/onboarding/creator/profile'
            }, 2000)
            return
          } else if (data.status === 'REJECTED') {
            setErrorMessage('Identity verification was rejected. Please contact support.')
            return
          }
        }

        // Continue polling if still processing
        if (data.status === 'PROCESSING' || data.status === 'PENDING') {
          setPollCount(prev => prev + 1)
          setTimeout(poll, 2000) // Poll every 2 seconds
        }
      } catch (error) {
        console.error('Polling error:', error)
        setPollCount(prev => prev + 1)
        setTimeout(poll, 2000)
      }
    }

    // Start polling after a short delay
    setTimeout(poll, 2000)
  }

  const getStatusDisplay = () => {
    switch (status) {
      case 'PENDING':
        return {
          title: 'Identity Verification Required',
          description: 'To comply with regulations and ensure platform security, we need to verify your identity.',
          badge: 'bg-yellow-100 text-yellow-800',
        }
      case 'PROCESSING':
        return {
          title: 'Verification in Progress',
          description: 'Please complete the identity verification process in the popup window. We\'ll automatically update your status.',
          badge: 'bg-blue-100 text-blue-800',
        }
      case 'VERIFIED':
        return {
          title: 'Identity Verified',
          description: 'Great! Your identity has been successfully verified. You can now continue with your creator setup.',
          badge: 'bg-green-100 text-green-800',
        }
      case 'REJECTED':
        return {
          title: 'Verification Failed',
          description: 'We were unable to verify your identity. Please contact our support team for assistance.',
          badge: 'bg-red-100 text-red-800',
        }
    }
  }

  const statusDisplay = getStatusDisplay()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Identity Verification</h1>
            <p className="text-gray-600">Step 2 of 7 - Creator Onboarding</p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-900">{statusDisplay.title}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.badge}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            
            <p className="text-gray-600 mb-6">{statusDisplay.description}</p>

            {status === 'PENDING' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-medium text-blue-900 mb-3">What you'll need:</h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Government-issued photo ID (passport, driver's license, etc.)</li>
                    <li>• Access to your phone camera or computer webcam</li>
                    <li>• 5-10 minutes to complete the process</li>
                  </ul>
                </div>

                <button 
                  onClick={handleStartVerification} 
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-3 py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Starting Verification...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-5 w-5" />
                      <span>Start Identity Verification</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {status === 'PROCESSING' && (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  Monitoring verification status... ({Math.min(pollCount, 30)}/30)
                </p>
              </div>
            )}

            {status === 'REJECTED' && (
              <button 
                onClick={handleStartVerification} 
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 py-3 px-6 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Try Again
              </button>
            )}

            {status === 'VERIFIED' && (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-green-800 font-medium mb-4">Verification Complete!</p>
                <p className="text-sm text-gray-600 mb-6">
                  Redirecting to profile setup...
                </p>
                <a
                  href="/onboarding/creator/profile"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Continue to Profile Setup
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-500">
              <h4 className="font-medium mb-2">Why do we need this?</h4>
              <ul className="space-y-1">
                <li>• Comply with financial regulations and anti-money laundering laws</li>
                <li>• Protect creators and fans from fraud</li>
                <li>• Enable secure payment processing through Stripe</li>
                <li>• Maintain platform trust and safety</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}