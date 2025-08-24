import { NextResponse } from 'next/server';
import { isValidSession } from '@/lib/getSessionCreator';

// This would normally import from the same storage as the main content route
// For demo purposes, we'll replicate the storage logic
let contentStorage = [
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isValidSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, content, price } = body;
    const { id } = await params;

    const contentIndex = contentStorage.findIndex(c => c.id === id);
    if (contentIndex === -1) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const updatedContent = {
      ...contentStorage[contentIndex],
      ...(title && { title }),
      ...(description && { description }),
      ...(content && { content }),
      ...(price && { price: parseFloat(price) }),
      updatedAt: new Date().toISOString()
    };

    contentStorage[contentIndex] = updatedContent;
    return NextResponse.json(updatedContent);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isValidSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const contentIndex = contentStorage.findIndex(c => c.id === id);
  
  if (contentIndex === -1) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 });
  }

  contentStorage.splice(contentIndex, 1);
  return NextResponse.json({ message: 'Content deleted successfully' });
}