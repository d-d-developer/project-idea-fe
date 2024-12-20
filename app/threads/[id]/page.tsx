"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { api } from "@/lib/api";
import { Thread } from "@/types/thread";
import { Post } from "@/types/post";
import { SocialProfile } from "@/types/social-profile";
import { PostCard } from "@/components/posts/post-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Pin, PinOff, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ShareButton } from "@/components/share-button";
import { cn } from "@/lib/utils";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params.id as string;
  const { toast } = useToast();

  const [thread, setThread] = useState<Thread | null>(null);
  const [currentProfile, setCurrentProfile] = useState<SocialProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchThread(), fetchCurrentProfile()]).finally(() => {
      setIsLoading(false);
    });
  }, [threadId]);

  const fetchCurrentProfile = async () => {
    try {
      const response = await api("/social-profiles/me");
      setCurrentProfile(response.data);
    } catch (error) {
      console.error("Error fetching current profile:", error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    }
  };

  const fetchThread = async () => {
    try {
      const response = await api(`/threads/${threadId}`);
      setThread(response.data);
    } catch (error) {
      console.error("Error fetching thread:", error);
      toast({
        title: "Error",
        description: "Failed to load thread",
        variant: "destructive",
      });
    }
  };

  const searchPosts = async () => {
    if (!searchQuery.trim() || !currentProfile) return;

    try {
      setIsSearching(true);
      const params = new URLSearchParams({
        query: searchQuery,
        username: currentProfile.username
      });
      const response = await api(`/posts/search?${params.toString()}`);
      setSearchResults(response.data.posts || []);
    } catch (error) {
      console.error("Error searching posts:", error);
      toast({
        title: "Error",
        description: "Failed to search posts",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const addPostToThread = async (postId: string) => {
    try {
      await api(`/threads/${threadId}/posts/${postId}`, {
        method: "POST",
      });
      await fetchThread();
      toast({
        title: "Success",
        description: "Post added to thread",
      });
    } catch (error) {
      console.error("Error adding post to thread:", error);
      toast({
        title: "Error",
        description: "Failed to add post to thread",
        variant: "destructive",
      });
    }
  };

  const removePostFromThread = async (postId: string) => {
    try {
      await api(`/threads/${threadId}/posts/${postId}`, {
        method: "DELETE",
      });
      await fetchThread();
      toast({
        title: "Success",
        description: "Post removed from thread",
      });
    } catch (error) {
      console.error("Error removing post from thread:", error);
      toast({
        title: "Error",
        description: "Failed to remove post from thread",
        variant: "destructive",
      });
    }
  };

  const togglePinPost = async (postId: string, isPinned: boolean) => {
    try {
      if (isPinned) {
        await api(`/threads/${threadId}/posts/${postId}/pin`, {
          method: "DELETE",
        });
        toast({
          title: "Post Unpinned",
          description: "The post has been removed from pinned posts",
        });
      } else {
        await api(`/threads/${threadId}/posts/${postId}/pin`, {
          method: "POST",
        });
        toast({
          title: "Post Pinned",
          description: "The post has been added to pinned posts",
        });
      }
      await fetchThread();
    } catch (error: any) {
      console.error("Error toggling pin:", error);
      
      const errorMessage = error?.response?.data?.message || error.message || "An unknown error occurred";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="h-4 w-full max-w-2xl bg-muted rounded" />
            <div className="h-4 w-full max-w-xl bg-muted rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">Thread not found</h1>
            <p className="text-muted-foreground">
              The thread you're looking for doesn't exist
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{thread.title}</h1>
              <ShareButton url={window.location.href} />
            </div>
            {thread.description && (
              <p className="mt-2 text-muted-foreground">{thread.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Posts</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={searchPosts}
                    disabled={isSearching || !searchQuery.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Card className="flex items-center gap-2 p-2">
                    <Input
                      placeholder="Search posts to add..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchPosts()}
                      className="h-8 w-[200px]"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                      className="text-muted-foreground px-2"
                    >
                      {isSearchExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </Card>
                </div>
              </div>

              {isSearchExpanded && searchQuery && (
                <Card className="p-4">
                  <div className="space-y-4">
                    {isSearching ? (
                      <div className="text-center py-4">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((post) => (
                        <div key={`post-${post.id}`} className="relative">
                          <PostCard post={post} />
                          <Button
                            variant="default"
                            size="sm"
                            className="absolute top-4 right-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                            onClick={() => addPostToThread(post.id)}
                            disabled={thread.posts.some(p => p.id === post.id)}
                          >
                            {thread.posts.some(p => p.id === post.id) ? (
                              <>
                                <span className="text-primary-foreground/80">Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Add to Thread
                              </>
                            )}
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No posts found
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {thread.posts
                .filter((post) => !thread.pinnedPosts.some((p) => p.id === post.id))
                .map((post) => (
                  <div key={`post-${post.id}`} className="relative flex gap-8 items-stretch min-h-[100px]">
                    <div className="relative flex flex-col items-center">
                      <div className="absolute top-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 bg-primary rounded-full z-10" />
                      </div>
                      <div className="w-[2px] h-full bg-border" />
                    </div>
                    <div className="flex-1">
                      <PostCard
                        post={post}
                        onPin={() => togglePinPost(post.id, false)}
                        onRemove={() => removePostFromThread(post.id)}
                      />
                    </div>
                  </div>
                ))}
            </div>

            {thread.pinnedPosts.length > 0 && (
              <div className="space-y-4">
                <Card className="p-6 sticky top-4">
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <Pin className="h-4 w-4" />
                    <h2 className="text-xl font-semibold">Pinned Posts</h2>
                  </div>
                  <div className="space-y-4">
                    {thread.pinnedPosts.map((post) => (
                      <div key={`pinned-${post.id}`} className="relative">
                        <PostCard
                          post={post}
                          onPin={() => togglePinPost(post.id, true)}
                          onRemove={() => removePostFromThread(post.id)}
                          isPinned={true}
                          variant="compact"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
