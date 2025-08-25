'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Eye, Heart, Share2, MessageCircle } from 'lucide-react'

interface Post {
  id: string
  title: string
  content?: string
  mediaUrl?: string
  thumbnailUrl?: string
  blurredUrl?: string
  price: number
  isLocked: boolean
  viewCount: number
  unlockCount: number
  createdAt: string
  creator: {
    id: string
    handle: string
    displayName: string
    image?: string
  }
}

interface PostCardProps {
  post: Post
  isUnlocked?: boolean
  onUnlock?: (postId: string) => Promise<void>
  showCreatorInfo?: boolean
  className?: string
}

export default function PostCard({ 
  post, 
  isUnlocked = false, 
  onUnlock,
  showCreatorInfo = true,
  className = ""
}: PostCardProps) {
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [liked, setLiked] = useState(false)

  const handleUnlock = async () => {
    if (!onUnlock) return
    
    setIsUnlocking(true)
    try {
      await onUnlock(post.id)
    } catch (error) {
      console.error('Failed to unlock post:', error)
    } finally {
      setIsUnlocking(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      {showCreatorInfo && (
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              {post.creator.image ? (
                <img 
                  src={post.creator.image} 
                  alt={post.creator.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {post.creator.displayName.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{post.creator.displayName}</p>
              <p className="text-gray-500 text-xs">@{post.creator.handle} • {formatDate(post.createdAt)}</p>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className={showCreatorInfo ? "pt-0" : "pt-6"}>
        {/* Title */}
        <h3 className="font-semibold text-lg mb-3">{post.title}</h3>

        {/* Content Preview */}
        {post.content && (
          <p className="text-gray-700 mb-4 line-clamp-3">
            {isUnlocked || !post.isLocked 
              ? post.content 
              : post.content.slice(0, 100) + '...'
            }
          </p>
        )}

        {/* Media Content */}
        {post.mediaUrl && (
          <div className="relative mb-4 rounded-lg overflow-hidden">
            {isUnlocked || !post.isLocked ? (
              <img 
                src={post.mediaUrl} 
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="relative">
                <img 
                  src={post.blurredUrl || post.thumbnailUrl || post.mediaUrl} 
                  alt={post.title}
                  className="w-full h-64 object-cover filter blur-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Lock className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-semibold">Unlock to view</p>
                    <p className="text-sm opacity-90">${post.price}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Unlock Button for Locked Content */}
        {post.isLocked && !isUnlocked && (
          <div className="mb-4">
            <Button 
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isUnlocking ? (
                'Unlocking...'
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Unlock for ${post.price}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Post Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount}</span>
            </div>
            {post.unlockCount > 0 && (
              <div className="flex items-center space-x-1">
                <Lock className="h-4 w-4" />
                <span>{post.unlockCount} unlocks</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLiked(!liked)}
              className={`p-1 ${liked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 text-gray-500">
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 text-gray-500">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}