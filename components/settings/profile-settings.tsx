"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Loader2, Pencil, Check, X } from "lucide-react"

interface Interest {
  id: string
  name: string
  description: string
  systemCategory: boolean
}

interface Role {
  id: string
  name: string
  description: string
  systemRole: boolean
}

interface SocialLinks {
  github?: string
  twitter?: string
  linkedin?: string
}

interface SocialProfile {
  id: string
  firstName: string
  lastName: string
  username: string
  avatarURL: string
  bio: string
  links: SocialLinks
}

interface UserProfile {
  id: string
  userType: string
  email: string
  status: string
  suspensionEndDate: string | null
  lastModeratedAt: string | null
  moderationReason: string | null
  hasWarnings: boolean
  preferredLanguage: string
  socialProfile: SocialProfile
  interests: Interest[]
  roles: Role[]
}

const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "it", name: "Italiano" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" }
]

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [allInterests, setAllInterests] = useState<Interest[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [editingField, setEditingField] = useState<'username' | 'email' | 'firstName' | 'lastName' | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [userResponse, categoriesResponse] = await Promise.all([
          api('/users/me'),
          api('/categories')
        ])
        setUserProfile(userResponse.data)
        setAllInterests(categoriesResponse.data._embedded.categoryList)
      } catch (error) {
        console.error('Error fetching data:', error)
        setMessage({ type: 'error', text: 'Failed to load profile data' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLanguageChange = async (language: string) => {
    try {
      setIsLoading(true)
      await api('/users/me', {
        method: 'PATCH',
        body: { preferredLanguage: language }
      })
      setUserProfile(prev => prev ? { ...prev, preferredLanguage: language } : null)
      setMessage({ type: 'success', text: 'Language updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update language' })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleInterest = async (interest: Interest) => {
    if (!userProfile) return

    const newInterests = userProfile.interests.some(i => i.id === interest.id)
      ? userProfile.interests.filter(i => i.id !== interest.id)
      : [...userProfile.interests, interest]

    try {
      setIsLoading(true)
      await api('/users/me', {
        method: 'PATCH',
        body: { interests: newInterests.map(i => i.id) }
      })
      setUserProfile(prev => prev ? { ...prev, interests: newInterests } : null)
      setMessage({ type: 'success', text: 'Interests updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update interests' })
    } finally {
      setIsLoading(false)
    }
  }

  const startEditing = (field: 'username' | 'email' | 'firstName' | 'lastName') => {
    setEditingField(field)
    if (field === 'username') {
      setEditValue(userProfile?.socialProfile.username || '')
    } else if (field === 'email') {
      setEditValue(userProfile?.email || '')
    } else if (field === 'firstName') {
      setEditValue(userProfile?.socialProfile.firstName || '')
    } else {
      setEditValue(userProfile?.socialProfile.lastName || '')
    }
  }

  const cancelEditing = () => {
    setEditingField(null)
    setEditValue('')
  }

  const saveEdit = async () => {
    if (!editingField || !userProfile) return

    try {
      setIsLoading(true)
      if (editingField === 'username' || editingField === 'firstName' || editingField === 'lastName') {
        const updatedSocialProfile = {
          ...userProfile.socialProfile,
          [editingField]: editValue
        }
        await api('/users/me', {
          method: 'PATCH',
          body: { 
            socialProfile: updatedSocialProfile
          }
        })
        setUserProfile(prev => prev ? {
          ...prev,
          socialProfile: updatedSocialProfile
        } : null)
      } else {
        await api('/users/me', {
          method: 'PATCH',
          body: { email: editValue }
        })
        setUserProfile(prev => prev ? { ...prev, email: editValue } : null)
      }
      setMessage({ type: 'success', text: `${editingField} updated successfully` })
      setEditingField(null)
      setEditValue('')
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to update ${editingField}` })
    } finally {
      setIsLoading(false)
    }
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>First Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  {editingField === 'firstName' ? (
                    <>
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Enter first name"
                        className="max-w-[300px]"
                        disabled={isLoading}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={saveEdit}
                        disabled={isLoading}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={cancelEditing}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">{userProfile.socialProfile.firstName}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEditing('firstName')}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label>Last Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  {editingField === 'lastName' ? (
                    <>
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Enter last name"
                        className="max-w-[300px]"
                        disabled={isLoading}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={saveEdit}
                        disabled={isLoading}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={cancelEditing}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">{userProfile.socialProfile.lastName}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEditing('lastName')}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label>Username</Label>
                <div className="flex items-center gap-2 mt-1">
                  {editingField === 'username' ? (
                    <>
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Enter new username"
                        className="max-w-[300px]"
                        disabled={isLoading}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={saveEdit}
                        disabled={isLoading}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={cancelEditing}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">@{userProfile.socialProfile.username}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEditing('username')}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  {editingField === 'email' ? (
                    <>
                      <Input
                        type="email"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Enter new email"
                        className="max-w-[300px]"
                        disabled={isLoading}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={saveEdit}
                        disabled={isLoading}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={cancelEditing}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEditing('email')}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language Preferences</CardTitle>
          <CardDescription>Choose your preferred language for the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="language">Preferred Language</Label>
              <Select
                value={userProfile.preferredLanguage}
                onValueChange={handleLanguageChange}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interests</CardTitle>
          <CardDescription>Select the topics that interest you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allInterests.map((interest) => {
              const isSelected = userProfile?.interests.some(
                userInterest => userInterest.id === interest.id
              )
              return (
                <Badge
                  key={interest.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    isSelected 
                      ? "hover:bg-primary/90 hover:text-primary-foreground" 
                      : "hover:bg-muted hover:text-muted-foreground"
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest.name}
                </Badge>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  )
}
