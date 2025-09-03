import { z } from 'zod'

// Email validation regex (comprehensive pattern)
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Password validation: min 8 chars, 1 uppercase, 1 number, 1 special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Password must contain at least 1 uppercase letter, 1 number, and 1 special character'
    ),
  confirmPassword: z.string(),
  isAdult: z.boolean().refine(val => val === true, {
    message: 'You must be 18+ to create an account',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z
    .string()
    .min(6, 'Verification code must be 6 digits')
    .max(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
})

export const kycSessionSchema = z.object({
  return_url: z.string().url().optional(),
})

export type SignupData = z.infer<typeof signupSchema>
export type VerifyEmailData = z.infer<typeof verifyEmailSchema>
export type KycSessionData = z.infer<typeof kycSessionSchema>

// Password strength calculation
export function calculatePasswordStrength(password: string): number {
  let score = 0
  
  // Length check
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  
  // Character type checks
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[@$!%*?&]/.test(password)) score += 1
  
  // Additional complexity
  if (password.length >= 16) score += 1
  
  return Math.min(score, 4) // Cap at 4 for UI display
}

export function getPasswordStrengthLabel(strength: number): string {
  switch (strength) {
    case 0:
    case 1:
      return 'Weak'
    case 2:
      return 'Fair'
    case 3:
      return 'Good'
    case 4:
      return 'Strong'
    default:
      return 'Weak'
  }
}

export function getPasswordStrengthColor(strength: number): string {
  switch (strength) {
    case 0:
    case 1:
      return 'bg-red-500'
    case 2:
      return 'bg-yellow-500'
    case 3:
      return 'bg-blue-500'
    case 4:
      return 'bg-green-500'
    default:
      return 'bg-red-500'
  }
}

// Generate unique handle from email
export function generateHandleFromEmail(email: string): string {
  const prefix = email.split('@')[0]
  // Remove non-alphanumeric characters and convert to lowercase
  return prefix.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
}

// Validate and sanitize date of birth
export function validateDateOfBirth(dateString: string): { isValid: boolean; isAdult: boolean } {
  const date = new Date(dateString)
  const now = new Date()
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return { isValid: false, isAdult: false }
  }
  
  // Check if date is not in the future
  if (date > now) {
    return { isValid: false, isAdult: false }
  }
  
  // Check if person is 18+
  const age = now.getFullYear() - date.getFullYear()
  const monthDiff = now.getMonth() - date.getMonth()
  const dayDiff = now.getDate() - date.getDate()
  
  const isAdult = age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
  
  return { isValid: true, isAdult }
}