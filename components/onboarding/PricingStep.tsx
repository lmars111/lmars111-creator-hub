'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'

interface PricingStepProps {
  data: {
    monthlyPrice: number
  }
  onComplete: (data: any) => void
  onNext: () => void
}

export default function PricingStep({ data, onComplete, onNext }: PricingStepProps) {
  const [monthlyPrice, setMonthlyPrice] = useState(data.monthlyPrice)

  const isValid = monthlyPrice >= 2.99 && monthlyPrice <= 99.99

  const handleContinue = () => {
    if (isValid) {
      onComplete({ monthlyPrice })
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Your Subscription Price</h3>
        <p className="text-gray-600">
          Choose your monthly subscription price. Fans pay this to access your exclusive content and chat.
        </p>
      </div>

      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Label htmlFor="price" className="text-lg font-medium">Monthly Subscription Price</Label>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl text-gray-600">$</span>
              <Input
                id="price"
                type="number"
                min="2.99"
                max="99.99"
                step="0.01"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(parseFloat(e.target.value) || 0)}
                className="text-center text-2xl font-bold w-32"
              />
              <span className="text-lg text-gray-600">/month</span>
            </div>
            
            {!isValid && (
              <p className="text-sm text-red-600">
                Price must be between $2.99 and $99.99
              </p>
            )}

            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium text-gray-900 mb-2">Revenue Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subscription Price:</span>
                  <span>${monthlyPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Platform Fee (30%):</span>
                  <span>-${(monthlyPrice * 0.3).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-green-600 border-t pt-1">
                  <span>Your Earnings:</span>
                  <span>${(monthlyPrice * 0.7).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {[4.99, 9.99, 19.99].map((price) => (
          <Button
            key={price}
            variant={monthlyPrice === price ? "default" : "outline"}
            onClick={() => setMonthlyPrice(price)}
            className="h-auto p-4 flex flex-col"
          >
            <span className="text-lg font-bold">${price}</span>
            <span className="text-sm opacity-75">Popular</span>
          </Button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue} 
          disabled={!isValid}
          className="px-8"
        >
          Continue to AI Setup
        </Button>
      </div>
    </div>
  )
}