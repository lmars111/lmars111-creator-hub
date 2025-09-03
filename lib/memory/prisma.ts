import { MemoryStore, MemoryEntry, generateEmbedding, cosineSimilarity } from './base'

// Initialize Prisma conditionally
let prisma: any = null
try {
  const { prisma: prismaClient } = require('@/lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.warn('Prisma not available during build')
}

export class PrismaMemory implements MemoryStore {
  private embeddings: Map<string, number[]> = new Map()

  constructor() {
    if (!prisma) {
      throw new Error('Prisma not available for memory storage')
    }
  }

  async upsert(
    creatorId: string,
    kind: string,
    content: string,
    externalRef?: string
  ): Promise<string> {
    // Generate embedding for similarity search
    const embedding = await generateEmbedding(content)
    
    let memory
    if (externalRef) {
      // Update existing memory by external reference
      memory = await prisma.memory.upsert({
        where: {
          creatorId_externalRef: {
            creatorId,
            externalRef,
          },
        },
        update: {
          content,
          kind,
        },
        create: {
          creatorId,
          kind,
          content,
          externalRef,
        },
      })
    } else {
      // Create new memory
      memory = await prisma.memory.create({
        data: {
          creatorId,
          kind,
          content,
          externalRef,
        },
      })
    }

    // Store embedding in memory for similarity search
    if (embedding) {
      this.embeddings.set(memory.id, embedding)
    }

    return memory.id
  }

  async retrieve(
    creatorId: string,
    query: string,
    limit: number = 5
  ): Promise<MemoryEntry[]> {
    // Get all memories for the creator
    const memories = await prisma.memory.findMany({
      where: { creatorId },
      orderBy: { createdAt: 'desc' },
    })

    if (memories.length === 0) {
      return []
    }

    // If we have OpenAI available, use semantic similarity
    const queryEmbedding = await generateEmbedding(query)
    if (queryEmbedding) {
      const memoriesWithSimilarity = []

      for (const memory of memories) {
        let similarity = 0

        // Try to get embedding from cache or generate it
        let memoryEmbedding = this.embeddings.get(memory.id)
        if (!memoryEmbedding) {
          const generatedEmbedding = await generateEmbedding(memory.content)
          if (generatedEmbedding) {
            memoryEmbedding = generatedEmbedding
            this.embeddings.set(memory.id, memoryEmbedding)
          }
        }

        if (memoryEmbedding) {
          similarity = cosineSimilarity(queryEmbedding, memoryEmbedding)
        }

        memoriesWithSimilarity.push({
          ...memory,
          similarity,
        })
      }

      // Sort by similarity and return top results
      return memoriesWithSimilarity
        .filter(m => m.similarity > 0.7) // Minimum similarity threshold
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map(m => ({
          id: m.id,
          kind: m.kind,
          content: m.content,
          createdAt: m.createdAt,
          similarity: m.similarity,
        }))
    }

    // Fallback to text search and recency
    const queryLower = query.toLowerCase()
    const relevantMemories = memories
      .filter((memory: any) => 
        memory.content.toLowerCase().includes(queryLower) ||
        memory.kind.toLowerCase().includes(queryLower)
      )
      .slice(0, limit)

    if (relevantMemories.length < limit) {
      // Fill remaining slots with most recent memories
      const remaining = limit - relevantMemories.length
      const recentMemories = memories
        .filter((memory: any) => !relevantMemories.some((rm: any) => rm.id === memory.id))
        .slice(0, remaining)
      
      relevantMemories.push(...recentMemories)
    }

    return relevantMemories.map((memory: any) => ({
      id: memory.id,
      kind: memory.kind,
      content: memory.content,
      createdAt: memory.createdAt,
    }))
  }

  async delete(creatorId: string, memoryId: string): Promise<void> {
    await prisma.memory.deleteMany({
      where: {
        id: memoryId,
        creatorId,
      },
    })

    // Clean up embedding cache
    this.embeddings.delete(memoryId)
  }

  async clear(creatorId: string): Promise<void> {
    const memories = await prisma.memory.findMany({
      where: { creatorId },
      select: { id: true },
    })

    await prisma.memory.deleteMany({
      where: { creatorId },
    })

    // Clean up embedding cache
    memories.forEach((memory: any) => {
      this.embeddings.delete(memory.id)
    })
  }

  // Add compound index for better performance
  async ensureIndexes() {
    // This would typically be done in a migration
    // Adding here for documentation
    try {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_memory_creator_external 
        ON memories(creator_id, external_ref);
      `
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_memory_creator_kind 
        ON memories(creator_id, kind);
      `
    } catch (error) {
      console.warn('Index creation failed (may already exist):', error)
    }
  }
}