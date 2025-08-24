# Apply Flow & Cal.com Integration

This document describes the creator application flow and Cal.com integration implemented in the Creator Hub.

## Overview

The Apply Flow allows potential creators to submit applications to join the creator hub. Upon successful submission, applicants are redirected to a success page that includes an embedded Cal.com scheduling widget for booking introduction calls.

## Components

### 1. Application Form (`/pages/apply.tsx`)

The application form collects the following information from creators:

- **Full Name** (required)
- **Email Address** (required)
- **Description** (required) - Tell us about yourself
- **Social Media Links** (optional) - YouTube, Instagram, TikTok, etc.
- **Experience Level** (required) - Beginner, Intermediate, or Advanced

#### Features:
- Form validation for required fields
- Email format validation
- Loading states during submission
- Error handling and display
- Responsive design using Tailwind CSS

### 2. API Route (`/pages/api/apply.ts`)

The API endpoint handles application submissions with the following functionality:

#### Endpoint: `POST /api/apply`

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "description": "string (required)",
  "socialMedia": "string (optional)",
  "experience": "beginner|intermediate|advanced (required)"
}
```

**Response (Success - 201):**
```json
{
  "message": "Application submitted successfully",
  "applicationId": "string",
  "submittedAt": "ISO date string"
}
```

**Response (Error - 400/500):**
```json
{
  "message": "Error description"
}
```

#### Validation:
- Required field validation
- Email format validation
- Experience level validation
- Input sanitization (trimming whitespace)

#### Data Storage:
Currently stores applications in memory for development. In production, this should be replaced with a database integration.

### 3. Success Page (`/pages/apply/success.tsx`)

The success page provides:

- Confirmation of successful application submission
- Next steps explanation
- Embedded Cal.com scheduling widget
- Fallback message when Cal.com is not configured

#### Cal.com Integration:
The page uses the `NEXT_PUBLIC_CAL_LINK` environment variable to embed the scheduling widget. If not configured, it displays a helpful message.

## Environment Variables

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CAL_LINK` | Cal.com booking page URL for embedding | `https://cal.com/your-username/15min` |

### Setting up Cal.com Integration

1. Create a Cal.com account at [cal.com](https://cal.com)
2. Set up your booking page (e.g., 15-minute introduction call)
3. Copy the booking page URL
4. Add to your environment variables:

```bash
# .env.local
NEXT_PUBLIC_CAL_LINK=https://cal.com/your-username/15min
```

## Usage

### For Applicants

1. Navigate to `/apply`
2. Fill out the application form with required information
3. Submit the application
4. Get redirected to `/apply/success`
5. Schedule an introduction call using the embedded calendar

### For Administrators

Applications are currently logged to the console and stored in memory. To access application data in production, implement database storage in the API route.

## Testing

### Smoke Test

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the application form:**
   - Navigate to `http://localhost:3000/apply`
   - Fill out all required fields
   - Submit the form
   - Verify successful submission

3. **Test form validation:**
   - Try submitting with missing required fields
   - Try submitting with invalid email format
   - Verify error messages display correctly

4. **Test success page:**
   - Navigate to `http://localhost:3000/apply/success`
   - Verify the page loads correctly
   - Check if Cal.com widget appears (if environment variable is set)

5. **Test API endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/apply \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "description": "I am a content creator interested in joining.",
       "socialMedia": "https://youtube.com/testchannel",
       "experience": "intermediate"
     }'
   ```

### Unit Testing

For comprehensive testing, consider adding:

- Form validation tests
- API endpoint tests
- Integration tests for the complete flow
- Cal.com embed functionality tests

## Security Considerations

1. **Input Validation:** All user inputs are validated and sanitized
2. **Email Validation:** Proper email format validation prevents malformed data
3. **Rate Limiting:** Consider implementing rate limiting on the API endpoint
4. **HTTPS:** Ensure the application runs over HTTPS in production
5. **Environment Variables:** Keep sensitive configuration in environment variables

## Deployment Notes

1. **Environment Variables:** Ensure `NEXT_PUBLIC_CAL_LINK` is set in production
2. **Database:** Replace in-memory storage with persistent database
3. **Monitoring:** Add application monitoring and logging
4. **Email Notifications:** Consider adding email notifications for new applications

## Troubleshooting

### Common Issues

1. **Cal.com widget not loading:**
   - Check if `NEXT_PUBLIC_CAL_LINK` is properly set
   - Verify the Cal.com URL is accessible
   - Check browser console for iframe errors

2. **Form submission failing:**
   - Check browser network tab for API errors
   - Verify all required fields are filled
   - Check server logs for detailed error messages

3. **Build errors:**
   - Ensure all TypeScript types are properly imported
   - Check for any missing dependencies
   - Verify Next.js configuration

## Future Enhancements

1. **Database Integration:** Replace in-memory storage with PostgreSQL/MySQL
2. **Email Notifications:** Send confirmation emails to applicants
3. **Admin Dashboard:** Create an admin interface to manage applications
4. **Application Status:** Allow applicants to check their application status
5. **Rich Text Editor:** Add a rich text editor for the description field
6. **File Uploads:** Allow applicants to upload portfolios or media samples