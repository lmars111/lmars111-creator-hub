'use client'

import { useEffect } from 'react'
import { analytics } from '@/lib/analytics'
import { sentry } from '@/lib/sentry'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize analytics and error tracking
    // They will gracefully handle missing configuration
  }, [])

  return <>{children}</>
}