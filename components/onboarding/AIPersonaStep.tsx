'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Bot, MessageCircle } from 'lucide-react'

interface AIPersonaStepProps {
  data: {
    tone: string
    personality: string
    topics: string[]
    nsfwEnabled: boolean
    systemPrompt?: string
  }
  onComplete: (data: any) => void
  onNext: () => void
}

const TONE_OPTIONS = [
  { value: 'conversational', label: 'Conversational', desc: 'Friendly and casual' },
  { value: 'professional', label: 'Professional', desc: 'Polite and formal' },
  { value: 'playful', label: 'Playful', desc: 'Fun and energetic' },
  { value: 'sultry', label: 'Sultry', desc: 'Mysterious and alluring' },
]

const TOPIC_OPTIONS = [
  'Fitness & Health', 'Fashion & Beauty', 'Travel', 'Food & Cooking', 
  'Gaming', 'Art & Creativity', 'Music', 'Technology', 'Lifestyle',
  'Business', 'Personal Development', 'Entertainment'
]

export default function AIPersonaStep({ data, onComplete, onNext }: AIPersonaStepProps) {
  const [formData, setFormData] = useState(data)

  const isValid = formData.personality.trim().length >= 10

  const handleTopicToggle = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }))
  }

  const handleContinue = () => {
    if (isValid) {
      onComplete(formData)
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Bot className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Chat Personality</h3>
        <p className="text-gray-600">
          Customize how your AI will chat with fans when you're not available.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Communication Tone</Label>
          <div className="grid grid-cols-2 gap-3">
            {TONE_OPTIONS.map((option) => (
              <Card 
                key={option.value}
                className={`cursor-pointer border-2 transition-colors ${
                  formData.tone === option.value 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, tone: option.value }))}
              >
                <CardContent className="p-4 text-center">
                  <h4 className="font-medium text-gray-900">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="personality" className="text-base font-medium">Personality Description</Label>
          <Textarea
            id="personality"
            value={formData.personality}
            onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
            placeholder="Describe your personality and how you like to interact with fans..."
            className="mt-2 min-h-[100px]"
            maxLength={300}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formData.personality.trim().length < 10 ? 'Please add at least 10 characters' : ''}</span>
            <span>{formData.personality.length}/300</span>
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Favorite Topics</Label>
          <div className="grid grid-cols-3 gap-2">
            {TOPIC_OPTIONS.map((topic) => (
              <Badge
                key={topic}
                variant={formData.topics.includes(topic) ? "default" : "outline"}
                className="cursor-pointer justify-center py-2"
                onClick={() => handleTopicToggle(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Selected: {formData.topics.length} topics
          </p>
        </div>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="nsfw" className="font-medium">Adult Content</Label>
                <p className="text-sm text-gray-600">Allow AI to discuss adult topics (still filtered for safety)</p>
              </div>
              <Switch
                id="nsfw"
                checked={formData.nsfwEnabled}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, nsfwEnabled: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">AI Preview</h4>
                <p className="text-sm text-blue-800 mt-1">
                  "Hi! I'm excited to chat with you. I love {formData.topics.slice(0, 2).join(' and ')} 
                  {formData.topics.length > 2 ? ' and more' : ''}. 
                  I have a {formData.tone} personality and I'm {formData.personality.split(' ').slice(0, 5).join(' ')}..."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue} 
          disabled={!isValid}
          className="px-8"
        >
          Continue to Payout Setup
        </Button>
      </div>
    </div>
  )
}