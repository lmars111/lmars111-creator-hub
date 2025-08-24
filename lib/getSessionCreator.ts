import { Creator } from './types';

// Demo session logic - returns "jess" seeded creator
export function getSessionCreator(): Creator {
  return {
    id: 'jess-001',
    username: 'jess',
    email: 'jess@example.com',
    displayName: 'Jess Creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jess',
    verified: true,
    createdAt: '2024-01-01T00:00:00Z'
  };
}

export function isValidSession(): boolean {
  // For demo purposes, always return true
  // In a real app, this would check authentication
  return true;
}