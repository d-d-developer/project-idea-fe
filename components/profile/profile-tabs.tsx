"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PostCard } from "@/components/posts/post-card"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface ProfileTabsProps {
  username: string
}

export function ProfileTabs({ username }: ProfileTabsProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = async (type?: string) => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        ...(type && { type: type.toUpperCase() }),
      })
      const response = await api(`/posts/username/${username}?${queryParams.toString()}`)
      setPosts(response.data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [username])

  const handleTabChange = (value: string) => {
    if (value === "all") {
      fetchPosts()
    } else {
      fetchPosts(value)
    }
  }

  return (
    <Tabs defaultValue="all" className="w-full h-full flex flex-col" onValueChange={handleTabChange}>
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 w-full border-b">
        <div className="container py-4">
          <TabsList className="w-full justify-start bg-transparent border rounded-xl p-1">
            <TabsTrigger 
              value="all" 
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200"
              )}
            >
              All Posts
            </TabsTrigger>
            <TabsTrigger 
              value="project"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200"
              )}
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="survey"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200"
              )}
            >
              Surveys
            </TabsTrigger>
            <TabsTrigger 
              value="inquiry"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200"
              )}
            >
              Inquiries
            </TabsTrigger>
            <TabsTrigger 
              value="fundraiser"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200"
              )}
            >
              Fundraisers
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto container py-8">
        <TabsContent value="all" className="m-0">
          <div className="space-y-8">
            {!isLoading && posts.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-semibold">No posts yet</h3>
                <p className="text-muted-foreground">
                  When you create posts, they will appear here
                </p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="project" className="m-0">
          <div className="space-y-8">
            {!isLoading && posts.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-semibold">No projects yet</h3>
                <p className="text-muted-foreground">
                  Share your project ideas with the community
                </p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="survey" className="m-0">
          <div className="space-y-8">
            {!isLoading && posts.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-semibold">No surveys yet</h3>
                <p className="text-muted-foreground">
                  Create surveys to gather feedback from the community
                </p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="inquiry" className="m-0">
          <div className="space-y-8">
            {!isLoading && posts.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-semibold">No inquiries yet</h3>
                <p className="text-muted-foreground">
                  Ask the community for help or collaboration
                </p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="fundraiser" className="m-0">
          <div className="space-y-8">
            {!isLoading && posts.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-semibold">No fundraisers yet</h3>
                <p className="text-muted-foreground">
                  Start a fundraiser to support your project
                </p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
