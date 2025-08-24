import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { prisma } from '@/lib/prisma'
import { analytics } from '@/lib/analytics'
import { Star, MessageCircle, Users, Heart, Lock } from 'lucide-react'
import { useEffect } from 'react'

interface CreatorProfileProps {
  creator: {
    id: string
    handle: string
    displayName: string
    bio: string
    image: string
    headerImage: string
    isVerified: boolean
    totalEarnings: number
    totalFans: number
    totalMessages: number
  }
  content: Array<{
    id: string
    title: string
    description: string
    price: number
    thumbnail: string
    unlockCount: number
  }>
}

export default function CreatorProfile({ creator, content }: CreatorProfileProps) {
  useEffect(() => {
    // Track creator view
    analytics.viewCreator({
      creatorId: creator.id,
      creatorName: creator.displayName,
    })
  }, [creator.id, creator.displayName])

  return (
    <>
      <Head>
        <title>{creator.displayName} (@{creator.handle}) - CreatorChat Hub</title>
        <meta name="description" content={creator.bio} />
        <meta property="og:title" content={`${creator.displayName} on CreatorChat Hub`} />
        <meta property="og:description" content={creator.bio} />
        <meta property="og:image" content={creator.image} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
              ← Back to CreatorChat Hub
            </Link>
          </div>
        </header>

        {/* Profile Section */}
        <div className="relative">
          {/* Header Image */}
          <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 relative overflow-hidden">
            <img 
              src={creator.headerImage} 
              alt="Header" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Info */}
          <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <img 
                  src={creator.image} 
                  alt={creator.displayName}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{creator.displayName}</h1>
                    {creator.isVerified && (
                      <Star className="h-6 w-6 text-blue-500 fill-current" />
                    )}
                  </div>
                  <p className="text-purple-600 font-medium mb-3">@{creator.handle}</p>
                  <p className="text-gray-600 mb-4">{creator.bio}</p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{creator.totalFans.toLocaleString()} fans</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{creator.totalMessages.toLocaleString()} messages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>${creator.totalEarnings.toLocaleString()} earned</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex flex-col gap-3">
                  <Link 
                    href={`/c/${creator.handle}/chat`}
                    className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors text-center"
                  >
                    Start Chat 💬
                  </Link>
                  <button className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors">
                    Follow ❤️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Exclusive Content</h2>
          
          {content.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {content.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock className="h-8 w-8 mx-auto mb-2" />
                        <div className="text-lg font-bold">${item.price}</div>
                        <div className="text-sm opacity-90">to unlock</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {item.unlockCount} unlocks
                      </span>
                      <Link 
                        href={`/c/${creator.handle}/chat?content=${item.id}`}
                        className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                      >
                        Unlock ${item.price}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exclusive content yet</h3>
              <p className="text-gray-600">Check back soon for new content from {creator.displayName}!</p>
            </div>
          )}
        </div>

        {/* Chat CTA Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to connect?</h2>
            <p className="text-lg mb-6 opacity-90">
              Start a personal conversation with {creator.displayName} today
            </p>
            <Link 
              href={`/c/${creator.handle}/chat`}
              className="inline-flex items-center bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Chatting <MessageCircle className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const handle = params?.handle as string

  if (!handle) {
    return {
      notFound: true,
    }
  }

  try {
    // In production, this would fetch from the database
    // For now, return mock data for the demo creator "jess"
    if (handle === 'jess') {
      const creator = {
        id: 'creator_jess',
        handle: 'jess',
        displayName: 'Jess Williams',
        bio: 'Lifestyle content creator sharing daily adventures, wellness tips, and behind-the-scenes moments. Join my community for exclusive content and personal chats! 💕',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=400&h=400&fit=crop',
        headerImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
        isVerified: true,
        totalEarnings: 1250.75,
        totalFans: 248,
        totalMessages: 1847,
      }

      const content = [
        {
          id: 'content_1',
          title: 'Behind the Scenes: Morning Routine 🌅',
          description: 'Get an exclusive look at my actual morning routine! This includes my skincare secrets, workout tips, and the smoothie recipe everyone asks about.',
          price: 9.00,
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          unlockCount: 23,
        },
        {
          id: 'content_2',
          title: 'Wellness Wednesday Tips 🧘‍♀️',
          description: 'My personal wellness routine that keeps me centered and energized. Includes meditation techniques and self-care practices.',
          price: 5.00,
          thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
          unlockCount: 18,
        },
      ]

      return {
        props: {
          creator,
          content,
        },
      }
    }

    return {
      notFound: true,
    }
  } catch (error) {
    console.error('Error fetching creator:', error)
    return {
      notFound: true,
    }
  }
}