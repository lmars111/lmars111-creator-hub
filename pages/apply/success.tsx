import Head from 'next/head'
import Link from 'next/link'
import { CheckCircle, Calendar, Mail } from 'lucide-react'

export default function ApplySuccess() {
  return (
    <>
      <Head>
        <title>Application Submitted - CreatorChat Hub</title>
        <meta name="description" content="Your creator application has been submitted successfully" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Application Submitted!
            </h1>
            <p className="mt-2 text-gray-600">
              Thank you for your interest in joining CreatorChat Hub.
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-6 shadow rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-purple-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Email Confirmation</p>
                  <p className="text-sm text-gray-600">You&apos;ll receive a confirmation email within the next few minutes.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-purple-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Review Process</p>
                  <p className="text-sm text-gray-600">Our team will review your application within 3-5 business days.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Next Steps</p>
                  <p className="text-sm text-gray-600">If approved, you&apos;ll receive an invitation to schedule an onboarding call.</p>
                </div>
              </div>
            </div>

            {/* Cal.com Integration Placeholder */}
            <div className="mt-8 p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">Schedule Introduction Call</h3>
              <p className="text-sm text-purple-700 mb-4">
                If you&apos;d like to get started right away, you can schedule an introduction call with our team.
              </p>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                Schedule Call (Cal.com Integration)
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Return to CreatorChat Hub
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}