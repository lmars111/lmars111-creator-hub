// Referral system utilities for CreatorChat Hub
// Implements L1 (5%), L2 (2%), L3 (1%) commission structure

import { analytics } from './analytics'

export interface ReferralLevel {
  level: 1 | 2 | 3
  percentage: number
  description: string
}

export const REFERRAL_LEVELS: ReferralLevel[] = [
  { level: 1, percentage: 0.05, description: 'Direct referral (5%)' },
  { level: 2, percentage: 0.02, description: 'Second level (2%)' },
  { level: 3, percentage: 0.01, description: 'Third level (1%)' }
]

export interface ReferralCommission {
  level: 1 | 2 | 3
  referrerId: string
  percentage: number
  amount: number
}

export interface ReferralCalculation {
  totalCommissions: number
  adjustedCreatorEarnings: number
  adjustedPlatformFee: number
  commissions: ReferralCommission[]
}

/**
 * Generate a unique referral code
 */
export function generateReferralCode(prefix: string = 'REF'): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}_${random}`.toUpperCase()
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  const pattern = /^[A-Z0-9_]{8,20}$/
  return pattern.test(code)
}

/**
 * Calculate referral commissions for a purchase
 * @param amount - The purchase amount
 * @param referralHierarchy - Array of referrer IDs from L1 to L3
 * @returns Calculated commissions and adjusted amounts
 */
export function calculateReferralCommissions(
  amount: number, 
  referralHierarchy: string[] = []
): ReferralCalculation {
  let totalCommissions = 0
  const commissions: ReferralCommission[] = []

  // Calculate commissions for each level
  for (let i = 0; i < Math.min(referralHierarchy.length, 3); i++) {
    const level = (i + 1) as 1 | 2 | 3
    const referralLevel = REFERRAL_LEVELS[i]
    const commissionAmount = amount * referralLevel.percentage
    
    commissions.push({
      level,
      referrerId: referralHierarchy[i],
      percentage: referralLevel.percentage,
      amount: commissionAmount
    })
    
    totalCommissions += commissionAmount
  }

  // Platform fee is 20% minus referral commissions
  const basePlatformFee = amount * 0.20
  const adjustedPlatformFee = basePlatformFee - totalCommissions
  const adjustedCreatorEarnings = amount - basePlatformFee

  return {
    totalCommissions,
    adjustedCreatorEarnings,
    adjustedPlatformFee,
    commissions
  }
}

/**
 * Get referral hierarchy for a user (mock implementation)
 * In production, this would query the database
 */
export async function getReferralHierarchy(userId: string): Promise<string[]> {
  // Mock implementation - in production, query ReferralHierarchy table
  const mockHierarchies: Record<string, string[]> = {
    'fan1': ['referrer1', 'referrer2', 'referrer3'],
    'fan2': ['referrer1', 'referrer2'],
    'fan3': ['referrer1']
  }
  
  return mockHierarchies[userId] || []
}

/**
 * Process referral signup when a new user joins with a referral code
 */
export async function processReferralSignup(
  newUserId: string, 
  referralCode: string
): Promise<{ success: boolean; hierarchy: string[] }> {
  try {
    // Mock implementation - in production, this would:
    // 1. Find the referral code owner
    // 2. Get their referral hierarchy
    // 3. Create new hierarchy entries for the new user
    // 4. Update referral code usage count
    
    console.log(`Processing referral signup for user ${newUserId} with code ${referralCode}`)
    
    // Mock hierarchy creation
    const referrerId = 'referrer1' // Would be looked up from referral code
    const existingHierarchy = await getReferralHierarchy(referrerId)
    const newUserHierarchy = [referrerId, ...existingHierarchy].slice(0, 3)
    
    // Track the referral signup
    analytics.identify(newUserId, {
      referralCode,
      referrerId,
      hierarchyLevels: newUserHierarchy.length
    })
    
    return {
      success: true,
      hierarchy: newUserHierarchy
    }
  } catch (error) {
    console.error('Failed to process referral signup:', error)
    return {
      success: false,
      hierarchy: []
    }
  }
}

/**
 * Calculate total earnings for a referrer across all levels
 */
export function calculateReferrerEarnings(
  purchases: Array<{ amount: number; referrerLevel: 1 | 2 | 3 }>
): number {
  return purchases.reduce((total, purchase) => {
    const level = REFERRAL_LEVELS[purchase.referrerLevel - 1]
    return total + (purchase.amount * level.percentage)
  }, 0)
}

/**
 * Get referral statistics for a user
 */
export async function getReferralStats(userId: string): Promise<{
  totalReferrals: number
  totalEarnings: number
  referralsByLevel: Record<1 | 2 | 3, number>
  pendingCommissions: number
}> {
  // Mock implementation - in production, query database
  return {
    totalReferrals: 12,
    totalEarnings: 245.50,
    referralsByLevel: {
      1: 8,
      2: 3, 
      3: 1
    },
    pendingCommissions: 45.20
  }
}

/**
 * Validate and apply referral code during purchase
 */
export async function applyReferralCommissions(
  purchaseAmount: number,
  buyerUserId: string
): Promise<ReferralCalculation> {
  const hierarchy = await getReferralHierarchy(buyerUserId)
  return calculateReferralCommissions(purchaseAmount, hierarchy)
}