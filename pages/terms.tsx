import Head from 'next/head'
import Link from 'next/link'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - CreatorChat Hub</title>
        <meta name="description" content="Terms of Service for CreatorChat Hub" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
              ← Back to CreatorChat Hub
            </Link>
          </div>

          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using CreatorChat Hub (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily use the Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Creator Content</h2>
              <p className="text-gray-700 mb-4">
                Creators retain ownership of their content. By using our platform, creators grant us a license to display and distribute their content through our services.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                All payments are processed securely through Stripe. Platform fees and revenue splits are clearly disclosed before any transaction.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">
                You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at legal@creatorchathub.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}