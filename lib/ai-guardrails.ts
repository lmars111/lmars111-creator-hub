// AI cost guardrails and rate limiting for CreatorChat Hub

interface RateLimit {
  count: number
  resetTime: number
}

interface UsageMetrics {
  totalTokens: number
  totalCost: number
  requestCount: number
  lastReset: number
}

// In-memory rate limiting (use Redis in production)
const rateLimits = new Map<string, RateLimit>()
const usageMetrics = new Map<string, UsageMetrics>()

// Cost configuration
const AI_COSTS = {
  TOKEN_COST_PER_1K: 0.0015, // Example cost per 1k tokens
  MAX_DAILY_COST_PER_USER: 10.00, // Max $10 per user per day
  MAX_REQUESTS_PER_MINUTE: 20, // Max 20 AI requests per minute per user
  MAX_TOKENS_PER_REQUEST: 1000, // Max tokens per single request
  MAX_DAILY_TOKENS_PER_USER: 50000, // Max 50k tokens per user per day
}

export function checkRateLimit(userId: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const minuteInMs = 60 * 1000
  
  const userLimit = rateLimits.get(userId)
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimits.set(userId, {
      count: 1,
      resetTime: now + minuteInMs
    })
    return { allowed: true }
  }
  
  if (userLimit.count >= AI_COSTS.MAX_REQUESTS_PER_MINUTE) {
    return { 
      allowed: false, 
      resetTime: userLimit.resetTime 
    }
  }
  
  // Increment count
  userLimit.count++
  return { allowed: true }
}

export function checkDailyCost(userId: string): { allowed: boolean; currentCost: number; limit: number } {
  const metrics = getUserMetrics(userId)
  
  return {
    allowed: metrics.totalCost < AI_COSTS.MAX_DAILY_COST_PER_USER,
    currentCost: metrics.totalCost,
    limit: AI_COSTS.MAX_DAILY_COST_PER_USER
  }
}

export function checkTokenLimit(userId: string, requestedTokens: number): { 
  allowed: boolean
  reason?: string
  dailyUsed?: number
  dailyLimit?: number
} {
  // Check single request limit
  if (requestedTokens > AI_COSTS.MAX_TOKENS_PER_REQUEST) {
    return {
      allowed: false,
      reason: 'Request exceeds maximum tokens per request',
    }
  }
  
  // Check daily limit
  const metrics = getUserMetrics(userId)
  if (metrics.totalTokens + requestedTokens > AI_COSTS.MAX_DAILY_TOKENS_PER_USER) {
    return {
      allowed: false,
      reason: 'Daily token limit exceeded',
      dailyUsed: metrics.totalTokens,
      dailyLimit: AI_COSTS.MAX_DAILY_TOKENS_PER_USER
    }
  }
  
  return { allowed: true }
}

export function recordAIUsage(userId: string, tokens: number): void {
  const cost = (tokens / 1000) * AI_COSTS.TOKEN_COST_PER_1K
  const metrics = getUserMetrics(userId)
  
  metrics.totalTokens += tokens
  metrics.totalCost += cost
  metrics.requestCount += 1
  
  usageMetrics.set(userId, metrics)
  
  // Log for monitoring
  console.log(`AI usage recorded for ${userId}:`, {
    tokens,
    cost: cost.toFixed(4),
    dailyTotal: metrics.totalCost.toFixed(2),
    requestCount: metrics.requestCount
  })
}

export function getUserMetrics(userId: string): UsageMetrics {
  const now = Date.now()
  const oneDayMs = 24 * 60 * 60 * 1000
  
  const existing = usageMetrics.get(userId)
  
  // Reset if it's a new day
  if (!existing || now - existing.lastReset > oneDayMs) {
    const newMetrics: UsageMetrics = {
      totalTokens: 0,
      totalCost: 0,
      requestCount: 0,
      lastReset: now
    }
    usageMetrics.set(userId, newMetrics)
    return newMetrics
  }
  
  return existing
}

export async function validateAIRequest(userId: string, estimatedTokens: number): Promise<{
  allowed: boolean
  reason?: string
  metrics?: {
    dailyCost: number
    dailyTokens: number
    requestsThisMinute: number
  }
}> {
  // Check rate limit
  const rateCheck = checkRateLimit(userId)
  if (!rateCheck.allowed) {
    return {
      allowed: false,
      reason: `Rate limit exceeded. Try again in ${Math.ceil((rateCheck.resetTime! - Date.now()) / 1000)} seconds.`
    }
  }
  
  // Check daily cost limit
  const costCheck = checkDailyCost(userId)
  if (!costCheck.allowed) {
    return {
      allowed: false,
      reason: `Daily cost limit exceeded ($${costCheck.currentCost.toFixed(2)}/$${costCheck.limit.toFixed(2)})`
    }
  }
  
  // Check token limits
  const tokenCheck = checkTokenLimit(userId, estimatedTokens)
  if (!tokenCheck.allowed) {
    return {
      allowed: false,
      reason: tokenCheck.reason,
    }
  }
  
  const metrics = getUserMetrics(userId)
  const currentRateLimit = rateLimits.get(userId)
  
  return {
    allowed: true,
    metrics: {
      dailyCost: metrics.totalCost,
      dailyTokens: metrics.totalTokens,
      requestsThisMinute: currentRateLimit?.count || 0
    }
  }
}

export function getAICostConfiguration() {
  return AI_COSTS
}

export function resetUserLimits(userId: string): void {
  rateLimits.delete(userId)
  usageMetrics.delete(userId)
  console.log(`Reset AI limits for user ${userId}`)
}

// Admin function to get usage statistics
export function getUsageStatistics(): {
  totalUsers: number
  totalCost: number
  totalTokens: number
  totalRequests: number
  averageCostPerUser: number
} {
  const allMetrics = Array.from(usageMetrics.values())
  
  const totalCost = allMetrics.reduce((sum, m) => sum + m.totalCost, 0)
  const totalTokens = allMetrics.reduce((sum, m) => sum + m.totalTokens, 0)
  const totalRequests = allMetrics.reduce((sum, m) => sum + m.requestCount, 0)
  
  return {
    totalUsers: allMetrics.length,
    totalCost,
    totalTokens,
    totalRequests,
    averageCostPerUser: allMetrics.length > 0 ? totalCost / allMetrics.length : 0
  }
}