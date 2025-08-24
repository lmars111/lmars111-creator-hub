import LegalPageLayout from '../components/LegalPageLayout'

export default function Refunds() {
  return (
    <LegalPageLayout title="Refund Policy">
      <div>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <h2>1. General Refund Policy</h2>
        <p>
          At Creator Hub, we strive to provide excellent service to all our users. This refund policy outlines 
          the circumstances under which refunds may be requested and processed.
        </p>

        <h2>2. Content Purchases</h2>
        <h3>Digital Content</h3>
        <p>
          Due to the instant and digital nature of content on our platform:
        </p>
        <ul>
          <li>All content purchases are generally final</li>
          <li>Refunds may be considered in cases of technical issues preventing access</li>
          <li>Refund requests must be submitted within 48 hours of purchase</li>
          <li>Content that has been accessed or downloaded is not eligible for refund</li>
        </ul>

        <h3>Subscription Services</h3>
        <p>
          For subscription-based access to creator content:
        </p>
        <ul>
          <li>Monthly subscriptions: No refunds for partial months</li>
          <li>Annual subscriptions: Prorated refunds may be available within 7 days</li>
          <li>Cancellation takes effect at the end of the current billing period</li>
        </ul>

        <h2>3. Platform Services</h2>
        <h3>Creator Tools and Features</h3>
        <p>
          Refunds for platform service fees may be considered in the following cases:
        </p>
        <ul>
          <li>Technical issues preventing service usage for more than 48 hours</li>
          <li>Billing errors or duplicate charges</li>
          <li>Service cancellation within 7 days of initial purchase</li>
        </ul>

        <h2>4. Exceptional Circumstances</h2>
        <p>
          We may provide refunds at our discretion in cases of:
        </p>
        <ul>
          <li>Fraudulent activity on your account</li>
          <li>Unauthorized charges</li>
          <li>Technical failures on our part</li>
          <li>Content that violates our terms of service</li>
          <li>Creator account suspension or termination</li>
        </ul>

        <h2>5. How to Request a Refund</h2>
        <p>
          To request a refund:
        </p>
        <ol>
          <li>Contact our support team at support@creatorhub.com</li>
          <li>Include your order/transaction ID</li>
          <li>Provide a detailed explanation of your refund request</li>
          <li>Include any relevant screenshots or documentation</li>
        </ol>

        <h2>6. Refund Processing</h2>
        <h3>Timeline</h3>
        <ul>
          <li>Refund requests are reviewed within 2-3 business days</li>
          <li>Approved refunds are processed within 5-7 business days</li>
          <li>Refunds are issued to the original payment method</li>
        </ul>

        <h3>Processing Fees</h3>
        <p>
          Payment processing fees are non-refundable except in cases of:
        </p>
        <ul>
          <li>Billing errors by Creator Hub</li>
          <li>Technical failures on our platform</li>
          <li>Fraudulent charges</li>
        </ul>

        <h2>7. Chargebacks</h2>
        <p>
          Before initiating a chargeback with your bank or credit card company:
        </p>
        <ul>
          <li>Please contact our support team first</li>
          <li>We prefer to resolve issues directly when possible</li>
          <li>Chargebacks may result in account suspension pending investigation</li>
        </ul>

        <h2>8. Creator Earnings</h2>
        <p>
          When refunds are issued for creator content:
        </p>
        <ul>
          <li>Creator earnings may be adjusted accordingly</li>
          <li>Creators are notified of refund requests affecting their content</li>
          <li>Excessive refund rates may trigger account review</li>
        </ul>

        <h2>9. Promotional Credits</h2>
        <p>
          Purchases made with promotional credits or discounts:
        </p>
        <ul>
          <li>Refunds are issued as platform credits when applicable</li>
          <li>Promotional values are not refundable in cash</li>
          <li>Credits expire according to original terms</li>
        </ul>

        <h2>10. International Considerations</h2>
        <p>
          For international users:
        </p>
        <ul>
          <li>Currency conversion fees are non-refundable</li>
          <li>Local regulations may provide additional refund rights</li>
          <li>Processing times may vary by country and payment method</li>
        </ul>

        <h2>11. Policy Updates</h2>
        <p>
          This refund policy may be updated periodically. Changes take effect immediately upon posting. 
          Continued use of our platform constitutes acceptance of any policy changes.
        </p>

        <h2>12. Contact Information</h2>
        <p>
          For refund requests or questions about this policy:
        </p>
        <ul>
          <li>Email: support@creatorhub.com</li>
          <li>Subject line: &quot;Refund Request - [Order ID]&quot;</li>
          <li>Response time: 1-2 business days</li>
        </ul>

        <p>
          <strong>Note:</strong> This policy does not limit any statutory rights you may have as a consumer 
          under applicable law.
        </p>
      </div>
    </LegalPageLayout>
  )
}