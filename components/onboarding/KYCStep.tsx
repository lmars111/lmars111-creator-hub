'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertCircle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react'

interface KYCStepProps {
  data: {
    status: 'pending' | 'verified' | 'failed'
    sessionId?: string
  }
  onComplete: (data: any) => void
  onNext: () => void
}

export default function KYCStep({ data, onComplete, onNext }: KYCStepProps) {
  const [status, setStatus] = useState(data.status)
  const [isLoading, setIsLoading] = useState(false)

  const handleStartVerification = async () => {
    setIsLoading(true)
    try {
      // Create Stripe Identity verification session
      const response = await fetch('/api/kyc/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()
      
      if (data.success) {
        // Open Stripe Identity verification in new window
        window.open(data.url, '_blank')
        // Start polling for verification status
        pollVerificationStatus(data.sessionId)
      } else {
        throw new Error(data.error || 'Failed to create verification session')
      }
    } catch (error) {
      console.error('KYC error:', error)
      alert('Failed to start verification. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const pollVerificationStatus = async (sessionId: string) => {
    let attempts = 0
    const maxAttempts = 60 // 5 minutes max

    const poll = async () => {
      try {
        const response = await fetch(`/api/kyc/check-status?sessionId=${sessionId}`)
        const data = await response.json()

        if (data.status === 'verified') {
          setStatus('verified')
          onComplete({ status: 'verified', sessionId })
          return
        } else if (data.status === 'failed') {
          setStatus('failed')
          onComplete({ status: 'failed', sessionId })
          return
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000) // Check every 5 seconds
        }
      } catch (error) {
        console.error('Status polling error:', error)
      }
    }

    poll()
  }

  const getStatusDisplay = () => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
          badge: 'bg-green-100 text-green-800',
          title: 'Identity Verified',
          description: 'Your identity has been successfully verified.',
        }
      case 'failed':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          badge: 'bg-red-100 text-red-800',
          title: 'Verification Failed',
          description: 'Identity verification was unsuccessful. Please try again.',
        }
      default:
        return {
          icon: Shield,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 border-purple-200',
          badge: 'bg-purple-100 text-purple-800',
          title: 'Identity Verification Required',
          description: 'Complete identity verification to comply with financial regulations.',
        }
    }
  }

  const statusDisplay = getStatusDisplay()
  const StatusIcon = statusDisplay.icon

  return (
    <div className="space-y-6">
      <div className="text-center">
        <StatusIcon className={`h-12 w-12 ${statusDisplay.color} mx-auto mb-4`} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Identity Verification (KYC)</h3>
        <p className="text-gray-600">
          We use Stripe Identity to verify your identity for regulatory compliance and payment processing.
        </p>
      </div>

      <Card className={`border-2 ${statusDisplay.bgColor}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <StatusIcon className={`h-5 w-5 ${statusDisplay.color}`} />
              <span className="font-medium text-gray-900">{statusDisplay.title}</span>
            </div>
            <Badge className={statusDisplay.badge}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          
          <p className="text-gray-600 mb-4">{statusDisplay.description}</p>

          {status === 'pending' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What you'll need:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Government-issued photo ID (passport, driver's license, etc.)</li>
                  <li>• Access to your phone camera or computer webcam</li>
                  <li>• 5-10 minutes to complete the process</li>
                </ul>
              </div>

              <Button 
                onClick={handleStartVerification} 
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Starting Verification...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    <span>Start Identity Verification</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {status === 'failed' && (
            <Button 
              onClick={handleStartVerification} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          )}

          {status === 'verified' && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Verification complete!</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={status !== 'verified'}
          className="px-8"
        >
          Continue to Profile Setup
        </Button>
      </div>
    </div>
  )
}