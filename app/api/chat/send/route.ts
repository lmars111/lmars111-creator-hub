import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

// For build-time, return early if Prisma isn't available
let prisma: any = null
try {
  const { prisma: prismaClient } = require('@/lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.warn('Prisma not available during build')
}

import { 
  createStreamingChatCompletion, 
  moderateContent, 
  buildCreatorPersonaPrompt,
  ChatMessage,
  MAX_CONTEXT_MESSAGES 
} from '@/lib/ai'
import { checkRateLimit, validateAIRequest, recordAIUsage } from '@/lib/ai-guardrails'

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        error: 'Service temporarily unavailable' 
      }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message, creatorId } = body

    if (!message || !creatorId) {
      return NextResponse.json({ 
        error: 'Missing required fields: message, creatorId' 
      }, { status: 400 })
    }

    // Get creator information
    const creator = await prisma.creator.findUnique({
      where: { id: creatorId },
      include: {
        user: true,
        aiConfig: true,
      },
    })

    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    // Check if user is subscribed or has free messages remaining
    const subscription = await prisma.creatorFan.findUnique({
      where: {
        creatorId_userId: {
          creatorId,
          userId: session.user.id,
        },
      },
    })

    // Get message count for non-subscribers (3 free messages)
    const messageCount = await prisma.message.count({
      where: {
        conversation: {
          creatorId,
          fanId: session.user.id,
        },
        isFromAI: true,
      },
    })

    if (!subscription && messageCount >= 3) {
      return NextResponse.json({ 
        error: 'Free message limit reached. Please subscribe to continue chatting.',
        code: 'PAYWALL_REQUIRED',
        limit_reached: true,
      }, { status:402 })
    }

    // Rate limiting
    const rateLimitCheck = checkRateLimit(session.user.id)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded. Please wait before sending another message.',
        reset_time: rateLimitCheck.resetTime,
      }, { status: 429 })
    }

    // AI cost validation
    const estimatedTokens = message.length * 1.3 // Rough estimate
    const aiValidation = await validateAIRequest(session.user.id, estimatedTokens)
    if (!aiValidation.allowed) {
      return NextResponse.json({ 
        error: aiValidation.reason || 'AI usage limit reached',
        metrics: aiValidation.metrics,
      }, { status: 429 })
    }

    // Content moderation
    const moderation = await moderateContent(message)
    if (moderation.flagged) {
      return NextResponse.json({ 
        error: 'Message contains inappropriate content and has been blocked.',
        flagged_categories: Object.keys(moderation.categories).filter(
          key => moderation.categories[key as keyof typeof moderation.categories]
        ),
      }, { status: 400 })
    }

    // Get or create conversation
    let conversation = await prisma.conversation.findUnique({
      where: {
        creatorId_fanId: {
          creatorId,
          fanId: session.user.id,
        },
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          creatorId,
          fanId: session.user.id,
        },
      })
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: session.user.id,
        text: message,
        type: 'TEXT',
        isFromCreator: false,
        isFromAI: false,
      },
    })

    // Get recent conversation history for context
    const recentMessages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: MAX_CONTEXT_MESSAGES,
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
    })

    // Build conversation context
    const systemPrompt = buildCreatorPersonaPrompt(creator)
    const conversationHistory: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...recentMessages.reverse().map((msg: any) => ({
        role: (msg.isFromCreator || msg.isFromAI) ? 'assistant' as const : 'user' as const,
        content: msg.text || '',
      })),
    ]

    // Create streaming response
    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            const stream = await createStreamingChatCompletion(conversationHistory)
            
            let fullResponse = ''
            
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || ''
              
              if (content) {
                fullResponse += content
                
                // Send chunk to client
                const data = JSON.stringify({ 
                  content,
                  type: 'chunk'
                })
                controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
              }
            }

            // Post-generation moderation
            const responseModeration = await moderateContent(fullResponse)
            
            if (responseModeration.flagged) {
              const errorData = JSON.stringify({ 
                error: 'Response contained inappropriate content and was blocked.',
                type: 'moderation_error'
              })
              controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`))
              controller.close()
              return
            }

            // Save AI response
            const aiMessage = await prisma.message.create({
              data: {
                conversationId: conversation.id,
                senderId: session.user.id, // System/AI messages use fan's ID
                text: fullResponse,
                type: 'TEXT',
                isFromCreator: true,
                isFromAI: true,
              },
            })

            // Record AI usage
            recordAIUsage(session.user.id, estimatedTokens)

            // Send completion signal
            const completeData = JSON.stringify({ 
              type: 'complete',
              messageId: aiMessage.id
            })
            controller.enqueue(new TextEncoder().encode(`data: ${completeData}\n\n`))
            controller.close()

          } catch (error) {
            console.error('Streaming error:', error)
            const errorData = JSON.stringify({ 
              error: 'Failed to generate response',
              type: 'generation_error'
            })
            controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`))
            controller.close()
          }
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    )

  } catch (error) {
    console.error('Chat send error:', error)
    return NextResponse.json({ 
      error: 'Failed to send message' 
    }, { status: 500 })
  }
}