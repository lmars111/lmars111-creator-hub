'use client';

import { useState, useEffect } from 'react';
import type { LockedContent } from '@/lib/types';

export default function ContentEditor() {
  const [content, setContent] = useState<LockedContent[]>([]);
  const [editingContent, setEditingContent] = useState<LockedContent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    price: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch('/api/creator/content');
      const data = await response.json();
      setContent(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load content:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingContent 
        ? `/api/creator/content/${editingContent.id}`
        : '/api/creator/content';
      
      const method = editingContent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadContent();
        setShowForm(false);
        setEditingContent(null);
        setFormData({ title: '', description: '', content: '', price: '' });
      }
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };

  const handleEdit = (item: LockedContent) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      description: item.description,
      content: item.content,
      price: item.price.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      const response = await fetch(`/api/creator/content/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await loadContent();
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingContent(null);
    setFormData({ title: '', description: '', content: '', price: '' });
  };

  if (loading) {
    return <div className="text-center py-8">Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Locked Content</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Content
        </button>
      </div>

      {/* Content Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingContent ? 'Edit Content' : 'Create New Content'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingContent ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="space-y-4">
            {content.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>${item.price}</span>
                      <span>{item.unlockCount} unlocks</span>
                      <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {content.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No content created yet. Click "Add New Content" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}