"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, Share2, Pin, PinOff, X, X as XIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { ShareButton } from "@/components/share-button"
import cn from "classnames"

interface AuthorProfile {
  id: string
  username: string
  firstName: string
  lastName: string
  avatarURL?: string
}

interface PostCardProps {
  post: {
    id: string
    title: string
    description: string
    type: string
    authorProfile: AuthorProfile | string
    createdAt: string
    likesCount?: number
    commentsCount?: number
    featuredImageUrl?: string | null
    featuredImageAlt?: string | null
    categories?: {
      id: string
      name: string
    }[]
  }
  onPin?: () => void
  onRemove?: () => void
  isPinned?: boolean
  variant?: 'default' | 'compact'
}

export function PostCard({ post, onPin, onRemove, isPinned, variant = 'default' }: PostCardProps) {
  const [author, setAuthor] = useState<AuthorProfile | null>(() => 
    typeof post.authorProfile === 'string' ? null : post.authorProfile
  )

  useEffect(() => {
    if (typeof post.authorProfile === 'string' && !author) {
      const fetchAuthor = async () => {
        try {
          const response = await api(`/social-profiles/${post.authorProfile}`)
          setAuthor(response.data)
        } catch (error) {
          console.error('Error fetching author:', error)
        }
      }
      fetchAuthor()
    } else if (typeof post.authorProfile !== 'string') {
      setAuthor(post.authorProfile)
    }
  }, [post.authorProfile, author])

  const getPostTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SURVEY: "Survey",
      PROJECT: "Project",
      INQUIRY: "Inquiry",
      FUNDRAISER: "Fundraiser"
    }
    return labels[type] || type
  }

  const getPostUrl = (type: string, id: string) => {
    const routes: Record<string, string> = {
      SURVEY: `/surveys/${id}`,
      PROJECT: `/projects/${id}`,
      INQUIRY: `/inquiries/${id}`,
      FUNDRAISER: `/fundraisers/${id}`
    }
    return routes[type] || "/"
  }

  if (!author) {
    return (
      <Card className={cn(
        "hover:shadow-lg transition-shadow mb-8 min-h-[280px]",
        variant === 'default' ? "min-h-[240px]" : "min-h-[180px]",
        post.featuredImageUrl ? variant === 'default' ? "h-[240px]" : "h-[180px]" : "",
        "relative"
      )}>
        <CardHeader className={cn(
          "flex flex-row items-center gap-4",
          variant === 'compact' ? "pb-0 pt-3 px-4" : "pb-0"
        )}>
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-full bg-gray-100 rounded" />
        </CardContent>
        <CardFooter className={cn(
          "border-t absolute bottom-0 left-0 right-0 bg-white",
          variant === 'compact' ? "px-4 py-1.5" : "px-6 py-2"
        )}>
          <div className="flex items-center gap-4">
            <div className="h-8 w-16 bg-gray-100 rounded" />
            <div className="h-8 w-16 bg-gray-100 rounded" />
          </div>
        </CardFooter>
      </Card>
    )
  }

  const createdAt = new Date(post.createdAt).toLocaleDateString()
  const postUrl = getPostUrl(post.type, post.id)

  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow mb-8 relative overflow-hidden flex group",
      variant === 'default' ? "min-h-[240px]" : "min-h-[180px]",
      post.featuredImageUrl ? variant === 'default' ? "h-[240px]" : "h-[180px]" : ""
    )}>
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <CardHeader className={cn(
            "flex flex-row items-center gap-4",
            variant === 'compact' ? "pb-0 pt-3 px-4" : "pb-0"
          )}>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/profile/${author.username}`;
              }}
              className="hover:opacity-80 transition-opacity"
            >
              <Avatar className={variant === 'compact' ? "h-8 w-8" : ""}>
                <AvatarImage src={author.avatarURL} alt={author.username} />
                <AvatarFallback>{author.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </button>
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/profile/${author.username}`;
                  }}
                  className="hover:underline truncate"
                >
                  <CardTitle className={cn(
                    "truncate",
                    variant === 'compact' ? "text-sm" : "text-base"
                  )}>
                    {author.username}
                  </CardTitle>
                </button>
                <span className={cn(
                  "text-muted-foreground whitespace-nowrap",
                  variant === 'compact' ? "text-xs" : "text-sm"
                )}>
                  {createdAt}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="whitespace-nowrap">{getPostTypeLabel(post.type)}</span>
                {post.categories && post.categories.length > 0 && variant === 'default' && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                      {post.categories.map((category) => (
                        <span
                          key={category.id}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 whitespace-nowrap"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <Link href={postUrl} className="block flex-1">
            <div className={cn(
              "flex-1",
              variant === 'compact' ? "px-4 pt-2 pb-10" : "px-6 pt-2 pb-12"
            )}>
              <h3 className={cn(
                "font-semibold mb-2",
                variant === 'compact' ? "text-base" : "text-lg"
              )}>
                {post.title}
              </h3>
              <p className={cn(
                "text-gray-500 line-clamp-3",
                variant === 'compact' ? "text-sm" : "text-base"
              )}>
                {post.description}
              </p>
            </div>
          </Link>
          <CardFooter className={cn(
            "border-t absolute bottom-0 left-0 right-0 bg-white z-10",
            variant === 'compact' ? "px-4 py-1.5" : "px-6 py-2"
          )}>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className={cn(
                "gap-1",
                variant === 'compact' ? "h-6 px-2" : "h-8"
              )}>
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likesCount || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" className={cn(
                "gap-1",
                variant === 'compact' ? "h-6 px-2" : "h-8"
              )}>
                <MessageSquare className="w-4 h-4" />
                <span>{post.commentsCount || 0}</span>
              </Button>
            </div>
            <div className="ml-auto">
              {onPin ? (
                <Button
                  variant="ghost"
                  size={variant === 'compact' ? 'icon-sm' : 'icon'}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onPin()
                  }}
                >
                  {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                </Button>
              ) : onRemove ? (
                <Button
                  variant="ghost"
                  size={variant === 'compact' ? 'icon-sm' : 'icon'}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemove()
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              ) : (
                <ShareButton
                  url={`${window.location.origin}${postUrl}`}
                  className={variant === 'compact' ? "h-6 px-2" : ""}
                />
              )}
            </div>
          </CardFooter>
        </div>
        {post.featuredImageUrl && variant === 'default' && (
          <div className="w-[300px] relative z-0">
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    </Card>
  )
}
