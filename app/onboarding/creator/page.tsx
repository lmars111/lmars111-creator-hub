'use client'

import { useState, useEffect } from 'react'
import * as React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, ArrowRight, ArrowLeft, User, Shield, Image, DollarSign, Bot, CreditCard, FileText } from 'lucide-react'
import { MotionDiv, fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'

import AccountStep from '@/components/onboarding/AccountStep'
import KYCStep from '@/components/onboarding/KYCStep'
import ProfileStep from '@/components/onboarding/ProfileStep'
import PricingStep from '@/components/onboarding/PricingStep'
import AIPersonaStep from '@/components/onboarding/AIPersonaStep'
import PayoutStep from '@/components/onboarding/PayoutStep'
import ReviewStep from '@/components/onboarding/ReviewStep'

const STEPS = [
  {
    id: 'account',
    title: 'Account & Verification',
    description: 'Confirm your account and age verification',
    icon: User,
    component: AccountStep,
  },
  {
    id: 'kyc',
    title: 'Identity Verification',
    description: 'Complete KYC with Stripe Identity',
    icon: Shield,
    component: KYCStep,
  },
  {
    id: 'profile',
    title: 'Creator Profile',
    description: 'Set up your profile, bio, and media',
    icon: Image,
    component: ProfileStep,
  },
  {
    id: 'pricing',
    title: 'Pricing & Subscriptions',
    description: 'Set your monthly subscription price',
    icon: DollarSign,
    component: PricingStep,
  },
  {
    id: 'ai-persona',
    title: 'AI Chat Personality',
    description: 'Customize your AI chat experience',
    icon: Bot,
    component: AIPersonaStep,
  },
  {
    id: 'payout',
    title: 'Payout Setup',
    description: 'Connect your Stripe account for payments',
    icon: CreditCard,
    component: PayoutStep,
  },
  {
    id: 'review',
    title: 'Review & Launch',
    description: 'Review terms and launch your profile',
    icon: FileText,
    component: ReviewStep,
  },
]

interface OnboardingData {
  account: {
    ageConfirmed: boolean
    termsAccepted: boolean
  }
  kyc: {
    status: 'pending' | 'verified' | 'failed'
    sessionId?: string
  }
  profile: {
    displayName: string
    bio: string
    avatarUrl?: string
    coverUrl?: string
    socialLinks: {
      instagram?: string
      twitter?: string
      youtube?: string
      tiktok?: string
    }
  }
  pricing: {
    monthlyPrice: number
  }
  aiPersona: {
    tone: string
    personality: string
    topics: string[]
    nsfwEnabled: boolean
    systemPrompt?: string
  }
  payout: {
    stripeConnected: boolean
    accountId?: string
  }
  review: {
    tosAccepted: boolean
    guidelinesAccepted: boolean
  }
}

export default function CreatorOnboarding() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    account: { ageConfirmed: false, termsAccepted: false },
    kyc: { status: 'pending' },
    profile: { 
      displayName: session?.user?.name || '',
      bio: '',
      socialLinks: {}
    },
    pricing: { monthlyPrice: 9.99 },
    aiPersona: {
      tone: 'conversational',
      personality: 'friendly and engaging',
      topics: [],
      nsfwEnabled: false,
    },
    payout: { stripeConnected: false },
    review: { tosAccepted: false, guidelinesAccepted: false },
  })
  const [isLoading, setIsLoading] = useState(false)

  // Auto-save progress
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('creator-onboarding')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          setOnboardingData(data.onboardingData || onboardingData)
          setCurrentStep(data.currentStep || 0)
          setCompletedSteps(new Set(data.completedSteps || []))
        } catch (error) {
          console.error('Failed to load saved progress:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('creator-onboarding', JSON.stringify({
        onboardingData,
        currentStep,
        completedSteps: Array.from(completedSteps),
      }))
    }
  }, [onboardingData, currentStep, completedSteps])

  const handleStepComplete = (stepData: any) => {
    const stepKey = STEPS[currentStep].id as keyof OnboardingData
    setOnboardingData(prev => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], ...stepData }
    }))
    setCompletedSteps(prev => new Set([...prev, currentStep]))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = async () => {
    setIsLoading(true)
    try {
      // Save final creator profile
      const response = await fetch('/api/creators/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      })

      if (response.ok) {
        localStorage.removeItem('creator-onboarding')
        router.push('/creator/dashboard?onboarding=complete')
      } else {
        throw new Error('Failed to complete onboarding')
      }
    } catch (error) {
      console.error('Onboarding completion error:', error)
      alert('Failed to complete onboarding. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const progress = ((completedSteps.size + (currentStep > completedSteps.size ? 0.5 : 0)) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MotionDiv 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Header */}
          <MotionDiv variants={staggerItem}>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Onboarding</h1>
              <p className="text-gray-600">Complete your setup to start earning on CreatorChat Hub</p>
            </div>
          </MotionDiv>

          {/* Progress */}
          <MotionDiv variants={staggerItem}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    Step {currentStep + 1} of {STEPS.length}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-2 mb-6" />
                
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                  {STEPS.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = completedSteps.has(index)
                    const isCurrent = index === currentStep
                    
                    return (
                      <div 
                        key={step.id}
                        className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                          isCurrent ? 'bg-purple-100' : isCompleted ? 'bg-green-50' : 'bg-gray-50'
                        }`}
                      >
                        <div className={`p-2 rounded-full mb-2 ${
                          isCurrent ? 'bg-purple-200' : isCompleted ? 'bg-green-200' : 'bg-gray-200'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            isCurrent ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                          }`} />
                        </div>
                        <span className="text-xs text-center font-medium text-gray-600">
                          {step.title.split(' ')[0]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </MotionDiv>

          {/* Current Step */}
          <MotionDiv 
            key={currentStep}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {React.createElement(STEPS[currentStep].icon, { className: "h-6 w-6 text-purple-600" })}
                  <span>{STEPS[currentStep].title}</span>
                </CardTitle>
                <CardDescription>
                  {STEPS[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 0 && (
                  <AccountStep
                    data={onboardingData.account}
                    onComplete={handleStepComplete}
                    onNext={handleNext}
                  />
                )}
                {currentStep === 1 && (
                  <KYCStep
                    data={onboardingData.kyc}
                    onComplete={handleStepComplete}
                    onNext={handleNext}
                  />
                )}
                {currentStep === 2 && (
                  <ProfileStep
                    data={onboardingData.profile}
                    onComplete={handleStepComplete}
                    onNext={handleNext}
                  />
                )}
                {currentStep === 3 && (
                  <PricingStep
                    data={onboardingData.pricing}
                    onComplete={handleStepComplete}
                    onNext={handleNext}
                  />
                )}
                {currentStep === 4 && (
                  <AIPersonaStep
                    data={onboardingData.aiPersona}
                    onComplete={handleStepComplete}
                    onNext={handleNext}
                  />
                )}
                {currentStep === 5 && (
                  <PayoutStep
                    data={onboardingData.payout}
                    onComplete={handleStepComplete}
                    onNext={handleNext}
                  />
                )}
                {currentStep === 6 && (
                  <ReviewStep
                    data={onboardingData.review}
                    onComplete={handleStepComplete}
                    onNext={handleNext}
                  />
                )}
              </CardContent>
            </Card>
          </MotionDiv>

          {/* Navigation */}
          <MotionDiv variants={staggerItem}>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {currentStep + 1} / {STEPS.length}
                </span>
              </div>

              <Button
                onClick={handleNext}
                disabled={!completedSteps.has(currentStep) || isLoading}
                className="flex items-center space-x-2"
              >
                <span>{currentStep === STEPS.length - 1 ? 'Launch Profile' : 'Next'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </MotionDiv>
        </MotionDiv>
      </div>
    </div>
  )
}