"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { api } from "@/lib/api"

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newPosts: true,
    comments: true,
    mentions: true,
    follows: true,
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      await api('/users/me/notifications', {
        method: 'PATCH',
        body: settings
      })
      setMessage({ type: 'success', text: 'Notification settings updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notification settings' })
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
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={() => handleToggle('pushNotifications')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>Select which notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Posts</Label>
              <p className="text-sm text-muted-foreground">
                When someone you follow creates a new post
              </p>
            </div>
            <Switch
              checked={settings.newPosts}
              onCheckedChange={() => handleToggle('newPosts')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Comments</Label>
              <p className="text-sm text-muted-foreground">
                When someone comments on your posts
              </p>
            </div>
            <Switch
              checked={settings.comments}
              onCheckedChange={() => handleToggle('comments')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mentions</Label>
              <p className="text-sm text-muted-foreground">
                When someone mentions you in a post or comment
              </p>
            </div>
            <Switch
              checked={settings.mentions}
              onCheckedChange={() => handleToggle('mentions')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Follows</Label>
              <p className="text-sm text-muted-foreground">
                When someone follows you
              </p>
            </div>
            <Switch
              checked={settings.follows}
              onCheckedChange={() => handleToggle('follows')}
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
