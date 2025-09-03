'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Image, Upload, X, User } from 'lucide-react'

interface ProfileStepProps {
  data: {
    displayName: string
    bio: string
    avatarUrl?: string
    coverUrl?: string
    socialLinks: {
      instagram?: string
      twitter?: string
      youtube?: string
      tiktok?: string
    }
  }
  onComplete: (data: any) => void
  onNext: () => void
}

export default function ProfileStep({ data, onComplete, onNext }: ProfileStepProps) {
  const [formData, setFormData] = useState(data)
  const [uploading, setUploading] = useState<'avatar' | 'cover' | null>(null)

  const isValid = formData.displayName.trim().length >= 2 && formData.bio.trim().length >= 10

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }))
  }

  const handleFileUpload = async (file: File, type: 'avatar' | 'cover') => {
    setUploading(type)
    try {
      // Get signed upload URL
      const signResponse = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          contentLength: file.size,
          uploadType: type,
        }),
      })

      const signData = await signResponse.json()
      if (!signData.success) {
        throw new Error(signData.error)
      }

      // Upload file to S3
      const uploadResponse = await fetch(signData.data.signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      // Update form data with public URL
      const field = type === 'avatar' ? 'avatarUrl' : 'coverUrl'
      setFormData(prev => ({ ...prev, [field]: signData.data.publicUrl }))

    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload ${type}. Please try again.`)
    } finally {
      setUploading(null)
    }
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
        <User className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Creator Profile</h3>
        <p className="text-gray-600">
          Set up your profile to help fans discover and connect with you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Avatar Upload */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium text-gray-900 mb-2 block">Profile Picture</Label>
            <div className="relative">
              {formData.avatarUrl ? (
                <div className="relative w-32 h-32 mx-auto">
                  <img 
                    src={formData.avatarUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover rounded-full border-4 border-purple-200"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, avatarUrl: undefined }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-purple-400">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, 'avatar')
                    }}
                    disabled={uploading !== null}
                  />
                </label>
              )}
              {uploading === 'avatar' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cover Image Upload */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium text-gray-900 mb-2 block">Cover Image</Label>
            <div className="relative">
              {formData.coverUrl ? (
                <div className="relative">
                  <img 
                    src={formData.coverUrl} 
                    alt="Cover" 
                    className="w-full h-32 object-cover rounded-lg border-2 border-purple-200"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, coverUrl: undefined }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400">
                  <Image className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Upload Cover</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, 'cover')
                    }}
                    disabled={uploading !== null}
                  />
                </label>
              )}
              {uploading === 'cover' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="displayName">Display Name *</Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            placeholder="Your creator name"
            className="mt-1"
          />
          {formData.displayName.trim().length > 0 && formData.displayName.trim().length < 2 && (
            <p className="text-sm text-red-600 mt-1">Display name must be at least 2 characters</p>
          )}
        </div>

        <div>
          <Label htmlFor="bio">Bio *</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell your fans about yourself, what content you create, and what they can expect..."
            className="mt-1 min-h-[100px]"
            maxLength={500}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formData.bio.trim().length < 10 ? 'Bio must be at least 10 characters' : ''}</span>
            <span>{formData.bio.length}/500</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.socialLinks.instagram || ''}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
              placeholder="@username"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter/X</Label>
            <Input
              id="twitter"
              value={formData.socialLinks.twitter || ''}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              placeholder="@username"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="youtube">YouTube</Label>
            <Input
              id="youtube"
              value={formData.socialLinks.youtube || ''}
              onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
              placeholder="Channel URL or @handle"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tiktok">TikTok</Label>
            <Input
              id="tiktok"
              value={formData.socialLinks.tiktok || ''}
              onChange={(e) => handleSocialLinkChange('tiktok', e.target.value)}
              placeholder="@username"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue} 
          disabled={!isValid}
          className="px-8"
        >
          Continue to Pricing
        </Button>
      </div>
    </div>
  )
}