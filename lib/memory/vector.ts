import { MemoryStore, MemoryEntry, generateEmbedding } from './base'
import { config } from '@/lib/config'

// Initialize Supabase client conditionally
let supabase: any = null
try {
  if (config.supabase.enabled) {
    const { createClient } = require('@supabase/supabase-js')
    supabase = createClient(config.supabase.url!, config.supabase.anonKey!)
  }
} catch (error) {
  console.warn('Supabase not available during build')
}

export class VectorMemory implements MemoryStore {
  private tableName = 'creator_memories'

  constructor() {
    if (!supabase) {
      throw new Error('Supabase not configured for vector memory')
    }
  }

  async upsert(
    creatorId: string,
    kind: string,
    content: string,
    externalRef?: string
  ): Promise<string> {
    // Generate embedding
    const embedding = await generateEmbedding(content)
    if (!embedding) {
      throw new Error('Failed to generate embedding')
    }

    // Upsert into Supabase
    const { data, error } = await supabase
      .from(this.tableName)
      .upsert({
        creator_id: creatorId,
        kind,
        content,
        embedding,
        external_ref: externalRef,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'creator_id,external_ref',
        ignoreDuplicates: false,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase upsert error:', error)
      throw new Error('Failed to store memory')
    }

    return data.id
  }

  async retrieve(
    creatorId: string,
    query: string,
    limit: number = 5
  ): Promise<MemoryEntry[]> {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query)
    if (!queryEmbedding) {
      throw new Error('Failed to generate query embedding')
    }

    // Search for similar memories using pgvector
    const { data, error } = await supabase.rpc('match_memories', {
      creator_id: creatorId,
      query_embedding: queryEmbedding,
      match_threshold: 0.7, // Minimum similarity threshold
      match_count: limit,
    })

    if (error) {
      console.error('Supabase search error:', error)
      throw new Error('Failed to retrieve memories')
    }

    return data.map((row: any) => ({
      id: row.id,
      kind: row.kind,
      content: row.content,
      createdAt: new Date(row.created_at),
      similarity: row.similarity,
    }))
  }

  async delete(creatorId: string, memoryId: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('creator_id', creatorId)
      .eq('id', memoryId)

    if (error) {
      console.error('Supabase delete error:', error)
      throw new Error('Failed to delete memory')
    }
  }

  async clear(creatorId: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('creator_id', creatorId)

    if (error) {
      console.error('Supabase clear error:', error)
      throw new Error('Failed to clear memories')
    }
  }
}

// SQL function for Supabase (to be created in the database)
export const SUPABASE_MATCH_MEMORIES_FUNCTION = `
create or replace function match_memories (
  creator_id text,
  query_embedding vector(1536),
  match_threshold float,
  match_count int
) returns table (
  id text,
  kind text,
  content text,
  external_ref text,
  created_at timestamp,
  similarity float
) language sql stable as $$
  select
    id,
    kind,
    content,
    external_ref,
    created_at,
    1 - (embedding <=> query_embedding) as similarity
  from creator_memories
  where creator_id = creator_id
    and 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
`