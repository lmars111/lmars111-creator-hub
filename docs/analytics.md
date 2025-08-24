# Analytics Integration

This document covers the PostHog analytics integration in the Creator Hub platform.

## Overview

The analytics system provides comprehensive tracking of user interactions and business events using PostHog. It's designed to fail gracefully when PostHog is not configured or available.

## Environment Variables

### Required
- `NEXT_PUBLIC_POSTHOG_KEY`: Your PostHog project API key

### Optional
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog host URL (defaults to `https://app.posthog.com`)

## Usage

### Basic Setup

```typescript
import { analytics } from '@/lib/analytics'

// The analytics instance is automatically initialized
// No additional setup required
```

### Event Tracking

The following events are automatically tracked throughout the application:

#### ViewCreator
Fired when a user views a creator's profile or content.

```typescript
analytics.viewCreator({
  creatorId: 'creator-123',
  creatorName: 'John Doe' // optional
})
```

#### StartChat
Fired when a user starts a chat with a creator.

```typescript
analytics.startChat({
  creatorId: 'creator-123',
  userId: 'user-456' // optional
})
```

#### UnlockAttempt
Fired when a user attempts to unlock premium content.

```typescript
analytics.unlockAttempt({
  contentId: 'content-789',
  userId: 'user-456', // optional
  method: 'payment' // or 'subscription', 'free-trial', etc.
})
```

#### UnlockSuccess
Fired when content is successfully unlocked.

```typescript
analytics.unlockSuccess({
  contentId: 'content-789',
  userId: 'user-456', // optional
  method: 'payment'
})
```

#### StripeWebhookOK
Fired when Stripe webhooks are processed successfully.

```typescript
analytics.stripeWebhookSuccess({
  webhookType: 'payment_intent.succeeded',
  eventId: 'evt_123',
  customerId: 'cus_456'
})
```

#### StripeWebhookFail
Fired when Stripe webhook processing fails.

```typescript
analytics.stripeWebhookFail({
  webhookType: 'payment_intent.succeeded',
  eventId: 'evt_123',
  error: 'Invalid signature'
})
```

### User Identification

```typescript
// Identify a user (usually after login)
analytics.identify('user-123', {
  email: 'user@example.com',
  plan: 'premium'
})

// Reset identification (usually after logout)
analytics.reset()
```

### Manual Page Tracking

```typescript
// Track page views manually if needed
analytics.pageView()
```

## Integration Points

### API Routes
Events are automatically fired in the following locations:

- **ViewCreator**: Creator profile pages, content viewing endpoints
- **StartChat**: Chat initialization endpoints
- **UnlockAttempt/UnlockSuccess**: Content unlock endpoints
- **StripeWebhookOK/StripeWebhookFail**: Stripe webhook handlers

### Pages
- Page views are tracked automatically
- User interactions trigger appropriate events

## Error Handling

The analytics system is designed to fail gracefully:

1. **Missing PostHog Key**: Logs a warning and disables tracking
2. **Network Issues**: Logs warnings but doesn't throw errors
3. **Invalid Data**: Sanitizes and continues tracking

## Development

### Local Development
- Set `NODE_ENV=development` to enable debug mode
- PostHog events will be logged to the console

### Testing
- Analytics calls are no-ops when PostHog key is not configured
- Use environment variables to control tracking in different environments

## Data Privacy

- No personally identifiable information (PII) is tracked by default
- User identification is opt-in and controlled by the application
- All tracking complies with PostHog's privacy policies

## Monitoring

Monitor analytics health through:
- PostHog dashboard event volume
- Application logs for warning messages
- Performance impact on page load times

## Troubleshooting

### Common Issues

1. **Events not appearing in PostHog**
   - Check `NEXT_PUBLIC_POSTHOG_KEY` is set correctly
   - Verify PostHog host configuration
   - Check browser console for error messages

2. **High error rates**
   - Review network connectivity
   - Check PostHog service status
   - Verify event data format

3. **Performance issues**
   - Analytics calls are asynchronous and shouldn't block UI
   - Consider reducing event frequency if needed
   - Monitor bundle size impact

### Debug Mode

Enable debug logging by setting `NODE_ENV=development`:

```bash
NODE_ENV=development npm run dev
```

This will log all PostHog interactions to the browser console.