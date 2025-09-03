'use client'

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Setup</h1>
            <p className="text-gray-600">Step 3 of 7 - Creator Onboarding</p>
          </div>

          <div className="text-center py-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Profile Setup Coming Soon
              </h2>
              <p className="text-blue-800 mb-6">
                This is where you'll set up your creator profile, including bio, avatar, and social links.
              </p>
              <a
                href="/onboarding/creator/pricing"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Continue to Pricing Setup
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}