// Simple authentication system for CreatorChat Hub
// In production, this would integrate with NextAuth.js or similar

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'creator'
  image?: string
}

// Mock users for demonstration (replace with real auth in production)
const mockUsers: User[] = [
  { id: '1', email: 'admin@creatorhub.com', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'jess@creatorhub.com', name: 'Jess Williams', role: 'creator', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=400&h=400&fit=crop' },
  { id: '3', email: 'fan1@example.com', name: 'Alex Chen', role: 'user', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
  { id: '4', email: 'fan2@example.com', name: 'Sarah Johnson', role: 'user', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' },
]

export function getCurrentUser(): User | null {
  // In production, this would get user from session/JWT token
  // For demo purposes, return the admin user
  return mockUsers[0]
}

export function getUserByEmail(email: string): User | null {
  return mockUsers.find(user => user.email === email) || null
}

export function getUserById(id: string): User | null {
  return mockUsers.find(user => user.id === id) || null
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin'
}

export function isCreator(user: User | null): boolean {
  return user?.role === 'creator'
}

export function requireAuth(): User {
  const user = getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export function requireAdmin(): User {
  const user = getCurrentUser()
  if (!user || !isAdmin(user)) {
    throw new Error('Admin access required')
  }
  return user
}

export function requireCreator(): User {
  const user = getCurrentUser()
  if (!user || !isCreator(user)) {
    throw new Error('Creator access required')
  }
  return user
}

export function getAllUsers(): User[] {
  return mockUsers
}

export function updateUserRole(userId: string, newRole: User['role']): boolean {
  const userIndex = mockUsers.findIndex(user => user.id === userId)
  if (userIndex !== -1) {
    mockUsers[userIndex].role = newRole
    return true
  }
  return false
}

// Simple session simulation (replace with real session management)
export function createSession(user: User): string {
  // In production, create JWT or session cookie
  return `session_${user.id}_${Date.now()}`
}

export function validateSession(sessionId: string): User | null {
  // In production, validate JWT or session
  // For demo, just return current user
  return getCurrentUser()
}