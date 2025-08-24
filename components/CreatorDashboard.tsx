'use client';

import { useState, useEffect } from 'react';
import type { EarningsSummary, UnlockEvent, LockedContent } from '@/lib/types';
import ContentEditor from './ContentEditor';
import AIPersonaForm from './AIPersonaForm';

export default function CreatorDashboard() {
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [unlocks, setUnlocks] = useState<UnlockEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'ai'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/creator/earnings').then(res => res.json()),
      fetch('/api/creator/unlocks').then(res => res.json())
    ]).then(([earningsData, unlocksData]) => {
      setEarnings(earningsData);
      setUnlocks(unlocksData);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load dashboard data:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, Jess!</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'content', label: 'Content' },
              { id: 'ai', label: 'AI Persona' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Earnings Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Earnings Summary</h2>
              {earnings && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${earnings.today.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Today</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${earnings.sevenDays.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Last 7 Days</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      ${earnings.thirtyDays.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Last 30 Days</div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Unlocks */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Unlocks</h2>
              <div className="space-y-4">
                {unlocks.map((unlock) => (
                  <div key={unlock.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{unlock.contentTitle}</div>
                      <div className="text-sm text-gray-600">
                        Unlocked by {unlock.userName} • {new Date(unlock.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      ${unlock.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && <ContentEditor />}
        {activeTab === 'ai' && <AIPersonaForm />}
      </div>
    </div>
  );
}