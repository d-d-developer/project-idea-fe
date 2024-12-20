"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowLeft, X } from "lucide-react";
import { SurveyForm } from "@/components/posts/create/survey-form";
import { ProjectForm } from "@/components/posts/create/project-form";
import { InquiryForm } from "@/components/posts/create/inquiry-form";
import { FundraiserForm } from "@/components/posts/create/fundraiser-form";
import { useQueryClient } from "@tanstack/react-query";
import cn from "classnames";

type PostType = "survey" | "project" | "inquiry" | "fundraiser" | "event";

interface PostTypeOption {
  type: PostType;
  title: string;
  description: string;
  icon: string;
  component?: React.ComponentType<{ onSuccess: () => void }>;
  comingSoon?: boolean;
}

const postTypes: PostTypeOption[] = [
  {
    type: "survey",
    title: "Survey",
    description: "Create a survey to collect feedback from the community",
    icon: "📊",
    component: SurveyForm,
  },
  {
    type: "project",
    title: "Project",
    description: "Share your project with the community",
    icon: "🚀",
    component: ProjectForm,
  },
  {
    type: "inquiry",
    title: "Talent Inquiry",
    description: "Post a job inquiry to find professionals for your project",
    icon: "👥",
    component: InquiryForm,
  },
  {
    type: "fundraiser",
    title: "Create Fundraiser",
    description: "Start a fundraiser for your project",
    icon: "💰",
    component: FundraiserForm,
  },
  {
    type: "event",
    title: "Event",
    description: "Create and share an event with the community",
    icon: "📅",
    comingSoon: true,
  },
];

interface CreatePostDialogProps {
  trigger?: React.ReactNode;
}

export function CreatePostDialog({ trigger }: CreatePostDialogProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<PostType | null>(null);

  const handlePostTypeSelect = (type: PostType) => {
    setSelectedType(type);
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset selected type after the dialog closes
      setTimeout(() => {
        setSelectedType(null);
      }, 200);
    }
  };

  const handleSuccess = () => {
    handleOpenChange(false);
    // Invalidate the posts query to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const selectedPostType = selectedType ? postTypes.find(pt => pt.type === selectedType) : null;
  const FormComponent = selectedPostType?.component;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={cn(
        "max-h-[85vh] flex flex-col",
        selectedType ? "sm:max-w-2xl" : "sm:max-w-md"
      )}>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-[60]">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="sticky top-0 z-50 bg-background pb-4 border-b -mx-6 px-6">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedType && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -ml-2"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <DialogTitle>
                {selectedPostType ? selectedPostType.title : "Create a New Post"}
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto -mx-6 px-6 min-h-0">
          {selectedType && FormComponent ? (
            <div className="px-1 py-4">
              <FormComponent 
                onSuccess={() => {
                  handleSuccess();
                }} 
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3 px-3 py-4">
              {postTypes.map((postType) => (
                <Button
                  key={postType.type}
                  variant="outline"
                  className="h-auto w-full flex-col items-start gap-2 px-3 py-3 relative whitespace-normal text-left"
                  onClick={() => !postType.comingSoon && handlePostTypeSelect(postType.type)}
                  disabled={postType.comingSoon}
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="text-2xl">{postType.icon}</span>
                    <span className="font-medium">{postType.title}</span>
                    {postType.comingSoon && (
                      <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">Coming Soon</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground break-words">
                    {postType.description}
                  </p>
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
