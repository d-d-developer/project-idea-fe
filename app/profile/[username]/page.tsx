"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"
import { ProfileThreadsSection } from "@/components/threads/profile-threads-section"
import { api } from "@/lib/api"
import { useParams } from "next/navigation"

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await api(`/social-profiles/${username}`)
      const profileData = response.data
      
      // Check if this is the current user's profile
      const currentUserProfile = await api('/social-profiles/me')
      profileData.isCurrentUser = currentUserProfile.data.id === profileData.id

      setProfile(profileData)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [username])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-8">
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-8 w-48 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
            </div>
            <div className="h-4 w-full max-w-2xl bg-muted rounded" />
            <div className="h-4 w-full max-w-xl bg-muted rounded" />
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">Profile not found</h1>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 relative h-[calc(100vh-12rem)]">
          <aside className="md:sticky md:top-6 h-fit space-y-6">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200">
              <ProfileHeader
                profile={profile}
                onEdit={() => setIsEditDialogOpen(true)}
              />
            </div>
            <ProfileThreadsSection isOwnProfile={profile.isCurrentUser} />
          </aside>
          <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <ProfileTabs username={username} />
          </div>
        </div>

        {profile.isCurrentUser && (
          <EditProfileDialog
            profile={profile}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onProfileUpdate={fetchProfile}
          />
        )}
      </main>
    </div>
  )
}
