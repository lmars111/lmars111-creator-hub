import LegalPageLayout from '../components/LegalPageLayout'

export default function Privacy() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <div>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <h3>Personal Information</h3>
        <p>
          When you create an account, we may collect personal information such as:
        </p>
        <ul>
          <li>Name and email address</li>
          <li>Profile information and preferences</li>
          <li>Payment information (processed securely through Stripe)</li>
          <li>Communication records with creators</li>
        </ul>

        <h3>Usage Information</h3>
        <p>
          We automatically collect information about how you use our service:
        </p>
        <ul>
          <li>Pages visited and features used</li>
          <li>Time spent on different sections</li>
          <li>Device and browser information</li>
          <li>IP address and location data</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and maintain our service</li>
          <li>Process payments and transactions</li>
          <li>Communicate with you about your account</li>
          <li>Improve our platform and user experience</li>
          <li>Ensure platform security and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. We may share information:</p>
        <ul>
          <li>With creators when you interact with their content</li>
          <li>With service providers who help us operate our platform</li>
          <li>When required by law or to protect our rights</li>
          <li>In connection with a business transfer or acquisition</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against unauthorized access, 
          alteration, disclosure, or destruction. This includes:
        </p>
        <ul>
          <li>Encryption of sensitive data</li>
          <li>Secure payment processing through Stripe</li>
          <li>Regular security audits and updates</li>
          <li>Access controls and monitoring</li>
        </ul>

        <h2>5. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and data</li>
          <li>Restrict processing of your data</li>
          <li>Data portability</li>
          <li>Object to certain processing</li>
        </ul>

        <h2>6. Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies to enhance your experience:
        </p>
        <ul>
          <li>Essential cookies for platform functionality</li>
          <li>Analytics cookies to understand usage patterns</li>
          <li>Preference cookies to remember your settings</li>
        </ul>
        <p>
          You can control cookie settings through your browser, but disabling cookies may affect platform functionality.
        </p>

        <h2>7. Third-Party Services</h2>
        <p>Our platform integrates with third-party services:</p>
        <ul>
          <li><strong>Stripe:</strong> Payment processing (see Stripe&apos;s privacy policy)</li>
          <li><strong>PostHog:</strong> Analytics and user insights</li>
          <li><strong>Sentry:</strong> Error monitoring and reporting</li>
        </ul>

        <h2>8. Children&apos;s Privacy</h2>
        <p>
          Our service is not intended for children under 13. We do not knowingly collect personal information 
          from children under 13. If you believe we have collected such information, please contact us immediately.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own. 
          We ensure appropriate safeguards are in place for such transfers.
        </p>

        <h2>10. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to provide our services and comply with legal obligations. 
          You can request deletion of your account and associated data at any time.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. We will notify you of significant changes by email or 
          through our platform. Your continued use constitutes acceptance of the updated policy.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or want to exercise your rights, contact us at:
        </p>
        <ul>
          <li>Email: privacy@creatorhub.com</li>
          <li>Address: [Company Address]</li>
        </ul>
      </div>
    </LegalPageLayout>
  )
}