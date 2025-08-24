'use client';

import { useState, useEffect } from 'react';
import type { AIConfig } from '@/lib/types';

export default function AIPersonaForm() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [formData, setFormData] = useState({
    personality: '',
    tone: '',
    topics: [] as string[],
    responseLength: 'medium' as 'short' | 'medium' | 'long',
    creativity: 50
  });
  const [newTopic, setNewTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/creator/aiconfig');
      const data = await response.json();
      setConfig(data);
      setFormData({
        personality: data.personality,
        tone: data.tone,
        topics: data.topics,
        responseLength: data.responseLength,
        creativity: data.creativity
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to load AI config:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/creator/aiconfig', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedConfig = await response.json();
        setConfig(updatedConfig);
      }
    } catch (error) {
      console.error('Failed to save AI config:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTopic = () => {
    if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
      setFormData({
        ...formData,
        topics: [...formData.topics, newTopic.trim()]
      });
      setNewTopic('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter(topic => topic !== topicToRemove)
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading AI configuration...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Persona Configuration</h2>
        <p className="text-gray-600 mt-2">
          Customize how your AI persona responds to users and interacts with your content.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personality
            </label>
            <textarea
              value={formData.personality}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your AI persona's personality (e.g., friendly and encouraging, professional but approachable...)"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Communication Tone
            </label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="conversational">Conversational</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="educational">Educational</option>
            </select>
          </div>

          {/* Topics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expertise Topics
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a topic (e.g., React, TypeScript, Web Development)"
                />
                <button
                  type="button"
                  onClick={addTopic}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{topic}</span>
                    <button
                      type="button"
                      onClick={() => removeTopic(topic)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Response Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Length
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'short', label: 'Short', desc: 'Concise responses' },
                { value: 'medium', label: 'Medium', desc: 'Balanced detail' },
                { value: 'long', label: 'Long', desc: 'Detailed explanations' }
              ].map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="responseLength"
                    value={option.value}
                    checked={formData.responseLength === option.value}
                    onChange={(e) => setFormData({ ...formData, responseLength: e.target.value as any })}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg text-center ${
                    formData.responseLength === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Creativity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Creativity Level: {formData.creativity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.creativity}
              onChange={(e) => setFormData({ ...formData, creativity: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save AI Configuration'}
            </button>
          </div>
        </form>

        {/* Last Updated */}
        {config && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: {new Date(config.updated).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}