"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Post {
  id: string;
  title: string;
  type: string;
  description: string;
  createdAt: string;
  authorProfile: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
}

interface PostSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  postType: "FUNDRAISER" | "INQUIRY";
  username: string;
}

export function PostSelect({ value, onValueChange, postType, username }: PostSelectProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Aggiorna il post selezionato quando cambia value o posts
  React.useEffect(() => {
    const selected = posts.find(post => post.id === value);
    setSelectedPost(selected || null);
  }, [value, posts]);

  const searchPosts = React.useCallback(async (query: string) => {
    if (!query) {
      setPosts([]);
      return;
    }
    setLoading(true);
    try {
      const response = await api(`/posts/search?query=${encodeURIComponent(query)}&type=${postType}&username=${username}&size=10`, {
        method: "GET",
      });
      
      const postList = response.data.posts || [];
      setPosts(postList);
      
    } catch (error: any) {
      console.error("Error searching posts:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while searching posts";
      toast({
        variant: "destructive",
        title: "Error searching posts",
        description: errorMessage,
        duration: 3000,
      });
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [postType, username, toast]);

  const handleSearch = () => {
    if (searchTerm.trim().length < 2) {
      toast({
        variant: "destructive",
        title: "Invalid search",
        description: "Search query must be at least 2 characters long",
        duration: 3000,
      });
      return;
    }
    searchPosts(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev < posts.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
    }
  };

  const handleSelect = (post: Post) => {
    onValueChange(post.id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedPost ? (
            <span className="truncate">{selectedPost.title}</span>
          ) : (
            <span className="text-muted-foreground">
              Select a {postType.toLowerCase()}...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0 relative z-50" 
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        style={{ 
          pointerEvents: 'auto',
          position: 'relative',
          isolation: 'isolate'
        }}
        align="end"
        side="bottom"
        sideOffset={5}
        alignOffset={0}
      >
        <div className="flex items-center space-x-2 p-3 border-b">
          <Input
            ref={inputRef}
            placeholder={`Search ${postType.toLowerCase()}s...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            aria-label={`Search ${postType.toLowerCase()}s`}
          />
          <Button 
            size="sm"
            variant="secondary"
            onClick={handleSearch}
            disabled={loading}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[300px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : posts.length > 0 ? (
            <div className="flex flex-col gap-1 p-1">
              {posts.map((post, index) => (
                <Button
                  key={post.id}
                  variant="ghost"
                  role="option"
                  className={cn(
                    "justify-start font-normal",
                    post.id === value && "bg-accent",
                    focusedIndex === index && "bg-accent"
                  )}
                  onClick={() => handleSelect(post)}
                >
                  <div className="flex flex-col items-start truncate">
                    <span className="truncate">{post.title}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      by @{post.authorProfile.username} • {post.description}
                    </span>
                  </div>
                  {post.id === value && (
                    <Check className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-6">
              <span className="text-sm text-muted-foreground">
                {searchTerm ? "No results found." : "Type to search..."}
              </span>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
