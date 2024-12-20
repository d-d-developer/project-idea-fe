"use client"

import { useState, useCallback } from "react"
import { FixedSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import InfiniteLoader from "react-window-infinite-loader"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Header } from "@/components/layout/header"
import { PostCard } from "@/components/posts/post-card"
import { PostFilters } from "@/components/posts/post-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { api } from "@/lib/api"
import { CreatePostDialog } from "@/components/posts/create-post-dialog"

const LOADING = 1
const LOADED = 2
let itemStatusMap = {} as { [key: number]: number }

export default function CommunityPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState<{
    search?: string
    category?: string
    type?: string
  }>({})

  const { data: postsData, isLoading, isFetching } = useQuery({
    queryKey: ["posts", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: "0",
        size: "10",
        embed: "authorProfile",
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { categoryIds: filters.category }),
        ...(filters.type && { type: filters.type }),
      })
      const response = await api(`/posts?${queryParams.toString()}`)
      return response.data
    },
    staleTime: 1000 * 60, // Consider data stale after 1 minute
    keepPreviousData: true, // Keep showing the old data while loading new data
  })

  const posts = postsData?.posts || []

  const isItemLoaded = (index: number) => !!itemStatusMap[index]
  const itemCount = hasMore ? posts.length + 1 : posts.length

  const loadMoreItems = useCallback(async (startIndex: number, stopIndex: number) => {
    const pageSize = 10
    const pageToLoad = Math.floor(startIndex / pageSize)

    if (itemStatusMap[startIndex] === LOADING) {
      return
    }

    for (let i = startIndex; i <= stopIndex; i++) {
      itemStatusMap[i] = LOADING
    }

    try {
      const queryParams = new URLSearchParams({
        page: pageToLoad.toString(),
        size: pageSize.toString(),
        embed: "authorProfile",
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { categoryIds: filters.category }),
        ...(filters.type && { type: filters.type }),
      })

      const response = await api(`/posts?${queryParams.toString()}`)
      const newPostsData = response.data.posts || []
      const totalPages = response.data.totalPages || 1

      // Update the query data
      queryClient.setQueryData(["posts", filters], (oldData: any) => {
        if (!oldData) return { posts: newPostsData }
        const uniquePosts = [...(oldData.posts || []), ...newPostsData].filter(
          (post, index, self) => index === self.findIndex(p => p.id === post.id)
        )
        return {
          ...oldData,
          posts: uniquePosts,
        }
      })

      newPostsData.forEach((_, i: number) => {
        itemStatusMap[startIndex + i] = LOADED
      })

      setHasMore(pageToLoad < totalPages - 1)
      setPage(pageToLoad)
    } catch (error) {
      console.error('Error fetching posts:', error)
      for (let i = startIndex; i <= stopIndex; i++) {
        itemStatusMap[i] = LOADED
      }
      setHasMore(false)
    }
  }, [filters, queryClient])

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
    itemStatusMap = {}
    setPage(0)
    setHasMore(true)
  }, [])

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const post = posts[index]
    
    if (!post) {
      return (
        <div style={{
          ...style,
          height: `${parseFloat(style.height as string)}px`
        }} className="flex items-center justify-center">
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
        </div>
      )
    }

    return (
      <div style={{
        ...style,
        height: `${parseFloat(style.height as string)}px`
      }}>
        <PostCard post={post} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Community</h1>
          <CreatePostDialog 
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 relative h-[calc(100vh-12rem)]">
          <aside className="md:sticky md:top-6 h-fit space-y-6">
            <PostFilters onFilterChange={handleFilterChange} />
          </aside>

          <div className="h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {!isLoading && posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-lg text-gray-600 mb-2">There are no posts yet!</p>
                <p className="text-sm text-gray-500">Be the first to create one!</p>
              </div>
            ) : (
              <AutoSizer>
                {({ height, width }) => (
                  <InfiniteLoader
                    isItemLoaded={isItemLoaded}
                    itemCount={itemCount}
                    loadMoreItems={loadMoreItems}
                    threshold={3}
                    minimumBatchSize={10}
                  >
                    {({ onItemsRendered, ref }) => (
                      <>
                        {isFetching && (
                          <div className="absolute top-0 right-0 m-4">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        )}
                        <List
                          ref={ref}
                          onItemsRendered={onItemsRendered}
                          height={height}
                          width={width}
                          itemCount={itemCount}
                          itemSize={260}
                          overscanCount={2}
                          className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                          {Row}
                        </List>
                      </>
                    )}
                  </InfiniteLoader>
                )}
              </AutoSizer>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
