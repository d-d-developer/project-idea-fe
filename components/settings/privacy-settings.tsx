"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { api } from "@/lib/api"

export function PrivacySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    profileVisibility: 'public', // public, private
    showEmail: false,
    showLocation: false,
    allowMessaging: true,
    allowTagging: true,
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleProfileVisibilityChange = (value: string) => {
    setSettings(prev => ({ ...prev, profileVisibility: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      await api('/users/me/privacy', {
        method: 'PATCH',
        body: settings
      })
      setMessage({ type: 'success', text: 'Privacy settings updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update privacy settings' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
          <CardDescription>Control who can see your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={settings.profileVisibility}
            onValueChange={handleProfileVisibilityChange}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="flex flex-col">
                <span>Public</span>
                <span className="text-sm text-muted-foreground">
                  Anyone can view your profile
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="flex flex-col">
                <span>Private</span>
                <span className="text-sm text-muted-foreground">
                  Only followers can view your profile
                </span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Control what information is visible on your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Email</Label>
              <p className="text-sm text-muted-foreground">
                Display your email address on your profile
              </p>
            </div>
            <Switch
              checked={settings.showEmail}
              onCheckedChange={() => handleToggle('showEmail')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Location</Label>
              <p className="text-sm text-muted-foreground">
                Display your location on your profile
              </p>
            </div>
            <Switch
              checked={settings.showLocation}
              onCheckedChange={() => handleToggle('showLocation')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interactions</CardTitle>
          <CardDescription>Control how others can interact with you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Direct Messages</Label>
              <p className="text-sm text-muted-foreground">
                Let others send you direct messages
              </p>
            </div>
            <Switch
              checked={settings.allowMessaging}
              onCheckedChange={() => handleToggle('allowMessaging')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Tagging</Label>
              <p className="text-sm text-muted-foreground">
                Let others tag you in posts and comments
              </p>
            </div>
            <Switch
              checked={settings.allowTagging}
              onCheckedChange={() => handleToggle('allowTagging')}
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave} disabled={isLoading}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
