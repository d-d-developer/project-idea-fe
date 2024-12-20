"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarIcon, Share2Icon } from "lucide-react";
import { FundraiserEditDialog } from "@/components/posts/edit/fundraiser-edit-dialog";
import { FundraiserDonationDialog } from "@/components/posts/edit/fundraiser-donation-dialog";
import { BackButton } from "@/components/back-button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export default function FundraiserPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();

  // Fetch current user data
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!token) return null;
      const response = await api("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Current user data:", response.data);
      return response.data;
    },
    enabled: !!token,
  });

  const { data: fundraiser, isLoading: isFundraiserLoading, refetch } = useQuery({
    queryKey: ["fundraiser", id],
    queryFn: async () => {
      const response = await api(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fundraiser data:", response.data);
      return response.data;
    },
  });

  if (isFundraiserLoading || !fundraiser) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const progress = (fundraiser.raisedAmount / fundraiser.targetAmount) * 100;

  return (
    <div className="container max-w-4xl py-6">
      <div className="flex justify-between items-start mb-4">
        <BackButton />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Link copied",
              description: "The fundraiser link has been copied to your clipboard",
            });
          }}
        >
          <Share2Icon className="h-5 w-5" />
        </Button>
      </div>
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{fundraiser.title}</h1>
            <div className="flex gap-2">
              {(() => {
                const isAuthor = currentUser?.id === fundraiser.authorId;
                console.log("Author check:", {
                  currentUserId: currentUser?.id,
                  authorId: fundraiser.authorId,
                  isAuthor,
                  token: !!token
                });
                return isAuthor && (
                  <FundraiserEditDialog fundraiser={fundraiser} onUpdate={refetch} />
                );
              })()}
              <Badge
                variant={progress >= 100 ? "default" : "secondary"}
                className="ml-2"
              >
                {progress >= 100 ? "Goal Reached!" : "Active"}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">{fundraiser.description}</p>
        </div>

        {/* Fundraising Progress */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col items-center space-y-4">
            <CircularProgress value={progress} size="lg" />
            <div className="text-center">
              <p className="text-lg font-semibold">
                {fundraiser.raisedAmount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-sm text-muted-foreground">
                of {fundraiser.targetAmount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })} goal
              </p>
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={fundraiser.authorProfile.avatarUrl} />
                <AvatarFallback>{fundraiser.authorProfile.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <Link 
                  href={`/profile/${fundraiser.authorProfile.username}`}
                  className="text-sm font-medium hover:underline"
                >
                  {fundraiser.authorProfile.username}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(fundraiser.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            <span>{Math.round(progress)}% funded</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6">
          {fundraiser.categories.map((category: { id: string; name: string }) => (
            <Badge key={category.id} variant="outline">
              {category.name}
            </Badge>
          ))}
        </div>

        {/* Donation Button */}
        {isAuthenticated ? (
          <FundraiserDonationDialog fundraiserId={fundraiser.id} onUpdate={refetch} />
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Button className="w-full" size="lg" disabled>
                    Invest in this project
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Please log in to make a donation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Project Details */}
        {fundraiser.projectDetails && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="prose max-w-none">
              <p>{fundraiser.projectDetails}</p>
            </div>
          </div>
        )}

        {/* Updates */}
        {fundraiser.updates && fundraiser.updates.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Updates</h2>
            <div className="space-y-4">
              {fundraiser.updates.map(
                (update: { id: string; content: string; date: string }) => (
                  <Card key={update.id} className="p-4">
                    <p className="mb-2">{update.content}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(update.date).toLocaleDateString()}
                    </p>
                  </Card>
                )
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
