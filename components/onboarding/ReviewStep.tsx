'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, CheckCircle, ExternalLink } from 'lucide-react'

interface ReviewStepProps {
  data: {
    tosAccepted: boolean
    guidelinesAccepted: boolean
  }
  onComplete: (data: any) => void
  onNext: () => void
}

export default function ReviewStep({ data, onComplete, onNext }: ReviewStepProps) {
  const [tosAccepted, setTosAccepted] = useState(data.tosAccepted)
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(data.guidelinesAccepted)

  const isValid = tosAccepted && guidelinesAccepted

  const handleLaunch = () => {
    if (isValid) {
      onComplete({ tosAccepted, guidelinesAccepted })
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Review & Launch</h3>
        <p className="text-gray-600">
          Review the terms and launch your creator profile to start earning.
        </p>
      </div>

      <div className="space-y-4">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">🎉 You're almost ready!</h4>
            <p className="text-gray-600 mb-4">
              Your creator profile is set up and ready to go live. Once you accept the terms below, 
              fans will be able to discover you, subscribe, and start chatting.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Profile Complete:</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Ready</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Payments Setup:</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Connected</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">AI Chat Ready:</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Configured</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Identity Verified:</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-2 ${tosAccepted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={tosAccepted}
                onCheckedChange={(checked) => setTosAccepted(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900 cursor-pointer">
                  Terms of Service Agreement
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  I have read and agree to the{' '}
                  <a 
                    href="/terms" 
                    target="_blank" 
                    className="text-purple-600 hover:underline inline-flex items-center"
                  >
                    Terms of Service
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                  {' '}and understand my responsibilities as a creator.
                </p>
              </div>
              {tosAccepted && <CheckCircle className="h-5 w-5 text-green-600 mt-1" />}
            </div>
          </CardContent>
        </Card>

        <Card className={`border-2 ${guidelinesAccepted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={guidelinesAccepted}
                onCheckedChange={(checked) => setGuidelinesAccepted(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900 cursor-pointer">
                  Community Guidelines Agreement
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  I have read and agree to follow the{' '}
                  <a 
                    href="/content-policy" 
                    target="_blank" 
                    className="text-purple-600 hover:underline inline-flex items-center"
                  >
                    Community Guidelines
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                  {' '}and will create appropriate content for the platform.
                </p>
              </div>
              {guidelinesAccepted && <CheckCircle className="h-5 w-5 text-green-600 mt-1" />}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your profile will go live immediately</li>
          <li>• Fans can discover and subscribe to your content</li>
          <li>• You'll start receiving AI chat messages from fans</li>
          <li>• You can create and sell content right away</li>
          <li>• Earnings will be paid out to your connected bank account</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleLaunch} 
          disabled={!isValid}
          className="px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          size="lg"
        >
          🚀 Launch My Creator Profile
        </Button>
      </div>
    </div>
  )
}