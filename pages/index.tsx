import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Creator Hub</title>
        <meta name="description" content="Join our creator community" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Creator Hub
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Join our community of creators and grow your audience
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Ready to get started?
                </h2>
                <p className="text-gray-600 mb-6">
                  Apply to join our creator hub and start your journey with us.
                </p>
                
                <Link
                  href="/apply"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Apply Now
                </Link>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    What you&apos;ll get:
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Access to creator resources and tools</li>
                    <li>• Community support and networking</li>
                    <li>• Growth strategies and best practices</li>
                    <li>• One-on-one guidance from our team</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}