'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, Eye, EyeOff, DollarSign, Lock } from 'lucide-react'

interface PostUploadData {
  title: string
  content: string
  price: number
  files: File[]
  type: 'image' | 'video' | 'text'
}

interface PostUploadFormProps {
  onSubmit: (data: PostUploadData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export default function PostUploadForm({ onSubmit, onCancel, isLoading = false }: PostUploadFormProps) {
  const [formData, setFormData] = useState<PostUploadData>({
    title: '',
    content: '',
    price: 10,
    files: [],
    type: 'text'
  })
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...formData.files, ...acceptedFiles]
    setFormData(prev => ({ 
      ...prev, 
      files: newFiles,
      type: acceptedFiles[0]?.type.startsWith('video/') ? 'video' : 'image'
    }))

    // Create preview URLs
    const newUrls = acceptedFiles.map(file => URL.createObjectURL(file))
    setPreviewUrls(prev => [...prev, ...newUrls])
  }, [formData.files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov']
    },
    maxFiles: 5
  })

  const removeFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)
    
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index])
    
    setFormData(prev => ({ ...prev, files: newFiles }))
    setPreviewUrls(newUrls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }

    if (!formData.content.trim() && formData.files.length === 0) {
      alert('Please add content or upload media')
      return
    }

    try {
      await onSubmit(formData)
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        price: 10,
        files: [],
        type: 'text'
      })
      setPreviewUrls([])
      setShowPreview(false)
    } catch (error) {
      console.error('Failed to upload post:', error)
    }
  }

  const estimatedEarnings = formData.price * 0.8 // 80% after platform fee

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
        <CardDescription>
          Share exclusive content with your fans. Content will be blurred until unlocked.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Post Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your post an engaging title..."
              className="mt-1"
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content Description</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Describe your content or add text content..."
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Unlock Price ($) *</Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="price"
                type="number"
                min="1"
                max="1000"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              You&apos;ll earn ${estimatedEarnings.toFixed(2)} per unlock (80% after platform fee)
            </p>
          </div>

          {/* File Upload */}
          <div>
            <Label>Media Upload (Optional)</Label>
            <div
              {...getRootProps()}
              className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              {isDragActive ? (
                <p className="text-purple-600">Drop files here...</p>
              ) : (
                <div>
                  <p className="text-gray-600">Drag & drop images or videos here</p>
                  <p className="text-sm text-gray-500 mt-1">Or click to select files</p>
                  <p className="text-xs text-gray-400 mt-2">Max 5 files, 50MB each</p>
                </div>
              )}
            </div>
          </div>

          {/* File Previews */}
          {formData.files.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Uploaded Files ({formData.files.length})</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {formData.files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className={`relative rounded-lg overflow-hidden ${showPreview ? '' : 'filter blur-sm'}`}>
                      {file.type.startsWith('image/') ? (
                        <img
                          src={previewUrls[index]}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <video
                          src={previewUrls[index]}
                          className="w-full h-32 object-cover"
                          muted
                        />
                      )}
                      {!showPreview && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Lock className="h-6 w-6 mx-auto mb-1" />
                            <p className="text-xs">Preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post Preview */}
          {(formData.title || formData.content) && (
            <div>
              <Label>Post Preview</Label>
              <Card className="mt-1 border-dashed">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{formData.title || 'Untitled Post'}</h4>
                  {formData.content && (
                    <p className="text-gray-700 text-sm mb-3">{formData.content}</p>
                  )}
                  {formData.files.length > 0 && (
                    <div className="bg-gray-100 rounded p-3 text-center">
                      <Upload className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {formData.files.length} media file{formData.files.length !== 1 ? 's' : ''} attached
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-sm text-gray-600">Unlock Price</span>
                    <span className="font-semibold text-purple-600">${formData.price}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="flex-1"
            >
              {isLoading ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}