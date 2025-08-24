import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function ApplySuccess() {
  const [calLink, setCalLink] = useState<string>('')

  useEffect(() => {
    // Get Cal.com link from environment variable
    const envCalLink = process.env.NEXT_PUBLIC_CAL_LINK
    if (envCalLink) {
      setCalLink(envCalLink)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Application Submitted - CreatorChat Hub</title>
        <meta name="description" content="Your creator application has been submitted successfully" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Application Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-4">
              Thank you for your interest in joining our creator hub. We&apos;ve received your application and will review it shortly.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-600 text-sm font-medium">
                    1
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">
                    <strong>Review Process:</strong> Our team will review your application within 2-3 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-600 text-sm font-medium">
                    2
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">
                    <strong>Schedule a Call:</strong> Use the calendar below to book a brief introduction call with our team.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-600 text-sm font-medium">
                    3
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">
                    <strong>Decision:</strong> We&apos;ll send you an email with our decision and next steps.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cal.com Integration */}
          {calLink ? (
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Schedule Your Introduction Call
              </h2>
              <p className="text-gray-600 mb-6">
                Book a 15-minute call with our team to discuss your creator journey and answer any questions you might have.
              </p>
              
              {/* Cal.com embed */}
              <div className="w-full">
                <iframe
                  src={calLink}
                  width="100%"
                  height="700"
                  frameBorder="0"
                  title="Schedule a call"
                  className="rounded border"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Schedule Your Introduction Call
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Calendar Not Available
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        The scheduling calendar is not configured. Please set the <code>NEXT_PUBLIC_CAL_LINK</code> environment variable with your Cal.com booking link.
                      </p>
                      <p className="mt-2">
                        Our team will reach out to you via email to schedule a call.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}