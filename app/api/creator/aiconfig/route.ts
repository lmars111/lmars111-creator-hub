import { NextResponse } from 'next/server';
import { isValidSession } from '@/lib/getSessionCreator';
import type { AIConfig } from '@/lib/types';

// In-memory storage for demo
let aiConfig: AIConfig = {
  id: 'ai-config-jess',
  personality: 'friendly and encouraging',
  tone: 'conversational',
  topics: ['web development', 'React', 'TypeScript', 'JavaScript'],
  responseLength: 'medium',
  creativity: 75,
  updated: '2024-01-01T00:00:00Z'
};

export async function GET() {
  if (!isValidSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(aiConfig);
}

export async function PUT(request: Request) {
  if (!isValidSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { personality, tone, topics, responseLength, creativity } = body;

    aiConfig = {
      ...aiConfig,
      ...(personality && { personality }),
      ...(tone && { tone }),
      ...(topics && { topics }),
      ...(responseLength && { responseLength }),
      ...(creativity !== undefined && { creativity: parseInt(creativity) }),
      updated: new Date().toISOString()
    };

    return NextResponse.json(aiConfig);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}