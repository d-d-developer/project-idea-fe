"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Upload } from "lucide-react"

interface EditAvatarDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileUpdate: () => void
}

export function EditAvatarDialog({
  open,
  onOpenChange,
  onProfileUpdate,
}: EditAvatarDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Please upload a JPG, PNG, or GIF file')
      return
    }

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      await api('/social-profiles/me/avatar', {
        method: 'PATCH',
        body: formData,
        headers: {
          // Don't set Content-Type header, let the browser set it with the boundary
          Accept: 'application/json',
        },
      })

      onProfileUpdate()
      onOpenChange(false)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
          />
          <Button
            onClick={triggerFileInput}
            disabled={isLoading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isLoading ? 'Uploading...' : 'Choose Image'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Supported formats: JPG, PNG, GIF. Max size: 5MB
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
