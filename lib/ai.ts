import OpenAI from 'openai'

// Initialize OpenAI client conditionally
let openai: OpenAI | null = null

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
} catch (error) {
  console.warn('OpenAI not available during build')
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionOptions {
  model?: 'gpt-4' | 'gpt-3.5-turbo'
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export async function createChatCompletion(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
) {
  if (!openai) {
    throw new Error('OpenAI not configured')
  }

  const {
    model = 'gpt-4',
    temperature = 0.7,
    max_tokens = 1000,
    stream = false,
  } = options

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
      stream,
    })

    return completion
  } catch (error) {
    // Fallback to GPT-3.5 if GPT-4 fails
    if (model === 'gpt-4') {
      console.warn('GPT-4 failed, falling back to GPT-3.5-turbo:', error)
      
      return await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        temperature,
        max_tokens,
        stream,
      })
    }
    
    throw error
  }
}

export async function createStreamingChatCompletion(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
) {
  if (!openai) {
    throw new Error('OpenAI not configured')
  }

  const {
    model = 'gpt-4',
    temperature = 0.7,
    max_tokens = 1000,
  } = options

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
      stream: true,
    })

    return stream
  } catch (error) {
    // Fallback to GPT-3.5 if GPT-4 fails
    if (model === 'gpt-4') {
      console.warn('GPT-4 failed, falling back to GPT-3.5-turbo:', error)
      
      return await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        temperature,
        max_tokens,
        stream: true,
      })
    }
    
    throw error
  }
}

export async function moderateContent(text: string) {
  if (!openai) {
    console.warn('OpenAI not configured, skipping moderation')
    return { flagged: false, categories: {} }
  }

  try {
    const moderation = await openai.moderations.create({
      input: text,
    })

    const result = moderation.results[0]
    return {
      flagged: result.flagged,
      categories: result.categories,
      category_scores: result.category_scores,
    }
  } catch (error) {
    console.error('Moderation error:', error)
    // Return safe result if moderation fails
    return { flagged: false, categories: {} }
  }
}

export function buildCreatorPersonaPrompt(creator: {
  displayName: string
  bio?: string
  aiConfig?: {
    personality?: string
    tone?: string
    topics?: string
  }
}): string {
  const personality = creator.aiConfig?.personality || 'friendly and engaging'
  const tone = creator.aiConfig?.tone || 'conversational'
  const topics = creator.aiConfig?.topics ? JSON.parse(creator.aiConfig.topics) : []

  return `You are ${creator.displayName}, a content creator.

Bio: ${creator.bio || 'A passionate content creator sharing my journey.'}

Personality: ${personality}
Communication style: ${tone}
${topics.length > 0 ? `Favorite topics: ${topics.join(', ')}` : ''}

Guidelines:
- Stay in character as ${creator.displayName}
- Be authentic and engaging
- Keep responses personal but appropriate
- If asked about content or media you can't see, mention that the fan can unlock visual content
- Encourage fans to subscribe or unlock premium content when relevant
- Never break character or mention you're an AI
- Keep responses under 150 words unless the conversation calls for more detail

Remember: You're here to provide a genuine connection experience for fans while maintaining appropriate boundaries.`
}

export const AI_MODELS = {
  GPT_4: 'gpt-4',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
} as const

export const DEFAULT_TEMPERATURE = 0.7
export const DEFAULT_MAX_TOKENS = 1000
export const MAX_CONTEXT_MESSAGES = 10 // Keep last 10 messages for context