import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { config } from '@/lib/config'
import { retrieveRelevantMemories, storeConversationSummary, storeFanProfile } from '@/lib/memory'

// Force Node.js runtime for AI APIs and database
export const runtime = 'nodejs'

// Initialize AI providers conditionally
let openai: any = null
let anthropic: any = null

try {
  if (config.ai.openai.enabled) {
    const OpenAI = require('openai')
    openai = new OpenAI({
      apiKey: config.ai.openai.apiKey,
    })
  }
} catch (error) {
  console.warn('OpenAI not available during build')
}

try {
  if (config.ai.anthropic.enabled) {
    const Anthropic = require('@anthropic-ai/sdk')
    anthropic = new Anthropic({
      apiKey: config.ai.anthropic.apiKey,
    })
  }
} catch (error) {
  console.warn('Anthropic not available during build')
}

// Initialize Prisma conditionally
let prisma: any = null
try {
  const { prisma: prismaClient } = require('@/lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.warn('Prisma not available during build')
}

const MAX_CONTEXT_MESSAGES = 10
const MAX_MEMORY_CONTEXT = 5

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
    const { message, creatorId, streaming = true } = body

    if (!message || !creatorId) {
      return NextResponse.json(
        { error: 'Message and creator ID are required' },
        { status: 400 }
      )
    }

    // Get creator and their persona
    const creator = await prisma.creator.findUnique({
      where: { id: creatorId },
      include: {
        defaultPersona: true,
        user: true,
      },
    })

    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      )
    }

    if (!creator.defaultPersona) {
      return NextResponse.json(
        { error: 'Creator has no AI persona configured' },
        { status: 400 }
      )
    }

    // Check if fan has access (subscription or public)
    const hasAccess = await checkFanAccess(session.user.id, creatorId)
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied - subscription required' },
        { status: 403 }
      )
    }

    // Get or create chat
    let chat = await prisma.chat.findFirst({
      where: {
        creatorId,
        fanId: session.user.id,
      },
    })

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          creatorId,
          fanId: session.user.id,
        },
      })
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: session.user.id,
        sender: 'FAN',
        text: message,
      },
    })

    // Get recent conversation history
    const recentMessages = await prisma.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: 'desc' },
      take: MAX_CONTEXT_MESSAGES,
      include: {
        senderUser: {
          select: { name: true },
        },
      },
    })

    // Retrieve relevant memories
    const memories = await retrieveRelevantMemories(
      creatorId,
      message,
      MAX_MEMORY_CONTEXT
    )

    // Build conversation context
    const conversationHistory = recentMessages
      .reverse()
      .map((msg: any) => ({
        role: msg.sender === 'FAN' ? 'user' : 'assistant',
        content: msg.text || '',
      }))

    // Build system prompt with persona and memory context
    const systemPrompt = buildSystemPrompt(creator, memories, session.user)

    // Prepare messages for AI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-MAX_CONTEXT_MESSAGES),
    ]

    // Choose AI provider based on persona settings
    const useAnthropic = creator.defaultPersona.modelProvider === 'ANTHROPIC' && anthropic
    const aiProvider = useAnthropic ? anthropic : openai

    if (!aiProvider) {
      return NextResponse.json(
        { error: 'AI service not available' },
        { status: 503 }
      )
    }

    // Generate AI response
    if (streaming) {
      return handleStreamingResponse(
        aiProvider,
        messages,
        creator,
        chat.id,
        session.user.id,
        useAnthropic
      )
    } else {
      return handleRegularResponse(
        aiProvider,
        messages,
        creator,
        chat.id,
        session.user.id,
        useAnthropic
      )
    }
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Chat request failed' },
      { status: 500 }
    )
  }
}

async function checkFanAccess(fanId: string, creatorId: string): Promise<boolean> {
  // Check for active subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      fanId,
      creatorId,
      status: 'ACTIVE',
      currentPeriodEnd: {
        gt: new Date(),
      },
    },
  })

  // For MVP, allow access with subscription or if creator allows free chat
  return !!subscription // TODO: Add free chat settings to creator profile
}

