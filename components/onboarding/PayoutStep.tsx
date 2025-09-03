'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'

interface PayoutStepProps {
  data: {
    stripeConnected: boolean
    accountId?: string
  }
  onComplete: (data: any) => void
  onNext: () => void
}

export default function PayoutStep({ data, onComplete, onNext }: PayoutStepProps) {
  const [status, setStatus] = useState<'pending' | 'connected' | 'failed'>(
    data.stripeConnected ? 'connected' : 'pending'
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleConnectStripe = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/creators/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: 'current_user', // Will be replaced with actual user ID
          returnUrl: window.location.href,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Redirect to Stripe Connect onboarding
        window.open(data.accountLink.url, '_blank')
        // Start polling for connection status
        pollConnectionStatus()
      } else {
        throw new Error(data.error || 'Failed to create Stripe account')
      }
    } catch (error) {
      console.error('Stripe connection error:', error)
      setStatus('failed')
      alert('Failed to connect to Stripe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const pollConnectionStatus = () => {
    let attempts = 0
    const maxAttempts = 60

    const poll = async () => {
      try {
        const response = await fetch('/api/creators/stripe-status')
        const data = await response.json()

        if (data.connected) {
          setStatus('connected')
          onComplete({ stripeConnected: true, accountId: data.accountId })
          return
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000)
        }
      } catch (error) {
        console.error('Status polling error:', error)
      }
    }

    poll()
  }

  const getStatusDisplay = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
          badge: 'bg-green-100 text-green-800',
          title: 'Stripe Connected',
          description: 'Your payout account is set up and ready to receive payments.',
        }
      case 'failed':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          badge: 'bg-red-100 text-red-800',
          title: 'Connection Failed',
          description: 'Failed to connect your Stripe account. Please try again.',
        }
      default:
        return {
          icon: CreditCard,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 border-purple-200',
          badge: 'bg-purple-100 text-purple-800',
          title: 'Connect Stripe Account',
          description: 'Set up your payout account to start receiving payments from fans.',
        }
    }
  }

  const statusDisplay = getStatusDisplay()
  const StatusIcon = statusDisplay.icon

  return (
    <div className="space-y-6">
      <div className="text-center">
        <StatusIcon className={`h-12 w-12 ${statusDisplay.color} mx-auto mb-4`} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payout Setup</h3>
        <p className="text-gray-600">
          Connect your Stripe account to receive payments from your fans securely.
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
                <h4 className="font-medium text-blue-900 mb-2">About Stripe Connect</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Secure payment processing trusted by millions</li>
                  <li>• Bank-level security for your financial information</li>
                  <li>• Fast payouts (usually 2-3 business days)</li>
                  <li>• Support for bank accounts and debit cards</li>
                </ul>
              </div>

              <Button 
                onClick={handleConnectStripe} 
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    <span>Connect Stripe Account</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {status === 'failed' && (
            <Button 
              onClick={handleConnectStripe} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          )}

          {status === 'connected' && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Ready to receive payments!</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={status !== 'connected'}
          className="px-8"
        >
          Continue to Review
        </Button>
      </div>
    </div>
  )
}