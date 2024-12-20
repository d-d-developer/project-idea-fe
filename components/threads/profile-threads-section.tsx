"use client";

import { useThreads } from "@/hooks/use-threads";
import { ThreadList } from "./thread-list";
import { CreateThreadDialog } from "./create-thread-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileThreadsSectionProps {
  isOwnProfile?: boolean;
}

export function ProfileThreadsSection({
  isOwnProfile = false,
}: ProfileThreadsSectionProps) {
  const { threads, isLoading, createThread } = useThreads();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Threads</CardTitle>
        {isOwnProfile && (
          <CreateThreadDialog onCreateThread={createThread} />
        )}
      </CardHeader>
      <CardContent>
        <ThreadList threads={threads} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
