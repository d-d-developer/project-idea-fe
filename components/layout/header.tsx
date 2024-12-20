"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  LightbulbIcon, 
  Bell, 
  Plus,
  LogOut,
  User,
  Settings
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/lib/api"
import { CreatePostDialog } from "@/components/posts/create-post-dialog"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const userData = await api("/users/me")
          const profileData = await api("/social-profiles/me")
          setUser({ ...userData.data, ...profileData.data })
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem("token")
    // Reset user state
    setUser(null)
    // Redirect to home page
    window.location.href = "/"
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <LightbulbIcon className="h-6 w-6" />
          <Link href={user ? "/community" : "/"} className="text-xl font-bold">
            Project Idea
          </Link>
        </div>

        {!isLoading && (
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/community">Community</Link>
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <CreatePostDialog 
                  trigger={
                    <Button variant="outline" size="icon">
                      <Plus className="h-5 w-5" />
                    </Button>
                  }
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-8 w-8 rounded-full ring-2 ring-primary/10 hover:ring-primary/20 transition-all"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarURL} alt={user.username} />
                        <AvatarFallback className="bg-primary/10">
                          {user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                          {user.lastName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarURL} alt={user.username} />
                        <AvatarFallback className="bg-primary/10">
                          {user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                          {user.lastName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </p>
                        {user.username && (
                          <p className="text-xs leading-none text-muted-foreground">
                            @{user.username}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${user.username}`} className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
