'use client'

export default function AssistantOptionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assistant Options</h1>
            <p className="text-gray-600">Step 6 of 7 - Creator Onboarding</p>
          </div>

          <div className="text-center py-12">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-indigo-900 mb-4">
                Assistant Options Coming Soon
              </h2>
              <p className="text-indigo-800 mb-6">
                This is where you'll configure your AI assistant settings, automation rules, and response preferences.
              </p>
              <a
                href="/onboarding/creator/review"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Continue to Final Review
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}