import { NextResponse } from 'next/server';
import { isValidSession } from '@/lib/getSessionCreator';
import type { LockedContent } from '@/lib/types';

// In-memory storage for demo purposes
let contentStorage: LockedContent[] = [
  {
    id: 'content-001',
    title: 'Advanced React Patterns',
    description: 'Learn advanced React patterns including render props, compound components, and custom hooks.',
    content: 'This is the detailed content about advanced React patterns...',
    price: 29.99,
    currency: 'USD',
    unlockCount: 15,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'content-002',
    title: 'TypeScript Best Practices',
    description: 'Comprehensive guide to TypeScript best practices for large applications.',
    content: 'TypeScript best practices include...',
    price: 19.99,
    currency: 'USD',
    unlockCount: 8,
    createdAt: '2024-01-10T15:30:00Z',
    updatedAt: '2024-01-10T15:30:00Z'
  }
];

export async function GET() {
  if (!isValidSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(contentStorage);
}

export async function POST(request: Request) {
  if (!isValidSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, content, price } = body;

    if (!title || !description || !content || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newContent: LockedContent = {
      id: `content-${Date.now()}`,
      title,
      description,
      content,
      price: parseFloat(price),
      currency: 'USD',
      unlockCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    contentStorage.push(newContent);
    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}