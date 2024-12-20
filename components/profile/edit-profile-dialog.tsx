"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"

interface EditProfileDialogProps {
  profile: {
    username: string
    firstName: string
    lastName: string
    bio?: string
    website?: string
    twitter?: string
    linkedin?: string
    github?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileUpdate: () => void
}

export function EditProfileDialog({
  profile,
  open,
  onOpenChange,
  onProfileUpdate,
}: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    bio: profile.bio || '',
    links: {
      website: profile.website || '',
      twitter: profile.twitter || '',
      linkedin: profile.linkedin || '',
      github: profile.github || ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  const formatSocialLink = (platform: string, value: string): string => {
    if (!value) return ''
    
    // If already has http:// or https://, return as is
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value
    }

    // Remove @ if present
    const username = value.startsWith('@') ? value.slice(1) : value

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/${username}`
      case 'github':
        return `https://github.com/${username}`
      case 'linkedin':
        // Check if it's already a full linkedin path
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
      // Format and filter empty links
      const links = Object.fromEntries(
        Object.entries(formData.links)
          .filter(([_, value]) => value !== '')
          .map(([key, value]) => [key, formatSocialLink(key, value)])
      )

      await api('/social-profiles/me', {
        method: 'PATCH',
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          bio: formData.bio || undefined,
          links: Object.keys(links).length > 0 ? links : undefined
        },
      })
      onProfileUpdate()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name === 'firstName' || name === 'lastName' || name === 'bio') {
      setFormData(prev => ({ ...prev, [name]: value }))
    } else {
      // Handle social links
      setFormData(prev => ({
        ...prev,
        links: { ...prev.links, [name]: value }
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>

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
