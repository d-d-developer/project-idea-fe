"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { ProfileSettings } from "./profile-settings"

export function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const formData = new FormData(e.currentTarget)
      await api('/users/me', {
        method: 'PATCH',
        body: { email: formData.get('email') }
      })
      setMessage({ type: 'success', text: 'Email updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update email' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const formData = new FormData(e.currentTarget)
      const currentPassword = formData.get('currentPassword')
      const newPassword = formData.get('newPassword')
      const confirmPassword = formData.get('confirmPassword')

      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match')
      }

      await api('/users/me/password', {
        method: 'PATCH',
        body: { currentPassword, newPassword }
      })
      setMessage({ type: 'success', text: 'Password updated successfully' })
      e.currentTarget.reset()
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update password'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      await api('/users/me', { method: 'DELETE' })
      localStorage.removeItem('token')
      window.location.href = '/'
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account' })
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ProfileSettings />

      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>Update your email address</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">New Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your new email"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              Update Email
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            disabled={isLoading}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
