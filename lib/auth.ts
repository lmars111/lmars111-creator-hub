// Simple mock authentication for admin users
// In a real app, this would integrate with your auth provider
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'creator';
}

// Mock users for demonstration
const mockUsers: User[] = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'user@example.com', name: 'Regular User', role: 'user' },
  { id: '3', email: 'creator@example.com', name: 'Content Creator', role: 'creator' },
];

export function getCurrentUser(): User | null {
  // In a real app, this would get user from session/token
  // For demo purposes, return admin user
  return mockUsers[0];
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

export function requireAdmin(): User {
  const user = getCurrentUser();
  if (!user || !isAdmin(user)) {
    throw new Error('Admin access required');
  }
  return user;
}

export function getAllUsers(): User[] {
  return mockUsers;
}

export function getUserById(id: string): User | null {
  return mockUsers.find(user => user.id === id) || null;
}

export function updateUserRole(userId: string, newRole: User['role']): boolean {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex].role = newRole;
    return true;
  }
  return false;
}