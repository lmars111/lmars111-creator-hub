import { MemoryStore } from './base'
import { VectorMemory } from './vector'
import { PrismaMemory } from './prisma'
import { config } from '@/lib/config'

// Memory factory that chooses implementation based on configuration
export function createMemoryStore(): MemoryStore {
  // Prefer vector memory if Supabase is configured
  if (config.supabase.enabled) {
    try {
      return new VectorMemory()
    } catch (error) {
      console.warn('Vector memory not available, falling back to Prisma:', error)
    }
  }

  // Fallback to Prisma memory
  return new PrismaMemory()
}

// Helper functions for memory management
export async function storeConversationSummary(
  creatorId: string,
  chatId: string,
  summary: string
): Promise<string> {
  const memoryStore = createMemoryStore()
  return memoryStore.upsert(
    creatorId,
    'CONVERSATION_SUMMARY',
    summary,
    `chat_${chatId}`
  )
}

export async function storeFanProfile(
  creatorId: string,
  fanId: string,
  profileInfo: string
): Promise<string> {
  const memoryStore = createMemoryStore()
  return memoryStore.upsert(
    creatorId,
    'PROFILE',
    profileInfo,
    `fan_${fanId}`
  )
}

export async function storeLongTermMemory(
  creatorId: string,
  insight: string,
  category?: string
): Promise<string> {
  const memoryStore = createMemoryStore()
  const externalRef = category ? `insight_${category}_${Date.now()}` : undefined
  return memoryStore.upsert(
    creatorId,
    'LONG_TERM',
    insight,
    externalRef
  )
}

export async function retrieveRelevantMemories(
  creatorId: string,
  context: string,
  limit: number = 5
): Promise<any[]> {
  const memoryStore = createMemoryStore()
  return memoryStore.retrieve(creatorId, context, limit)
}

export async function clearCreatorMemories(creatorId: string): Promise<void> {
  const memoryStore = createMemoryStore()
  return memoryStore.clear(creatorId)
}