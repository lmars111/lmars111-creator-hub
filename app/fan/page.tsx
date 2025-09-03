'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Heart, Star, TrendingUp, Users, Calendar } from 'lucide-react'
import { MotionDiv, fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'

export default function FanDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin?callbackUrl=/fan')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <MotionDiv
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Header */}
          <MotionDiv variants={staggerItem}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {session.user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-gray-600 mt-1">Manage your subscriptions and connections</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-white">
                  Fan
                </Badge>
                <Link href="/discover">
                  <Button>Discover Creators</Button>
                </Link>
              </div>
            </div>
          </MotionDiv>

          {/* Quick Stats */}
          <MotionDiv variants={staggerItem}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Active Chats</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">5</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-600">Subscriptions</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">3</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-600">Content Unlocked</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">24</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">This Month</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">$67.50</div>
                </CardContent>
              </Card>
            </div>
          </MotionDiv>

          {/* Navigation Cards */}
          <MotionDiv variants={staggerItem}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/fan/chats">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                      <span>My Chats</span>
                    </CardTitle>
                    <CardDescription>
                      Continue conversations with your favorite creators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>3 new messages</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/fan/subscriptions">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-pink-600" />
                      <span>Subscriptions</span>
                    </CardTitle>
                    <CardDescription>
                      Manage your creator subscriptions and renewals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Next renewal: Dec 15</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/fan/feed">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span>Content Feed</span>
                    </CardTitle>
                    <CardDescription>
                      Browse latest content from subscribed creators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>8 new posts</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </MotionDiv>

          {/* Recent Activity */}
          <MotionDiv variants={staggerItem}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions and purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">New message from Jess</p>
                      <p className="text-sm text-gray-600">2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Unlocked exclusive photo from Emma</p>
                      <p className="text-sm text-gray-600">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Subscribed to Sarah's content</p>
                      <p className="text-sm text-gray-600">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </MotionDiv>
      </div>
    </div>
  )
}