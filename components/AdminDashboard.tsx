'use client'

import { useState } from 'react'
import { User } from '@/lib/auth'
import { BarChart, Users, DollarSign, Activity, Search, UserCheck, MessageSquare, Eye, Flag, CheckCircle, XCircle } from 'lucide-react'

interface AdminDashboardProps {
  user: User
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('analytics')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for the dashboard
  const analyticsData = {
    totalUsers: 1248,
    activeCreators: 23,
    totalRevenue: 45670,
    contentUnlocks: 3421,
    activeChats: 892,
    newSignups: 127,
  }

  const mockUsers = [
    { id: '1', name: 'Alex Chen', email: 'alex@example.com', role: 'user', status: 'active', joinDate: '2024-01-15' },
    { id: '2', name: 'Jess Williams', email: 'jess@creatorhub.com', role: 'creator', status: 'active', joinDate: '2024-01-10' },
    { id: '3', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user', status: 'active', joinDate: '2024-01-20' },
    { id: '4', name: 'Mike Davis', email: 'mike@example.com', role: 'user', status: 'suspended', joinDate: '2024-01-18' },
  ]

  const mockContent = [
    { id: '1', title: 'Morning Routine Tips', creator: 'Jess Williams', type: 'video', status: 'published', reports: 0, views: 245 },
    { id: '2', title: 'Wellness Wednesday', creator: 'Jess Williams', type: 'article', status: 'published', reports: 1, views: 180 },
    { id: '3', title: 'Behind the Scenes', creator: 'Jess Williams', type: 'image', status: 'pending', reports: 0, views: 0 },
    { id: '4', title: 'Workout Routine', creator: 'Alex Fitness', type: 'course', status: 'flagged', reports: 3, views: 89 },
  ]

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredContent = mockContent.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.creator.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Admin Panel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'analytics', label: 'Analytics', icon: BarChart },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'content', label: 'Content Oversight', icon: MessageSquare },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="admin-card">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${analyticsData.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Content Unlocks</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.contentUnlocks.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Creators</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.activeCreators}</p>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-pink-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Chats</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.activeChats.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-indigo-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">New Signups (30d)</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.newSignups}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">User Management</h2>
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <li key={user.id}>
                    <div className="px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'creator' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                        <button className="text-purple-600 hover:text-purple-900 text-sm font-medium">
                          Edit
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Content Oversight</h2>
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredContent.map((content) => (
                  <li key={content.id}>
                    <div className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {content.type === 'video' && <span className="text-2xl">🎥</span>}
                            {content.type === 'article' && <span className="text-2xl">📄</span>}
                            {content.type === 'image' && <span className="text-2xl">🖼️</span>}
                            {content.type === 'course' && <span className="text-2xl">📚</span>}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{content.title}</div>
                            <div className="text-sm text-gray-500">by {content.creator}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-900">{content.views} views</div>
                            <div className="text-sm text-gray-500">{content.reports} reports</div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            content.status === 'published' ? 'bg-green-100 text-green-800' :
                            content.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            content.status === 'flagged' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {content.status}
                          </span>
                          <div className="flex space-x-2">
                            <button className="text-green-600 hover:text-green-900">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <XCircle className="h-4 w-4" />
                            </button>
                            <button className="text-orange-600 hover:text-orange-900">
                              <Flag className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}