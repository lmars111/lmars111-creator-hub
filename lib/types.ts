export interface Creator {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  verified: boolean;
  createdAt: string;
}

export interface EarningsSummary {
  today: number;
  sevenDays: number;
  thirtyDays: number;
  currency: string;
}

export interface UnlockEvent {
  id: string;
  userId: string;
  userName: string;
  contentId: string;
  contentTitle: string;
  amount: number;
  currency: string;
  timestamp: string;
}

export interface LockedContent {
  id: string;
  title: string;
  description: string;
  content: string;
  price: number;
  currency: string;
  unlockCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIConfig {
  id: string;
  personality: string;
  tone: string;
  topics: string[];
  responseLength: 'short' | 'medium' | 'long';
  creativity: number; // 0-100
  updated: string;
}