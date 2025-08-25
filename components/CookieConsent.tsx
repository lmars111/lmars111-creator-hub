'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Cookie, Shield, BarChart } from 'lucide-react'
import Cookies from 'js-cookie'

const COOKIE_CONSENT_KEY = 'creatorhub_cookie_consent'
const COOKIE_PREFERENCES_KEY = 'creatorhub_cookie_preferences'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already given consent
    const consent = Cookies.get(COOKIE_CONSENT_KEY)
    const savedPreferences = Cookies.get(COOKIE_PREFERENCES_KEY)

    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences))
      } catch (error) {
        console.warn('Failed to parse cookie preferences:', error)
      }
    }
  }, [])

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true
    }
    
    saveConsent(allAccepted)
    setPreferences(allAccepted)
    setShowBanner(false)
    setShowPreferences(false)
  }

  const acceptSelected = () => {
    saveConsent(preferences)
    setShowBanner(false)
    setShowPreferences(false)
  }

  const rejectNonEssential = () => {
    const minimal: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false
    }
    
    saveConsent(minimal)
    setPreferences(minimal)
    setShowBanner(false)
    setShowPreferences(false)
  }

  const saveConsent = (prefs: CookiePreferences) => {
    // Set consent cookie for 1 year
    Cookies.set(COOKIE_CONSENT_KEY, 'true', { expires: 365 })
    Cookies.set(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs), { expires: 365 })
    
    // Initialize analytics based on preferences
    if (prefs.analytics && typeof window !== 'undefined') {
      // Enable analytics tracking
      console.log('Analytics enabled')
    } else {
      // Disable analytics
      console.log('Analytics disabled')
    }
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return // Can't disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4 z-50">
      <Card className="w-full max-w-2xl mb-4">
        <CardContent className="p-6">
          {!showPreferences ? (
            // Main consent banner
            <div>
              <div className="flex items-start gap-3 mb-4">
                <Cookie className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">We use cookies</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    We use cookies to enhance your experience, analyze site traffic, and provide 
                    personalized content. You can choose which cookies to accept below.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBanner(false)}
                  className="ml-auto p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={acceptAll}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Accept All
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreferences(true)}
                >
                  Customize
                </Button>
                <Button
                  variant="outline"
                  onClick={rejectNonEssential}
                >
                  Reject Non-Essential
                </Button>
              </div>
            </div>
          ) : (
            // Preferences view
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Cookie Preferences</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Necessary Cookies</h4>
                      <p className="text-sm text-gray-600">
                        Required for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    Always On
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <BarChart className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Analytics Cookies</h4>
                      <p className="text-sm text-gray-600">
                        Help us understand how visitors interact with our website.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => updatePreference('analytics', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Cookie className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Marketing Cookies</h4>
                      <p className="text-sm text-gray-600">
                        Used to personalize ads and measure their effectiveness.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => updatePreference('marketing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={acceptSelected}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Save Preferences
                </Button>
                <Button
                  variant="outline"
                  onClick={acceptAll}
                >
                  Accept All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}