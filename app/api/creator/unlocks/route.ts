import { NextResponse } from 'next/server';
import { isValidSession } from '@/lib/getSessionCreator';
import type { UnlockEvent } from '@/lib/types';

export async function GET() {
  if (!isValidSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo data - recent unlocks
  const unlocks: UnlockEvent[] = [
    {
      id: 'unlock-001',
      userId: 'user-123',
      userName: 'Alex Thompson',
      contentId: 'content-001',
      contentTitle: 'Advanced React Patterns',
      amount: 29.99,
      currency: 'USD',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      id: 'unlock-002',
      userId: 'user-456',
      userName: 'Sarah Wilson',
      contentId: 'content-002',
      contentTitle: 'TypeScript Best Practices',
      amount: 19.99,
      currency: 'USD',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
    },
    {
      id: 'unlock-003',
      userId: 'user-789',
      userName: 'Mike Johnson',
      contentId: 'content-003',
      contentTitle: 'Next.js Performance Tips',
      amount: 24.99,
      currency: 'USD',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ];

  return NextResponse.json(unlocks);
}