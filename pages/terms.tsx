import LegalPageLayout from '../components/LegalPageLayout'

export default function Terms() {
  return (
    <LegalPageLayout title="Terms of Service">
      <div>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Creator Hub, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of Creator Hub materials for personal, 
          non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>modify or copy the materials</li>
          <li>use the materials for any commercial purpose or for any public display</li>
          <li>attempt to reverse engineer any software contained on Creator Hub</li>
          <li>remove any copyright or other proprietary notations from the materials</li>
        </ul>

        <h2>3. User Accounts</h2>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
          You are responsible for safeguarding the password and for all activities that occur under your account.
        </p>

        <h2>4. Content</h2>
        <p>
          You retain ownership of content you post on Creator Hub. By posting content, you grant us a worldwide, 
          non-exclusive, royalty-free license to use, display, and distribute your content on our platform.
        </p>

        <h2>5. Privacy Policy</h2>
        <p>
          Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.
        </p>

        <h2>6. Prohibited Uses</h2>
        <p>You may not use our service:</p>
        <ul>
          <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
          <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
          <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
          <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
          <li>To submit false or misleading information</li>
        </ul>

        <h2>7. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
          including without limitation if you breach the Terms.
        </p>

        <h2>8. Disclaimer</h2>
        <p>
          The information on this service is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, 
          this Company excludes all representations, warranties, conditions and terms.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          In no event shall Creator Hub, nor its directors, employees, partners, agents, suppliers, or affiliates, 
          be liable for any indirect, incidental, special, consequential, or punitive damages.
        </p>

        <h2>10. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
          If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
        </p>

        <h2>11. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at legal@creatorhub.com.
        </p>
      </div>
    </LegalPageLayout>
  )
}