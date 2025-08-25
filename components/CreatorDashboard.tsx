'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PostUploadForm from '@/components/PostUploadForm'
import PostCard from '@/components/PostCard'
import { 
  DollarSign, 
  Eye, 
  Users, 
  TrendingUp, 
  Plus, 
  BarChart3,
  Share2,
  Calendar,
  Target,
  Gift
} from 'lucide-react'

interface CreatorDashboardProps {
  creator: {
    id: string
    handle: string
    displayName: string
    image?: string
    totalEarnings: number
    totalFans: number
    totalViews: number
    stripeConnected: boolean
  }
}

const mockPosts = [
  {
    id: 'post_1',
    title: 'Behind the Scenes: Morning Routine',
    content: 'Get an exclusive look at how I start my day with wellness and productivity tips!',
    mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    blurredUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&blur=20',
    price: 15,
    isLocked: true,
    viewCount: 124,
    unlockCount: 23,
    createdAt: '2024-01-15T08:30:00Z',
    creator: {
      id: 'creator_jess',
      handle: 'jess',
      displayName: 'Jess Williams',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=100&h=100&fit=crop'
    }
  },
  {
    id: 'post_2',
    title: 'Exclusive Workout Session',
    content: 'Join me for a high-intensity workout that will get your heart pumping!',
    mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    blurredUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&blur=20',
    price: 12,
    isLocked: true,
    viewCount: 89,
    unlockCount: 16,
    createdAt: '2024-01-12T15:45:00Z',
    creator: {
      id: 'creator_jess',
      handle: 'jess',
      displayName: 'Jess Williams',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=100&h=100&fit=crop'
    }
  }
]

export default function CreatorDashboard({ creator }: CreatorDashboardProps) {
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [posts, setPosts] = useState(mockPosts)
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'analytics' | 'referrals'>('overview')

  const handlePostUpload = async (postData: any) => {
    // In production, this would call the API
    console.log('Uploading post:', postData)
    
    // Mock post creation
    const newPost = {
      id: `post_${Date.now()}`,
      title: postData.title,
      content: postData.content,
      mediaUrl: '',
      blurredUrl: '',
      price: postData.price,
      isLocked: true,
      viewCount: 0,
      unlockCount: 0,
      createdAt: new Date().toISOString(),
      creator: {
        id: creator.id,
        handle: creator.handle,
        displayName: creator.displayName,
        image: creator.image || ''
      }
    }
    
    setPosts([newPost, ...posts])
    setShowUploadForm(false)
    
    // Show success message
    alert('Post uploaded successfully!')
  }

  const stats = [
    { label: 'Total Earnings', value: `$${creator.totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Total Fans', value: creator.totalFans.toLocaleString(), icon: Users, color: 'text-blue-600' },
    { label: 'Profile Views', value: creator.totalViews.toLocaleString(), icon: Eye, color: 'text-purple-600' },
    { label: 'Growth Rate', value: '+12.5%', icon: TrendingUp, color: 'text-emerald-600' }
  ]

  const mockReferralStats = {
    totalReferrals: 15,
    totalCommissions: 125.50,
    pendingPayouts: 45.20,
    referralCode: 'JESS_REF_2024'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                {creator.image ? (
                  <img 
                    src={creator.image} 
                    alt={creator.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold">
                    {creator.displayName.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{creator.displayName}</h1>
                <p className="text-gray-600">@{creator.handle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline"
                onClick={() => window.open(`/c/${creator.handle}`, '_blank')}
              >
                <Share2 className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button onClick={() => setShowUploadForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Content
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'posts', label: 'Posts', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'referrals', label: 'Referrals', icon: Gift }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for creators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col"
                    onClick={() => setShowUploadForm(true)}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    Upload Content
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <BarChart3 className="h-6 w-6 mb-2" />
                    View Analytics
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col"
                    disabled={!creator.stripeConnected}
                  >
                    <Target className="h-6 w-6 mb-2" />
                    {creator.stripeConnected ? 'Payout Settings' : 'Connect Stripe'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Posts</CardTitle>
                    <CardDescription>Your latest content uploads</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setActiveTab('posts')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.slice(0, 2).map((post) => (
                    <PostCard key={post.id} post={post} showCreatorInfo={false} isUnlocked />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
                <p className="text-gray-600">Manage your content and track performance</p>
              </div>
              <Button onClick={() => setShowUploadForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload New Post
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} showCreatorInfo={false} isUnlocked />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Referral Program</h2>
              <p className="text-gray-600">Earn commissions by referring new users</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                      <p className="text-2xl font-bold text-gray-900">{mockReferralStats.totalReferrals}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                      <p className="text-2xl font-bold text-gray-900">${mockReferralStats.totalCommissions}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                      <p className="text-2xl font-bold text-gray-900">${mockReferralStats.pendingPayouts}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Your Code</p>
                      <p className="text-lg font-bold text-purple-600">{mockReferralStats.referralCode}</p>
                    </div>
                    <Gift className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Referral Tiers</CardTitle>
                <CardDescription>Commission structure for your referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-green-800">Level 1 (Direct Referrals)</h4>
                      <p className="text-sm text-green-600">People you refer directly</p>
                    </div>
                    <div className="text-2xl font-bold text-green-800">5%</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-blue-800">Level 2 (Sub-referrals)</h4>
                      <p className="text-sm text-blue-600">People referred by your referrals</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">2%</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-purple-800">Level 3 (Third level)</h4>
                      <p className="text-sm text-purple-600">Third level referrals</p>
                    </div>
                    <div className="text-2xl font-bold text-purple-800">1%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="text-gray-600">Track your performance and audience insights</p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">
                    Detailed analytics dashboard with charts, insights, and performance metrics will be available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl">
            <PostUploadForm
              onSubmit={handlePostUpload}
              onCancel={() => setShowUploadForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}