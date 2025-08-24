import { GetServerSideProps } from 'next'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { analytics } from '@/lib/analytics'
import { Send, Lock, Star, ArrowLeft, Image, Heart } from 'lucide-react'

interface ChatMessage {
  id: string
  text: string
  isFromCreator: boolean
  isFromAI: boolean
  timestamp: string
  contentId?: string
}

interface LockedContent {
  id: string
  title: string
  description: string
  price: number
  thumbnail: string
}

interface ChatPageProps {
  creator: {
    id: string
    handle: string
    displayName: string
    image: string
    isVerified: boolean
  }
  initialMessages: ChatMessage[]
  lockedContent: LockedContent[]
}

export default function ChatPage({ creator, initialMessages, lockedContent }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Track chat start
    analytics.startChat({
      creatorId: creator.id,
    })
  }, [creator.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      text: newMessage,
      isFromCreator: false,
      isFromAI: false,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        text: getAIResponse(newMessage),
        isFromCreator: true,
        isFromAI: true,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (userMessage: string): string => {
    const responses = [
      "Thanks for your message! 💕 I love connecting with my fans!",
      "That's so sweet of you to say! What would you like to know about my wellness routine?",
      "I'm so glad you're part of my community! Have you checked out my exclusive content? 🌟",
      "You're amazing! I have some behind-the-scenes content that I think you'd love!",
      "Thanks for chatting with me! Don't forget to unlock my premium content for more personal moments 😘",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleUnlockContent = async (contentId: string) => {
    const content = lockedContent.find(c => c.id === contentId)
    if (!content) return

    // Track unlock attempt
    analytics.unlockAttempt({
      contentId,
      method: 'payment',
      amount: content.price,
    })

    try {
      // Call our payment API to create Stripe checkout session
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorId: creator.id,
          contentId,
          userId: 'demo_user', // In production, get from auth
          amount: content.price,
        }),
      })

      const data = await response.json()

      if (data.success && data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl
      } else {
        // Show error or fallback message
        alert(`Payment processing: $${content.price}\n\nDemo Mode: ${data.message || 'Stripe checkout would open here in production.'}\n\nFees: Platform: $${data.fees?.platformFee || 'N/A'}, Creator: $${data.fees?.creatorEarnings || 'N/A'}`)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert(`Error processing payment: ${error}\n\nThis is a demo - in production this would redirect to Stripe checkout for $${content.price}`)
    }
  }

  return (
    <>
      <Head>
        <title>Chat with {creator.displayName} - CreatorChat Hub</title>
        <meta name="description" content={`Personal chat with ${creator.displayName}`} />
      </Head>

      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/c/${creator.handle}`} className="text-purple-600 hover:text-purple-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <img 
                src={creator.image} 
                alt={creator.displayName}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">{creator.displayName}</span>
                  {creator.isVerified && (
                    <Star className="h-4 w-4 text-blue-500 fill-current" />
                  )}
                </div>
                <div className="text-xs text-green-500">Online now</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Powered by AI + Human reps
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isFromCreator ? 'justify-start' : 'justify-end'}`}>
              <div className={`chat-bubble ${message.isFromCreator ? 'chat-bubble-creator' : 'chat-bubble-user'}`}>
                <p>{message.text}</p>
                {message.isFromAI && (
                  <div className="text-xs opacity-70 mt-1">✨ AI Response</div>
                )}
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {/* Locked Content Cards */}
          {lockedContent.map((content) => (
            <div key={content.id} className="max-w-sm mx-auto">
              <div className="locked-content">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="h-5 w-5" />
                  <span className="font-semibold">Exclusive Content</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{content.title}</h3>
                <p className="text-sm opacity-90 mb-4">{content.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold">${content.price}</div>
                  <button 
                    onClick={() => handleUnlockContent(content.id)}
                    className="unlock-button"
                  >
                    Unlock Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-bubble chat-bubble-creator">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600">
              <Image className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <Heart className="h-5 w-5" />
            </button>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Messages are powered by AI and human representatives for the best experience
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
    // Mock data for demo creator "jess"
    if (handle === 'jess') {
      const creator = {
        id: 'creator_jess',
        handle: 'jess',
        displayName: 'Jess Williams',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=400&h=400&fit=crop',
        isVerified: true,
      }

      const initialMessages: ChatMessage[] = [
        {
          id: 'msg_1',
          text: "Hey there! 👋 Welcome to my personal chat! I'm so excited to connect with you.",
          isFromCreator: true,
          isFromAI: true,
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
        {
          id: 'msg_2',
          text: "I love sharing my wellness journey and behind-the-scenes moments with my community. What brings you here today? 💕",
          isFromCreator: true,
          isFromAI: true,
          timestamp: new Date(Date.now() - 240000).toISOString(),
        },
      ]

      const lockedContent: LockedContent[] = [
        {
          id: 'content_1',
          title: 'Behind the Scenes: Morning Routine 🌅',
          description: 'Get an exclusive look at my actual morning routine! This includes my skincare secrets, workout tips, and the smoothie recipe everyone asks about.',
          price: 9.00,
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        },
      ]

      return {
        props: {
          creator,
          initialMessages,
          lockedContent,
        },
      }
    }

    return {
      notFound: true,
    }
  } catch (error) {
    console.error('Error loading chat:', error)
    return {
      notFound: true,
    }
  }
}