"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  url: string;
  className?: string;
}

export function ShareButton({ url, className }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "The link has been copied to your clipboard.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
}
