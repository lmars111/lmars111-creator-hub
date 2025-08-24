import Head from 'next/head'
import Link from 'next/link'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - CreatorChat Hub</title>
        <meta name="description" content="Privacy Policy for CreatorChat Hub" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
              ← Back to CreatorChat Hub
            </Link>
          </div>

          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Analytics</h2>
              <p className="text-gray-700 mb-4">
                We use PostHog for analytics to understand how our service is used and to improve user experience. This data is anonymized and aggregated.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us at privacy@creatorchathub.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}