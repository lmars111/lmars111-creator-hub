import Head from 'next/head'
import Link from 'next/link'

export default function RefundPolicy() {
  return (
    <>
      <Head>
        <title>Refund Policy - CreatorChat Hub</title>
        <meta name="description" content="Refund Policy for CreatorChat Hub" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
              ← Back to CreatorChat Hub
            </Link>
          </div>

          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. General Refund Policy</h2>
              <p className="text-gray-700 mb-4">
                Due to the digital nature of our content and services, all sales are generally final. 
                However, we understand that exceptional circumstances may warrant a refund.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Eligible Refund Cases</h2>
              <p className="text-gray-700 mb-4">
                Refunds may be considered in the following situations:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Technical issues preventing access to purchased content</li>
                <li>Duplicate charges or billing errors</li>
                <li>Content not delivered as described</li>
                <li>Unauthorized transactions (reported within 48 hours)</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Refund Request Process</h2>
              <p className="text-gray-700 mb-4">
                To request a refund, please contact our support team at support@creatorchathub.com within 
                7 days of your purchase. Include your transaction ID and a detailed explanation of the issue.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Processing Time</h2>
              <p className="text-gray-700 mb-4">
                Approved refunds will be processed within 5-10 business days and credited back to 
                your original payment method.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Creator Earnings</h2>
              <p className="text-gray-700 mb-4">
                When a refund is issued, the corresponding amount will be deducted from the creator&apos;s earnings 
                and any applicable referral commissions will be reversed.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Chargebacks</h2>
              <p className="text-gray-700 mb-4">
                Initiating a chargeback without first contacting our support team may result in 
                account suspension. We encourage users to work with us directly to resolve any issues.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For refund requests or questions about this policy, contact us at support@creatorchathub.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}