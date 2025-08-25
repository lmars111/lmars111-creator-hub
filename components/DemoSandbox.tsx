'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import PostCard from '@/components/PostCard'
import { 
  MessageCircle, 
  Send, 
  Star,
  Play,
  Pause,
  RotateCcw,
  Sparkles
} from 'lucide-react'

interface ChatMessage {
  id: string
  text: string
  fromDemo: boolean
  timestamp: Date
}

const mockPosts = [
  {
    id: 'demo_post_1',
    title: 'My Morning Skincare Routine ✨',
    content: 'Get ready with me as I share my 5-step morning skincare routine that keeps my skin glowing all day! Includes product recommendations and application tips.',
    mediaUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
    blurredUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&blur=10',
    price: 8,
    isLocked: true,
    viewCount: 234,
    unlockCount: 45,
    createdAt: '2024-01-20T09:15:00Z',
    creator: {
      id: 'demo_creator',
      handle: 'beautyqueen',
      displayName: 'Luna Beauty',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=100&h=100&fit=crop'
    }
  },
  {
    id: 'demo_post_2',
    title: 'Exclusive Workout Video 💪',
    content: 'Join me for a 20-minute HIIT workout that you can do anywhere! Perfect for busy schedules and guaranteed to get your heart pumping.',
    mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    blurredUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&blur=10',
    price: 12,
    isLocked: true,
    viewCount: 189,
    unlockCount: 32,
    createdAt: '2024-01-18T16:30:00Z',
    creator: {
      id: 'demo_creator',
      handle: 'fitnesslife',
      displayName: 'Alex Fitness',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    }
  }
]

const demoResponses = [
  "Hey there! 👋 Welcome to my page! I'm so excited to connect with you!",
  "Thanks for checking out my content! What brings you here today? 😊",
  "I love meeting new fans! Tell me a bit about yourself!",
  "You're awesome for stopping by! 💕 How can I make your day better?",
  "Welcome to the demo! In the real app, I'd respond personally to your messages!",
  "This is just a taste of what our platform offers. Ready to see more? ✨"
]

export default function DemoSandbox() {
  const [isActive, setIsActive] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [currentCreator, setCurrentCreator] = useState(0)
  const [unlockedPosts, setUnlockedPosts] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isActive && messages.length === 0) {
      // Add initial message after a short delay
      setTimeout(() => {
        addDemoMessage(demoResponses[0])
      }, 1000)
    }
  }, [isActive, messages.length])

  const addDemoMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: `demo_${Date.now()}`,
      text,
      fromDemo: true,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const addUserMessage = (text: string) => {
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text,
      fromDemo: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Auto-respond after a delay
    setTimeout(() => {
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]
      addDemoMessage(randomResponse)
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return
    
    addUserMessage(inputText)
    setInputText('')
  }

  const handleUnlockPost = async (postId: string) => {
    // Simulate unlock process
    await new Promise(resolve => setTimeout(resolve, 1000))
    setUnlockedPosts(prev => new Set(prev).add(postId))
    
    // Add celebration message
    addDemoMessage("🎉 Content unlocked! In the real app, you'd see the full content now. Thanks for supporting creators!")
  }

  const resetDemo = () => {
    setMessages([])
    setInputText('')
    setUnlockedPosts(new Set())
    setIsActive(false)
    setTimeout(() => setIsActive(true), 500)
  }

  const creators = [
    { name: 'Luna Beauty', handle: 'beautyqueen', color: 'from-pink-500 to-purple-500' },
    { name: 'Alex Fitness', handle: 'fitnesslife', color: 'from-blue-500 to-cyan-500' }
  ]

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-purple-600 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">Try the Demo</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience how creators and fans connect on our platform. Start a conversation 
            and see how content unlocking works!
          </p>
        </div>

        {/* Demo Controls */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsActive(!isActive)}
              variant={isActive ? "outline" : "default"}
              className={isActive ? "text-green-600" : ""}
            >
              {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isActive ? 'Demo Active' : 'Start Demo'}
            </Button>
            <Button variant="outline" onClick={resetDemo}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {isActive && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chat Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${creators[currentCreator].color} flex items-center justify-center text-white font-semibold`}>
                      {creators[currentCreator].name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{creators[currentCreator].name}</CardTitle>
                      <CardDescription>@{creators[currentCreator].handle}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Messages */}
                <div className="h-64 overflow-y-auto mb-4 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.fromDemo ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl ${
                          message.fromDemo
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-purple-600 text-white'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={!isActive}
                  />
                  <Button onClick={handleSendMessage} disabled={!inputText.trim() || !isActive}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    Exclusive Content
                  </CardTitle>
                  <CardDescription>
                    Premium content that fans can unlock
                  </CardDescription>
                </CardHeader>
              </Card>

              {mockPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isUnlocked={unlockedPosts.has(post.id)}
                  onUnlock={handleUnlockPost}
                  showCreatorInfo={false}
                />
              ))}
            </div>
          </div>
        )}

        {!isActive && (
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="py-12">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Ready to Experience CreatorChat Hub?</h3>
              <p className="text-gray-600 mb-6">
                Click &quot;Start Demo&quot; above to try our platform with interactive chat and content unlocking
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => setIsActive(true)}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Demo
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/apply">
                    Join as Creator
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">Real-time Chat</h3>
              <p className="text-sm text-gray-600">
                Experience our interactive chat system with AI-powered responses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="font-semibold mb-2">Content Unlocking</h3>
              <p className="text-sm text-gray-600">
                See how fans can unlock exclusive content with secure payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-pink-600" />
              <h3 className="font-semibold mb-2">Creator Experience</h3>
              <p className="text-sm text-gray-600">
                Get a feel for how creators manage content and interact with fans
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}