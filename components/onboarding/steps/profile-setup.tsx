"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/lib/api"

interface ProfileSetupStepProps {
  onNext: (data: { 
    bio?: string
    avatarURL?: string
    links?: Record<string, string>
  }) => void
  onBack: () => void
  isLastStep: boolean
  initialData?: {
    bio?: string
    avatarURL?: string
    links?: Record<string, string>
  }
}

export function ProfileSetupStep({ onNext, onBack, isLastStep, initialData }: ProfileSetupStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatarURL || null)
  const [formValues, setFormValues] = useState({
    bio: initialData?.bio || "",
    github: initialData?.links?.github ? initialData.links.github.replace("https://github.com/", "") : "",
    twitter: initialData?.links?.twitter ? initialData.links.twitter.replace("https://twitter.com/", "") : "",
    linkedin: initialData?.links?.linkedin ? initialData.links.linkedin.replace("https://linkedin.com/in/", "") : "",
  })

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      // Build the links object with only the provided social links
      const links: Record<string, string> = {}
      if (formValues.github) links.github = `https://github.com/${formValues.github}`
      if (formValues.twitter) links.twitter = `https://twitter.com/${formValues.twitter}`
      if (formValues.linkedin) links.linkedin = `https://linkedin.com/in/${formValues.linkedin}`

      const profileData = {
        bio: formValues.bio || undefined,
        links
      }

      // If there's an avatar file, upload it first
      let avatarURL = initialData?.avatarURL
      if (avatarFile) {
        const avatarFormData = new FormData()
        avatarFormData.append("avatar", avatarFile)
        const response = await api("/social-profiles/me/avatar", {
          method: "PATCH",
          body: avatarFormData,
        })
        avatarURL = response.data.avatarURL
      }

      // Update social profile
      await api("/social-profiles/me", {
        method: "PATCH",
        body: profileData,
      })

      onNext({ ...profileData, avatarURL })
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarPreview || undefined} />
            <AvatarFallback>
              <Icons.user className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-upload"
            />
            <Label
              htmlFor="avatar-upload"
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Choose Avatar
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formValues.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            className="resize-none"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub Username</Label>
          <Input
            id="github"
            name="github"
            value={formValues.github}
            onChange={handleInputChange}
            placeholder="your-github-username"
            type="text"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter Username</Label>
          <Input
            id="twitter"
            name="twitter"
            value={formValues.twitter}
            onChange={handleInputChange}
            placeholder="your-twitter-username"
            type="text"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Username</Label>
          <Input
            id="linkedin"
            name="linkedin"
            value={formValues.linkedin}
            onChange={handleInputChange}
            placeholder="your-linkedin-username"
            type="text"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => onNext({})}
            disabled={isLoading}
          >
            Skip
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {isLastStep ? "Complete" : "Next"}
          </Button>
        </div>
      </div>
    </form>
  )
}
