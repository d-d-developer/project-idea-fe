"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

interface EditSocialLinksDialogProps {
  profile: {
    links?: {
      website?: string
      twitter?: string
      linkedin?: string
      github?: string
    }
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileUpdate: () => void
}

export function EditSocialLinksDialog({
  profile,
  open,
  onOpenChange,
  onProfileUpdate,
}: EditSocialLinksDialogProps) {
  const [formData, setFormData] = useState({
    links: {
      website: profile.links?.website || '',
      twitter: profile.links?.twitter || '',
      linkedin: profile.links?.linkedin || '',
      github: profile.links?.github || ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  const formatSocialLink = (platform: string, value: string): string => {
    if (!value) return ''
    
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value
    }

    const username = value.startsWith('@') ? value.slice(1) : value

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/${username}`
      case 'github':
        return `https://github.com/${username}`
      case 'linkedin':
        if (username.includes('linkedin.com/')) {
          return `https://${username}`
        }
        return `https://linkedin.com/in/${username}`
      case 'website':
        return `https://${username}`
      default:
        return `https://${username}`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const links = Object.fromEntries(
        Object.entries(formData.links)
          .filter(([_, value]) => value !== '')
          .map(([key, value]) => [key, formatSocialLink(key, value)])
      )

      await api('/social-profiles/me', {
        method: 'PATCH',
        body: {
          links: Object.keys(links).length > 0 ? links : undefined
        },
      })
      onProfileUpdate()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating social links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      links: { ...prev.links, [name]: value }
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Social Links</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.links.website}
                onChange={handleChange}
                placeholder="yourwebsite.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                value={formData.links.twitter}
                onChange={handleChange}
                placeholder="@username or twitter.com/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={formData.links.linkedin}
                onChange={handleChange}
                placeholder="username or linkedin.com/in/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                name="github"
                value={formData.links.github}
                onChange={handleChange}
                placeholder="@username or github.com/username"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
