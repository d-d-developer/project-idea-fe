"use client";

import { Thread } from "@/types/thread";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { MessageSquare, Pin } from "lucide-react";

interface ThreadListProps {
  threads: Thread[];
  isLoading?: boolean;
}

export function ThreadList({ threads, isLoading }: ThreadListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border p-4 space-y-3"
          >
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No threads found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <Link
          key={thread.id}
          href={`/threads/${thread.id}`}
          className="block rounded-lg border p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={thread.authorProfile.avatarUrl}
                alt={thread.authorProfile.username}
              />
              <AvatarFallback>
                {getInitials(thread.authorProfile.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{thread.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(thread.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              {thread.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {thread.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{thread.posts.length} posts</span>
                </div>
                {thread.pinnedPosts.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Pin className="h-4 w-4" />
                    <span>{thread.pinnedPosts.length} pinned</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