function buildSystemPrompt(creator: any, memories: any[], user: any): string {
  const persona = creator.defaultPersona
  let prompt = persona.systemPrompt

  // Add creator context
  prompt += `\n\nYou are chatting as ${creator.displayName} (@${creator.handle}).`
  if (creator.bio) {
    prompt += ` Bio: ${creator.bio}`
  }

  // Add fan context
  prompt += `\n\nYou are chatting with ${user.name || 'a fan'}.`

  // Add memory context if available
  if (memories.length > 0) {
    prompt += '\n\nRelevant context from previous conversations and fan interactions:'
    memories.forEach((memory, index) => {
      prompt += `\n${index + 1}. [${memory.kind}] ${memory.content}`
    })
  }

  prompt += '\n\nRespond naturally as the creator, using the context above to personalize your response.'

  return prompt
}

async function handleStreamingResponse(
  aiProvider: any,
  messages: any[],
  creator: any,
  chatId: string,
  userId: string,
  useAnthropic: boolean
) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullResponse = ''
        const persona = creator.defaultPersona

        if (useAnthropic) {
          // Anthropic streaming
          const stream = await aiProvider.messages.create({
            model: persona.modelName || 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            temperature: persona.temperature,
            messages: messages.filter(m => m.role !== 'system'),
            system: messages.find(m => m.role === 'system')?.content,
            stream: true,
          })

          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta') {
              const text = chunk.delta.text
              if (text) {
                fullResponse += text
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
              }
            }
          }
        } else {
          // OpenAI streaming
          const stream = await aiProvider.chat.completions.create({
            model: persona.modelName || 'gpt-4o-mini',
            messages,
            temperature: persona.temperature,
            max_tokens: 1000,
            stream: true,
          })

          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content
            if (text) {
              fullResponse += text
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }
        }

        // Save AI response to database
        await prisma.message.create({
          data: {
            chatId,
            senderId: creator.userId,
            sender: 'AI',
            text: fullResponse,
          },
        })

        // Update memories asynchronously
        updateMemoriesAsync(creator.id, userId, fullResponse, messages)

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        console.error('Streaming error:', error)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`))
        controller.close()
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

async function handleRegularResponse(
  aiProvider: any,
  messages: any[],
  creator: any,
  chatId: string,
  userId: string,
  useAnthropic: boolean
) {
  const persona = creator.defaultPersona
  let response

  if (useAnthropic) {
    // Anthropic regular response
    response = await aiProvider.messages.create({
      model: persona.modelName || 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: persona.temperature,
      messages: messages.filter(m => m.role !== 'system'),
      system: messages.find(m => m.role === 'system')?.content,
    })
    
    response = response.content[0].text
  } else {
    // OpenAI regular response
    const completion = await aiProvider.chat.completions.create({
      model: persona.modelName || 'gpt-4o-mini',
      messages,
      temperature: persona.temperature,
      max_tokens: 1000,
    })
    
    response = completion.choices[0].message.content
  }

  // Save AI response to database
  const aiMessage = await prisma.message.create({
    data: {
      chatId,
      senderId: creator.userId,
      sender: 'AI',
      text: response,
    },
  })

  // Update memories asynchronously
  updateMemoriesAsync(creator.id, userId, response, messages)

  return NextResponse.json({
    message: response,
    messageId: aiMessage.id,
  })
}

async function updateMemoriesAsync(
  creatorId: string,
  fanId: string,
  aiResponse: string,
  conversationHistory: any[]
) {
  try {
    // Store conversation summary if conversation is getting long
    if (conversationHistory.length >= MAX_CONTEXT_MESSAGES) {
      const summary = `Recent conversation themes: ${aiResponse.substring(0, 200)}...`
      await storeConversationSummary(creatorId, `fan_${fanId}`, summary)
    }

    // Extract and store fan profile insights
    const profileInsights = extractFanInsights(conversationHistory, aiResponse)
    if (profileInsights) {
      await storeFanProfile(creatorId, fanId, profileInsights)
    }
  } catch (error) {
    console.error('Memory update error:', error)
    // Don't fail the main response for memory errors
  }
}

function extractFanInsights(conversationHistory: any[], aiResponse: string): string | null {
  // Simple heuristic to extract fan preferences/interests
  // In production, this could use a separate AI call or more sophisticated analysis
  
  const userMessages = conversationHistory
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content)
    .join(' ')

  if (userMessages.length < 50) {
    return null
  }

  // Extract topics mentioned by fan
  const topics: string[] = []
  const keywords = ['love', 'like', 'enjoy', 'interested', 'want', 'need', 'prefer']
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`${keyword}\\s+([^.!?]+)`, 'gi')
    const matches = userMessages.match(regex)
    if (matches) {
      topics.push(...matches)
    }
  })

  return topics.length > 0 
    ? `Fan interests: ${topics.slice(0, 3).join(', ')}`
    : null
}