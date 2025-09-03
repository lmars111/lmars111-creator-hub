'use client'

export default function PricingSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing & Tiers</h1>
            <p className="text-gray-600">Step 4 of 7 - Creator Onboarding</p>
          </div>

          <div className="text-center py-12">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                Pricing Setup Coming Soon
              </h2>
              <p className="text-green-800 mb-6">
                This is where you'll configure your subscription tiers, pricing, and monetization options.
              </p>
              <a
                href="/onboarding/creator/ai-training"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Continue to AI Training
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}