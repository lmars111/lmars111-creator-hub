'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Shield, CheckCircle } from 'lucide-react'

interface AccountStepProps {
  data: {
    ageConfirmed: boolean
    termsAccepted: boolean
  }
  onComplete: (data: any) => void
  onNext: () => void
}

export default function AccountStep({ data, onComplete, onNext }: AccountStepProps) {
  const [ageConfirmed, setAgeConfirmed] = useState(data.ageConfirmed)
  const [termsAccepted, setTermsAccepted] = useState(data.termsAccepted)

  const isValid = ageConfirmed && termsAccepted

  const handleContinue = () => {
    if (isValid) {
      onComplete({ ageConfirmed, termsAccepted })
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Verification</h3>
        <p className="text-gray-600">
          Before we begin, we need to verify some important details about your account.
        </p>
      </div>

      <div className="space-y-4">
        <Card className={`border-2 ${ageConfirmed ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={ageConfirmed}
                onCheckedChange={(checked) => setAgeConfirmed(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900 cursor-pointer">
                  Age Verification (18+)
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  I confirm that I am 18 years of age or older and legally able to enter into contracts.
                </p>
              </div>
              {ageConfirmed && <CheckCircle className="h-5 w-5 text-green-600 mt-1" />}
            </div>
          </CardContent>
        </Card>

        <Card className={`border-2 ${termsAccepted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900 cursor-pointer">
                  Terms and Conditions
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  I have read and agree to the{' '}
                  <a href="/terms" target="_blank" className="text-purple-600 hover:underline">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="/privacy" target="_blank" className="text-purple-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
              {termsAccepted && <CheckCircle className="h-5 w-5 text-green-600 mt-1" />}
            </div>
          </CardContent>
        </Card>
      </div>

      {!isValid && (
        <div className="flex items-center space-x-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-700">
            Please confirm both items above to continue with creator onboarding.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue} 
          disabled={!isValid}
          className="px-8"
        >
          Continue to Identity Verification
        </Button>
      </div>
    </div>
  )
}