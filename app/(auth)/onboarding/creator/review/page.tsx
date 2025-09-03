'use client'

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Final Review & Launch</h1>
            <p className="text-gray-600">Step 7 of 7 - Creator Onboarding</p>
          </div>

          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-yellow-900 mb-4">
                Review & Launch Coming Soon
              </h2>
              <p className="text-yellow-800 mb-6">
                This is where you'll review all your settings and launch your creator profile to start earning.
              </p>
              <a
                href="/creator/dashboard"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}