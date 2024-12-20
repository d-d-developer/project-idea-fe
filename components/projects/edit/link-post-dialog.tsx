"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, Search } from "lucide-react";

interface Post {
  id: string;
  title: string;
  type: string;
  createdAt: string;
}

interface LinkPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLink: (postId: string) => void;
}

export function LinkPostDialog({
  open,
  onOpenChange,
  onLink,
}: LinkPostDialogProps) {
  const [search, setSearch] = useState("");

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts", search],
    queryFn: async () => {
      const response = await api.get(
        `/posts/search?query=${encodeURIComponent(search)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return response.json();
    },
    enabled: search.length > 2, // Only search when there are at least 3 characters
  });

  const handleLink = (postId: string) => {
    onLink(postId);
    onOpenChange(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link Post</DialogTitle>
          <DialogDescription>
            Search and select a post to link to this roadmap step.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="search">Search posts</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Type to search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="min-h-[200px] max-h-[200px] overflow-y-auto">
            {isLoading && search.length > 2 ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-2">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => handleLink(post.id)}
                    className="w-full text-left p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            ) : search.length > 2 ? (
              <div className="text-center text-muted-foreground py-8">
                No posts found
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Type at least 3 characters to search
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
