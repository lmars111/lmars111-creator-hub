# Observability Integration

This document covers the Sentry observability integration in the Creator Hub platform for error monitoring and reporting.

## Overview

The observability system provides comprehensive error tracking and monitoring using Sentry. It's designed to fail gracefully when Sentry is not configured and includes both automatic and manual error reporting capabilities.

## Environment Variables

### Required
- `SENTRY_DSN`: Your Sentry project DSN (Data Source Name)

### Optional Configuration
- `NODE_ENV`: Environment setting (development/production)
- Additional Sentry configuration can be added to the initialization

## Setup

### Installation

The Sentry integration is implemented as a lightweight wrapper that falls back gracefully:

```typescript
import { sentry, withSentryApiHandler, reportError } from '@/lib/sentry'
```

### Initialization

Sentry is automatically initialized when the module is imported:

```typescript
// Automatic initialization on app start
// No manual setup required
```

## Usage

### API Route Protection

Wrap API handlers to automatically capture errors:

```typescript
import { withSentryApiHandler } from '@/lib/sentry'

async function handler(req, res) {
  // Your API logic here
  // Errors are automatically captured
}

export default withSentryApiHandler(handler)
```

### Manual Error Reporting

Report errors manually with additional context:

```typescript
import { reportError } from '@/lib/sentry'

try {
  // Risky operation
} catch (error) {
  reportError(error, {
    operation: 'user-action',
    userId: 'user-123',
    additionalContext: 'Any relevant data'
  })
}
```

### Component Error Boundary

For React component errors:

```typescript
import { captureComponentError } from '@/lib/sentry'

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    captureComponentError(error, errorInfo)
  }
}
```

## Error Capture Points

### API Routes

The following API endpoints automatically capture errors:

1. **Creator View** (`/api/creator/view`)
   - Tracks creator profile viewing errors
   - Includes request context and user data

2. **Chat Start** (`/api/chat/start`)
   - Captures chat initiation failures
   - Includes creator and user context

3. **Content Unlock** (`/api/content/unlock`)
   - Monitors content unlocking errors
   - Tracks payment and access failures

4. **Stripe Webhooks** (`/api/webhooks/stripe`)
   - Captures webhook processing errors
   - Includes webhook data and signature validation

### Error Context

Each error capture includes:
- **Request Information**: URL, method, headers, query parameters
- **User Context**: User ID, session data (when available)
- **Custom Tags**: Component type, operation name
- **Additional Context**: Operation-specific data

## Status Endpoint

The `/api/status` endpoint remains operational regardless of Sentry configuration:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "0.1.0",
  "environment": "development",
  "uptime": 123.45
}
```

This endpoint:
- Always returns 200 OK
- Does not depend on Sentry
- Provides basic health information
- Can be used for load balancer health checks

## Error Handling Strategy

### Graceful Degradation

When `SENTRY_DSN` is not configured:
- Errors are logged to console
- Application continues normal operation
- No runtime errors or crashes
- Warning messages indicate Sentry is disabled

### Development vs Production

**Development:**
- Detailed error logging to console
- Debug mode enabled
- Immediate error visibility

**Production:**
- Errors sent to Sentry (if configured)
- Minimal console logging
- Error aggregation and alerting

## Monitoring and Alerting

### Error Types Tracked

1. **API Errors**
   - Request processing failures
   - Database connection issues
   - Third-party service failures

2. **Payment Errors**
   - Stripe webhook failures
   - Payment processing issues
   - Subscription management errors

3. **Authentication Errors**
   - Login failures
   - Token validation issues
   - Permission errors

4. **Content Errors**
   - File upload failures
   - Content processing issues
   - Access control violations

### Performance Monitoring

The integration can be extended to track:
- API response times
- Database query performance
- Third-party service latency
- User interaction patterns

## Best Practices

### Error Context

Always provide meaningful context:

```typescript
reportError(error, {
  operation: 'specific-operation-name',
  userId: currentUser?.id,
  resourceId: 'resource-being-accessed',
  additionalData: relevantContext
})
```

### Sensitive Information

Avoid capturing sensitive data:
- Credit card numbers
- Passwords or tokens
- Personal identifiable information
- Internal system secrets

### Error Boundaries

Implement error boundaries for critical components:

```typescript
// Wrap critical sections with error handling
try {
  await criticalOperation()
} catch (error) {
  reportError(error, { component: 'critical-section' })
  // Provide fallback behavior
}
```

## Configuration

### Sentry Project Setup

1. Create a Sentry project
2. Obtain the DSN from project settings
3. Set `SENTRY_DSN` environment variable
4. Configure alert rules and notifications

### Environment Variables

```bash
# Required
SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Optional
NODE_ENV=production
```

## Troubleshooting

### Common Issues

1. **Errors not appearing in Sentry**
   - Verify `SENTRY_DSN` is set correctly
   - Check network connectivity to Sentry
   - Review console for initialization errors

2. **Too many error notifications**
   - Configure Sentry alert rules
   - Implement error rate limiting
   - Filter out non-critical errors

3. **Performance impact**
   - Error capturing is asynchronous
   - Minimal performance overhead
   - Can be disabled in development if needed

### Debug Mode

Enable debug logging:

```bash
NODE_ENV=development npm run dev
```

This will:
- Log all Sentry operations to console
- Show error capture details
- Display initialization status

## Integration Points

### Analytics Correlation

Errors can be correlated with analytics events:
- User journey tracking
- Feature usage patterns
- Error impact on conversions

### Performance Monitoring

Future enhancements may include:
- Custom performance metrics
- Database query monitoring
- API endpoint performance
- User experience tracking

## Security Considerations

### Data Privacy

- No PII is captured by default
- Sensitive headers are filtered
- User consent may be required in some jurisdictions

### Access Control

- Sentry project access should be restricted
- Monitor who has access to error data
- Regular access reviews

## Maintenance

### Regular Tasks

1. **Weekly**: Review error trends and patterns
2. **Monthly**: Update alert rules and thresholds
3. **Quarterly**: Review captured data for sensitive information
4. **Annually**: Audit Sentry project access and permissions

### Updates

- Monitor Sentry SDK updates
- Test error capture after deployments
- Verify error context accuracy

## Support

For issues with observability:
- Technical: engineering@creatorhub.com
- Operations: ops@creatorhub.com
- Security: security@creatorhub.com