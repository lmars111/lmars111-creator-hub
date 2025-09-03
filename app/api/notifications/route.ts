import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

// Force Node.js runtime for database operations
export const runtime = 'nodejs'

// Initialize Prisma conditionally
let prisma: any = null
try {
  const { prisma: prismaClient } = require('@/lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.warn('Prisma not available during build')
}

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unread') === 'true'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { userId: session.user.id }
    if (unreadOnly) {
      where.readAt = null
    }

    // Get notifications
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ])

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        readAt: null,
      },
    })

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, notificationIds } = body

    if (action === 'mark_read') {
      if (notificationIds && Array.isArray(notificationIds)) {
        // Mark specific notifications as read
        await prisma.notification.updateMany({
          where: {
            id: { in: notificationIds },
            userId: session.user.id,
          },
          data: { readAt: new Date() },
        })
      } else {
        // Mark all notifications as read
        await prisma.notification.updateMany({
          where: {
            userId: session.user.id,
            readAt: null,
          },
          data: { readAt: new Date() },
        })
      }

      return NextResponse.json({
        message: 'Notifications marked as read',
      })
    }

    if (action === 'mark_unread') {
      if (!notificationIds || !Array.isArray(notificationIds)) {
        return NextResponse.json(
          { error: 'Notification IDs required for mark_unread' },
          { status: 400 }
        )
      }

      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: session.user.id,
        },
        data: { readAt: null },
      })

      return NextResponse.json({
        message: 'Notifications marked as unread',
      })
    }

    if (action === 'delete') {
      if (!notificationIds || !Array.isArray(notificationIds)) {
        return NextResponse.json(
          { error: 'Notification IDs required for delete' },
          { status: 400 }
        )
      }

      await prisma.notification.deleteMany({
        where: {
          id: { in: notificationIds },
          userId: session.user.id,
        },
      })

      return NextResponse.json({
        message: 'Notifications deleted',
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Notification action error:', error)
    return NextResponse.json(
      { error: 'Failed to process notification action' },
      { status: 500 }
    )
  }
}