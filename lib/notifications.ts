// Helper functions for creating and managing notifications

// Initialize Prisma conditionally
let prisma: any = null
try {
  const { prisma: prismaClient } = require('@/lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.warn('Prisma not available during build')
}

export async function createNotification(
  userId: string,
  type: string,
  payload: any
) {
  if (!prisma) {
    console.warn('Cannot create notification - Prisma not available')
    return null
  }

  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        payload,
      },
    })
  } catch (error) {
    console.error('Create notification error:', error)
    return null
  }
}

export async function createBulkNotifications(
  notifications: Array<{
    userId: string
    type: string
    payload: any
  }>
) {
  if (!prisma) {
    console.warn('Cannot create notifications - Prisma not available')
    return null
  }

  try {
    return await prisma.notification.createMany({
      data: notifications,
    })
  } catch (error) {
    console.error('Create bulk notifications error:', error)
    return null
  }
}

// Notification type helpers
export const NotificationTypes = {
  NEW_SUBSCRIBER: 'new_subscriber',
  NEW_TIP: 'tip_received',
  NEW_MESSAGE: 'new_message',
  NEW_CONTENT: 'new_content',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  CONTENT_PURCHASED: 'content_purchased',
  PAYOUT_PAID: 'payout_paid',
  KYC_APPROVED: 'kyc_approved',
  KYC_REJECTED: 'kyc_rejected',
} as const

// Helper to notify creator of new subscriber
export async function notifyNewSubscriber(
  creatorUserId: string,
  fanName: string,
  tierName: string
) {
  return createNotification(creatorUserId, NotificationTypes.NEW_SUBSCRIBER, {
    fanName,
    tierName,
    timestamp: new Date().toISOString(),
  })
}

// Helper to notify creator of new tip
export async function notifyNewTip(
  creatorUserId: string,
  fanName: string,
  amountCents: number
) {
  return createNotification(creatorUserId, NotificationTypes.NEW_TIP, {
    fanName,
    amountCents,
    timestamp: new Date().toISOString(),
  })
}

// Helper to notify fan of new content
export async function notifyNewContent(
  fanUserIds: string[],
  contentTitle: string,
  creatorName: string,
  creatorHandle: string
) {
  const notifications = fanUserIds.map(userId => ({
    userId,
    type: NotificationTypes.NEW_CONTENT,
    payload: {
      contentTitle,
      creatorName,
      creatorHandle,
      timestamp: new Date().toISOString(),
    },
  }))

  return createBulkNotifications(notifications)
}

// Helper to notify creator of KYC status change
export async function notifyKycStatusChange(
  creatorUserId: string,
  status: 'approved' | 'rejected',
  reason?: string
) {
  const type = status === 'approved' 
    ? NotificationTypes.KYC_APPROVED 
    : NotificationTypes.KYC_REJECTED

  return createNotification(creatorUserId, type, {
    status,
    reason,
    timestamp: new Date().toISOString(),
  })
}