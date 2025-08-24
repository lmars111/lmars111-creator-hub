import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

// Mock content data - in a real app, this would be in a database
const mockContent = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    author: 'Content Creator',
    type: 'course' as const,
    status: 'published' as 'published' | 'pending' | 'flagged' | 'removed',
    createdAt: '2024-01-15T10:00:00Z',
    views: 1250,
    reports: 0,
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    author: 'Content Creator',
    type: 'video' as const,
    status: 'published' as 'published' | 'pending' | 'flagged' | 'removed',
    createdAt: '2024-01-14T14:30:00Z',
    views: 980,
    reports: 2,
  },
  {
    id: '3',
    title: 'Building Better UIs',
    author: 'Regular User',
    type: 'article' as const,
    status: 'pending' as 'published' | 'pending' | 'flagged' | 'removed',
    createdAt: '2024-01-13T09:15:00Z',
    views: 0,
    reports: 0,
  },
  {
    id: '4',
    title: 'Design System Guidelines',
    author: 'Content Creator',
    type: 'article' as const,
    status: 'flagged' as 'published' | 'pending' | 'flagged' | 'removed',
    createdAt: '2024-01-12T16:45:00Z',
    views: 560,
    reports: 5,
  },
  {
    id: '5',
    title: 'Photography Masterclass',
    author: 'Content Creator',
    type: 'image' as const,
    status: 'published' as 'published' | 'pending' | 'flagged' | 'removed',
    createdAt: '2024-01-11T11:20:00Z',
    views: 2100,
    reports: 1,
  },
];

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const user = requireAdmin();
    
    return NextResponse.json({ content: mockContent });
  } catch (error) {
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    const user = requireAdmin();
    
    const body = await request.json();
    const { contentId, action } = body;
    
    if (!contentId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: contentId, action' },
        { status: 400 }
      );
    }
    
    if (!['approve', 'flag', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be approve, flag, or remove' },
        { status: 400 }
      );
    }
    
    const contentIndex = mockContent.findIndex(item => item.id === contentId);
    
    if (contentIndex === -1) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    // Update content status based on action
    switch (action) {
      case 'approve':
        mockContent[contentIndex].status = 'published';
        break;
      case 'flag':
        mockContent[contentIndex].status = 'flagged';
        break;
      case 'remove':
        mockContent[contentIndex].status = 'removed';
        break;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Content ${action}d successfully`,
      content: mockContent[contentIndex]
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}