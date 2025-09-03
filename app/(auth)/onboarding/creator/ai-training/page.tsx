'use client'

export default function AITrainingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Persona Training</h1>
            <p className="text-gray-600">Step 5 of 7 - Creator Onboarding</p>
          </div>

          <div className="text-center py-12">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-purple-900 mb-4">
                AI Training Coming Soon
              </h2>
              <p className="text-purple-800 mb-6">
                This is where you'll train your AI persona to chat with fans in your unique style and voice.
              </p>
              <a
                href="/onboarding/creator/assistant"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Continue to Assistant Options
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}