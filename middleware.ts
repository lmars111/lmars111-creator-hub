import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Admin routes
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    // Creator routes
    if (pathname.startsWith('/creator')) {
      if (!token || token.role !== 'CREATOR') {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    // Fan routes
    if (pathname.startsWith('/fan')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    // Onboarding routes
    if (pathname.startsWith('/onboarding')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Public routes that don't require authentication
        const publicRoutes = ['/', '/c/', '/api/webhooks/', '/terms', '/privacy', '/refunds', '/content-policy']
        
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }

        // All other routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    // Disable middleware for demo
    '/disabled-for-demo',
  ],
}