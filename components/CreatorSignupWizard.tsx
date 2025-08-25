'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Check, ArrowRight, ArrowLeft, Upload, CreditCard, Rocket } from 'lucide-react'

interface WizardStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface FormData {
  // Step 1: Account
  email: string
  name: string
  password: string
  confirmPassword: string
  referralCode?: string
  
  // Step 2: Profile
  handle: string
  displayName: string
  bio: string
  image?: File
  headerImage?: File
  
  // Step 3: Stripe (handled separately)
  stripeAccountId?: string
  
  // Step 4: Content
  contentDescription: string
  pricing: {
    chatPrice: number
    contentPrice: number
  }
}

export default function CreatorSignupWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    handle: '',
    displayName: '',
    bio: '',
    contentDescription: '',
    pricing: {
      chatPrice: 5,
      contentPrice: 10
    }
  })

  const steps: WizardStep[] = [
    {
      id: 'account',
      title: 'Create Account',
      description: 'Set up your creator account',
      completed: currentStep > 0
    },
    {
      id: 'profile',
      title: 'Build Profile',
      description: 'Create your creator profile',
      completed: currentStep > 1
    },
    {
      id: 'payments',
      title: 'Setup Payments',
      description: 'Connect Stripe for payouts',
      completed: currentStep > 2
    },
    {
      id: 'content',
      title: 'Upload Content',
      description: 'Add your first content',
      completed: currentStep > 3
    },
    {
      id: 'launch',
      title: 'Launch',
      description: 'Go live with your profile',
      completed: currentStep > 4
    }
  ]

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(formData.email && formData.name && formData.password && 
                 formData.password === formData.confirmPassword)
      case 1:
        return !!(formData.handle && formData.displayName && formData.bio)
      case 2:
        return !!formData.stripeAccountId
      case 3:
        return !!formData.contentDescription
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // In production, this would create the creator account
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      // Redirect to creator dashboard
      router.push('/creator/dashboard')
    } catch (err) {
      setError('Failed to create creator account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData({ password: e.target.value })}
                  placeholder="Create a password"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="referralCode">Referral Code (Optional)</Label>
              <Input
                id="referralCode"
                value={formData.referralCode || ''}
                onChange={(e) => updateFormData({ referralCode: e.target.value })}
                placeholder="Enter referral code if you have one"
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="handle">Creator Handle</Label>
                <Input
                  id="handle"
                  value={formData.handle}
                  onChange={(e) => updateFormData({ handle: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                  placeholder="yourhandle"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your unique URL: /c/{formData.handle || 'yourhandle'}
                </p>
              </div>
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => updateFormData({ displayName: e.target.value })}
                  placeholder="Your Display Name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => updateFormData({ bio: e.target.value })}
                placeholder="Tell your fans about yourself..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Profile Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload or drag image here</p>
                </div>
              </div>
              <div>
                <Label>Header Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload or drag image here</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-semibold mb-2">Connect Stripe for Payments</h3>
              <p className="text-gray-600 mb-6">
                Securely connect your Stripe account to receive payments from fans
              </p>
              
              <Button 
                onClick={() => updateFormData({ stripeAccountId: 'acct_demo_' + Date.now() })}
                className="mb-4"
              >
                Connect Stripe Account
              </Button>
              
              {formData.stripeAccountId && (
                <div className="flex items-center justify-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  Stripe account connected successfully
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Revenue Split</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Your earnings:</span>
                  <span className="font-semibold">80%</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform fee:</span>
                  <span>20%</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Referral commissions:</span>
                  <span>Up to 8% (L1: 5%, L2: 2%, L3: 1%)</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="contentDescription">Content Description</Label>
              <Textarea
                id="contentDescription"
                value={formData.contentDescription}
                onChange={(e) => updateFormData({ contentDescription: e.target.value })}
                placeholder="Describe the type of content you'll be sharing..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chatPrice">Chat Price ($)</Label>
                <Input
                  id="chatPrice"
                  type="number"
                  min="1"
                  value={formData.pricing.chatPrice}
                  onChange={(e) => updateFormData({ 
                    pricing: { ...formData.pricing, chatPrice: Number(e.target.value) }
                  })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Price for starting a conversation
                </p>
              </div>
              <div>
                <Label htmlFor="contentPrice">Content Price ($)</Label>
                <Input
                  id="contentPrice"
                  type="number"
                  min="1"
                  value={formData.pricing.contentPrice}
                  onChange={(e) => updateFormData({ 
                    pricing: { ...formData.pricing, contentPrice: Number(e.target.value) }
                  })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Average price for premium content
                </p>
              </div>
            </div>

            <div>
              <Label>Upload First Content</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Upload your first piece of content</p>
                <p className="text-sm text-gray-600 mb-4">
                  Add an image, video, or other content to attract your first fans
                </p>
                <Button variant="outline">Choose File</Button>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div>
              <Rocket className="h-16 w-16 mx-auto mb-4 text-purple-600" />
              <h3 className="text-2xl font-bold mb-2">Ready to Launch!</h3>
              <p className="text-gray-600 mb-6">
                Your creator profile is ready. Review your information below and launch your profile.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h4 className="font-semibold mb-4">Profile Summary</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Handle:</strong> @{formData.handle}</div>
                <div><strong>Display Name:</strong> {formData.displayName}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Chat Price:</strong> ${formData.pricing.chatPrice}</div>
                <div><strong>Stripe:</strong> {formData.stripeAccountId ? 'Connected' : 'Not connected'}</div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? 'Launching...' : 'Launch My Profile'} 
              <Rocket className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  index === currentStep 
                    ? 'border-purple-600 bg-purple-600 text-white' 
                    : step.completed 
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {step.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px ml-4 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Step {currentStep + 1} of {steps.length}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}