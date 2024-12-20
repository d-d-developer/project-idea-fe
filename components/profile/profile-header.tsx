"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Globe, Twitter, Linkedin, Github, Camera } from "lucide-react"
import Link from "next/link"
import { EditNameDialog } from "./edit-name-dialog"
import { EditBioDialog } from "./edit-bio-dialog"
import { EditSocialLinksDialog } from "./edit-social-links-dialog"
import { EditAvatarDialog } from "./edit-avatar-dialog"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"

interface ProfileHeaderProps {
  profile: {
    id: string
    username: string
    firstName: string
    lastName: string
    bio?: string
    avatarURL?: string
    links?: {
      website?: string
      twitter?: string
      linkedin?: string
      github?: string
    }
    isCurrentUser: boolean
  }
}

export function ProfileHeader({ profile: initialProfile }: ProfileHeaderProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [isEditNameOpen, setIsEditNameOpen] = useState(false)
  const [isEditBioOpen, setIsEditBioOpen] = useState(false)
  const [isEditSocialLinksOpen, setIsEditSocialLinksOpen] = useState(false)
  const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false)

  const socialLinks = [
    { icon: Globe, url: profile.links?.website, label: "Website" },
    { icon: Twitter, url: profile.links?.twitter, label: "Twitter" },
    { icon: Linkedin, url: profile.links?.linkedin, label: "LinkedIn" },
    { icon: Github, url: profile.links?.github, label: "GitHub" },
  ].filter(link => link.url)

  const fetchProfile = async () => {
    try {
      const response = await api(`/social-profiles/${profile.username}`)
      setProfile({
        ...response.data,
        isCurrentUser: profile.isCurrentUser
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative group mb-4">
          <Avatar className="h-24 w-24 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
            <AvatarImage src={profile.avatarURL} alt={profile.username} />
            <AvatarFallback className="text-xl bg-primary/5">
              {profile.firstName?.charAt(0)}
              {profile.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {profile.isCurrentUser && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 bg-background opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-primary/10"
              onClick={() => setIsEditAvatarOpen(true)}
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="space-y-1.5 min-w-0 relative w-full max-w-md">
          <div className="flex items-center justify-center group">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {profile.firstName} {profile.lastName}
            </h1>
            {profile.isCurrentUser && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 h-8 w-8 shrink-0 hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditNameOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-muted-foreground font-medium truncate">@{profile.username}</p>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="relative w-full max-w-md mx-auto">
          {profile.bio ? (
            <div className="group relative">
              <div className="relative">
                <p className="text-muted-foreground/90 leading-relaxed">{profile.bio}</p>
                {profile.isCurrentUser && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-2 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                    onClick={() => setIsEditBioOpen(true)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ) : profile.isCurrentUser ? (
            <Button
              variant="ghost"
              className="h-auto p-0 text-muted-foreground hover:text-primary hover:bg-transparent"
              onClick={() => setIsEditBioOpen(true)}
            >
              Add a bio
            </Button>
          ) : null}
        </div>

        {(socialLinks.length > 0 || profile.isCurrentUser) && (
          <div className="relative w-full max-w-md mx-auto group">
            <div className="flex items-center justify-center gap-4">
              <TooltipProvider>
                {socialLinks.map(({ icon: Icon, url, label }) => (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <Link
                        href={url!}
                        target="_blank"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            {profile.isCurrentUser && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditSocialLinksOpen(true)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      <EditNameDialog
        open={isEditNameOpen}
        onOpenChange={setIsEditNameOpen}
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
      <EditBioDialog
        open={isEditBioOpen}
        onOpenChange={setIsEditBioOpen}
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
      <EditSocialLinksDialog
        open={isEditSocialLinksOpen}
        onOpenChange={setIsEditSocialLinksOpen}
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
      <EditAvatarDialog
        open={isEditAvatarOpen}
        onOpenChange={setIsEditAvatarOpen}
        onProfileUpdate={fetchProfile}
      />
    </div>
  )
}
