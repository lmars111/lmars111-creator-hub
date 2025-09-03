import { config } from '@/lib/config'

export interface MemoryEntry {
  id: string
  kind: 'PROFILE' | 'LONG_TERM' | 'CONVERSATION_SUMMARY'
  content: string
  createdAt: Date
  similarity?: number
}

export interface MemoryStore {
  upsert(creatorId: string, kind: string, content: string, externalRef?: string): Promise<string>
  retrieve(creatorId: string, query: string, limit?: number): Promise<MemoryEntry[]>
  delete(creatorId: string, memoryId: string): Promise<void>
  clear(creatorId: string): Promise<void>
}

// Initialize OpenAI for embeddings if available
let openai: any = null
try {
  if (config.ai.openai.enabled) {
    const OpenAI = require('openai')
    openai = new OpenAI({
      apiKey: config.ai.openai.apiKey,
    })
  }
} catch (error) {
  console.warn('OpenAI not available for embeddings')
}

export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!openai) {
    return null
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    return null
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}