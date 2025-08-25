import Head from 'next/head'
import Link from 'next/link'

export default function ContentPolicy() {
  return (
    <>
      <Head>
        <title>Content Policy - CreatorChat Hub</title>
        <meta name="description" content="Content Guidelines and Policy for CreatorChat Hub" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
              ← Back to CreatorChat Hub
            </Link>
          </div>

          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Content Policy</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptable Content</h2>
              <p className="text-gray-700 mb-4">
                CreatorChat Hub welcomes diverse content from creators. We support creative expression 
                while maintaining a safe environment for all users.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Prohibited Content</h2>
              <p className="text-gray-700 mb-4">
                The following types of content are strictly prohibited on our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Content involving minors (under 18) in any adult context</li>
                <li>Non-consensual intimate content</li>
                <li>Content promoting violence, harassment, or hate speech</li>
                <li>Copyrighted material without proper authorization</li>
                <li>Content that violates any local, state, or federal laws</li>
                <li>Spam, scams, or fraudulent content</li>
                <li>Content that promotes illegal activities</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Content Verification</h2>
              <p className="text-gray-700 mb-4">
                All creators must verify their identity and confirm they are 18 years or older. 
                We may request additional verification for certain types of content.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Content Moderation</h2>
              <p className="text-gray-700 mb-4">
                We employ both automated systems and human reviewers to moderate content. 
                Content that violates our policies may be removed without prior notice.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                Creators retain ownership of their original content. By uploading content, 
                you grant us a license to display and distribute it through our platform.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Reporting Violations</h2>
              <p className="text-gray-700 mb-4">
                Users can report content that violates our policies. We investigate all reports 
                and take appropriate action, which may include content removal or account suspension.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Consequences of Violations</h2>
              <p className="text-gray-700 mb-4">
                Violations of this policy may result in:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Content removal</li>
                <li>Account warnings</li>
                <li>Temporary or permanent account suspension</li>
                <li>Forfeiture of earnings</li>
                <li>Legal action where applicable</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Appeals Process</h2>
              <p className="text-gray-700 mb-4">
                If you believe your content was removed in error, you may appeal the decision 
                by contacting support@creatorchathub.com with details about your case.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                Questions about this Content Policy can be directed to content@creatorchathub.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}