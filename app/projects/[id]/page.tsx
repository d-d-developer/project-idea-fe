"use client";

import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { 
  FileIcon, 
  Users, 
  Loader2, 
  Circle, 
  CheckCircle2, 
  Clock, 
  Pencil, 
  Plus, 
  Trash2, 
  CircleDot, 
  XCircle,
  MoreHorizontal,
  Tags
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectEditDialog } from "@/components/posts/edit/project-edit-dialog";
import Link from "next/link";
import { useState, useCallback, useMemo, useEffect } from "react";
import { EditProjectDialog } from "@/components/projects/edit/edit-project-dialog";
import { EditCategoriesDialog } from "@/components/projects/edit/edit-categories-dialog";
import { AddParticipantDialog } from "@/components/projects/edit/add-participant-dialog";
import { EditRoadmapStepDialog } from "@/components/projects/edit/edit-roadmap-step-dialog";
import { LinkPostDialog } from "@/components/projects/edit/link-post-dialog";
import { ShareButton } from "@/components/share-button";
import { formatDistanceToNow } from "date-fns";
import { BackButton } from "@/components/back-button";

interface Project {
  id: string;
  type: string;
  title: string;
  description: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  featured: boolean;
  visibility: string;
  categories: Array<{
    id: string;
    name: string;
    description: string;
    systemCategory: boolean;
  }>;
  authorProfile: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarURL: string;
    bio: string;
    links: Record<string, string>;
  };
  authorId: string;
  createdAt: string | null;
  updatedAt: string;
  roadmapSteps: Array<{
    id: string;
    title: string;
    description: string;
    orderIndex: number;
    status: string;
    linkedPost: any;
    createdAt: string;
  }>;
  participants: Array<{
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarURL: string;
    bio: string;
    links: Record<string, string>;
  }>;
  attachments: Array<{
    id: string;
    fileName: string;
    fileType: string;
    cloudinaryUrl: string;
    cloudinaryPublicId: string;
    fileSize: number;
    uploadedAt: string;
  }>;
}

const getStepIcon = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "IN_PROGRESS":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "BLOCKED":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <CircleDot className="h-5 w-5 text-gray-500" />;
  }
};

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (isAuthenticated) {
        try {
          const response = await api('/users/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      }
    };
    fetchCurrentUser();
  }, [isAuthenticated, token]);

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["project", id],
    queryFn: async () => {
      console.log("Calling /posts/${id} API...");
      const response = await api(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Project response:", {
        authorProfileId: response.data.authorProfile?.id,
        authorName: `${response.data.authorProfile?.firstName} ${response.data.authorProfile?.lastName}`
      });
      return response.data;
    },
  });

  const isAuthor = useMemo(() => {
    console.log("Checking isAuthor:", {
      isAuthenticated,
      currentUserSocialProfileId: currentUser?.socialProfile?.id,
      projectAuthorProfileId: project?.authorProfile?.id,
      isAuthor: project?.authorProfile?.id === currentUser?.socialProfile?.id
    });
    if (!isAuthenticated || !currentUser?.socialProfile?.id || !project?.authorProfile?.id) return false;
    return project.authorProfile.id === currentUser.socialProfile.id;
  }, [isAuthenticated, currentUser?.socialProfile?.id, project?.authorProfile?.id]);

  const handleUpdateProject = useCallback(async (data: Partial<{
    title: string;
    description: string;
    categories: string[];
    featured: boolean;
    language: string;
    participantProfileIds: string[];
    roadmapSteps: RoadmapStepDTO[];
  }>) => {
    if (!project) return;
    try {
      await api(`/posts/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      await queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({
        title: "Project updated",
        description: "The project has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  }, [id, project, toast, token, queryClient]);

  const handleUpdateFeaturedImage = useCallback(async (file: File, altText?: string) => {
    if (!project) return;
    try {
      const formData = new FormData();
      formData.append("image", file);
      if (altText) {
        formData.append("altText", altText);
      }

      await api(`/posts/${id}/featured-image`, {
        method: 'PATCH',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({
        title: "Image updated",
        description: "The featured image has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update featured image",
        variant: "destructive",
      });
    }
  }, [id, project, toast, token, queryClient]);

  const handleUploadAttachment = useCallback(async (file: File) => {
    if (!project) return;
    try {
      const formData = new FormData();
      formData.append("file", file);

      await api(`/posts/projects/${id}/attachments`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({
        title: "Attachment uploaded",
        description: "The attachment has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload attachment",
        variant: "destructive",
      });
    }
  }, [id, project, toast, token, queryClient]);

  const handleDeleteAttachment = useCallback(async (attachmentId: string) => {
    if (!project) return;
    try {
      await api(`/posts/projects/${id}/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({
        title: "Attachment deleted",
        description: "The attachment has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete attachment",
        variant: "destructive",
      });
    }
  }, [id, project, toast, token, queryClient]);

  const handleAddParticipant = useCallback(async (profileId: string) => {
    if (!project) return;
    try {
      await api.post(`/posts/projects/${id}/participants/${profileId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({
        title: "Participant added",
        description: "The participant has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add participant",
        variant: "destructive",
      });
    }
  }, [id, project, toast, token, queryClient]);

  const handleRemoveParticipant = useCallback(async (profileId: string) => {
    if (!project) return;
    try {
      await api.delete(`/posts/projects/${id}/participants/${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({
        title: "Participant removed",
        description: "The participant has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove participant",
        variant: "destructive",
      });
    }
  }, [id, project, toast, token, queryClient]);

  const handleUpdateRoadmapStep = useCallback(async (stepId: string, data: Partial<RoadmapStepDTO>) => {
    if (!project) return;
    try {
      await api.patch(`/posts/projects/${id}/roadmap-steps/${stepId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({
        title: "Step updated",
        description: "The roadmap step has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update roadmap step",
        variant: "destructive",
      });
    }
  }, [id, project, toast, token, queryClient]);

  const handleAddRoadmapStep = useCallback(async (data: Omit<RoadmapStepDTO, "id" | "linkedPostId">) => {
    if (!project) return;
    try {
      await api.post(`/posts/projects/${id}/roadmap-steps`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({
        title: "Step added",
        description: "The roadmap step has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add roadmap step",
        variant: "destructive",
      });
    }
  }, [id, project, toast, token, queryClient]);

  const handleDeleteRoadmapStep = useCallback(async (stepId: string) => {
    if (!project) return;
    try {
      await api.delete(`/posts/projects/${id}/roadmap-steps/${stepId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({
        title: "Step deleted",
        description: "The roadmap step has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete roadmap step",
        variant: "destructive",
      });
    }
  }, [id, project, toast, token, queryClient]);

  const handleLinkPost = useCallback(async (stepId: string, postId: string) => {
    if (!project) return;
    try {
      await api.post(`/posts/projects/${id}/roadmap-steps/${stepId}/posts/${postId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({
        title: "Post linked",
        description: "The post has been linked to the step successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to link post",
        variant: "destructive",
      });
    }
  }, [id, project, toast, token, queryClient]);

  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [editCategoriesOpen, setEditCategoriesOpen] = useState(false);
  const [addParticipantOpen, setAddParticipantOpen] = useState(false);
  const [editStepOpen, setEditStepOpen] = useState(false);
  const [linkPostOpen, setLinkPostOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<RoadmapStepDTO | undefined>();
  const [selectedStepForLink, setSelectedStepForLink] = useState<string | undefined>();

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <Card className="p-6">
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container max-w-4xl py-8">
        <Card className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-destructive">Error Loading Project</h1>
            <p className="text-muted-foreground mt-2">
              Failed to load the project. Please try again later.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <BackButton />
      <EditProjectDialog
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
        title={project.title}
        description={project.description}
        onSave={(data) => handleUpdateProject(data)}
      />
      <EditCategoriesDialog
        open={editCategoriesOpen}
        onOpenChange={setEditCategoriesOpen}
        categories={project.categories}
        onSave={(categories) => handleUpdateProject({ categories })}
      />
      <AddParticipantDialog
        open={addParticipantOpen}
        onOpenChange={setAddParticipantOpen}
        onAdd={handleAddParticipant}
      />
      <EditRoadmapStepDialog
        open={editStepOpen}
        onOpenChange={(open) => {
          setEditStepOpen(open);
          if (!open) {
            setSelectedStep(undefined);
          }
        }}
        step={selectedStep}
        onSave={(data) => {
          if (selectedStep) {
            handleUpdateRoadmapStep(selectedStep.id!, data);
          } else {
            handleAddRoadmapStep(data);
          }
        }}
      />
      <LinkPostDialog
        open={linkPostOpen}
        onOpenChange={(open) => {
          setLinkPostOpen(open);
          if (!open) {
            setSelectedStepForLink(undefined);
          }
        }}
        onLink={(postId) => {
          if (selectedStepForLink) {
            handleLinkPost(selectedStepForLink, postId);
          }
        }}
      />
      <Card className="p-6">
        <div className="relative">
          {project.featuredImageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={project.featuredImageUrl}
                alt={project.featuredImageAlt || project.title}
                className="w-full h-auto object-cover"
              />
              {isAuthor && (
                <div className="absolute top-2 right-2">
                  <label htmlFor="featured-image" className="cursor-pointer">
                    <div className="bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90 p-2 rounded-lg">
                      <Pencil className="h-4 w-4" />
                    </div>
                    <input
                      type="file"
                      id="featured-image"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUpdateFeaturedImage(file);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          )}
          {!project.featuredImageUrl && isAuthor && (
            <div className="mb-6">
              <label
                htmlFor="featured-image"
                className="block w-full rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center cursor-pointer hover:border-muted-foreground/40 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload featured image
                  </span>
                </div>
                <input
                  type="file"
                  id="featured-image"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleUpdateFeaturedImage(file);
                    }
                  }}
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={project.authorProfile.avatarURL}
                    alt={project.authorProfile.username}
                  />
                  <AvatarFallback>
                    {project.authorProfile.firstName?.[0]}
                    {project.authorProfile.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <Link 
                    href={`/profile/${project.authorProfile.username}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {project.authorProfile.username}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <ShareButton url={window.location.href} />
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-2">
                <Tags className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {project.categories && project.categories.length > 0 ? (
                    project.categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No categories</span>
                  )}
                </div>
              </div>
              {isAuthor && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-2"
                  onClick={() => setEditCategoriesOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          {isAuthor && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditProjectOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Attachments</h2>
            {isAuthor && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      handleUploadAttachment(file);
                    }
                  };
                  input.click();
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Attachment
              </Button>
            )}
          </div>
          <div className="grid gap-3">
            {project.attachments?.map((attachment) => (
              <div key={attachment.id} className="flex items-center p-3 rounded-lg border group">
                <a
                  href={attachment.cloudinaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center flex-1"
                >
                  <FileIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{attachment.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {(attachment.fileSize / 1024).toFixed(1)} KB • {formatDistanceToNow(new Date(attachment.uploadedAt))} ago
                    </p>
                  </div>
                </a>
                {isAuthor && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteAttachment(attachment.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Roadmap</h2>
            {isAuthor && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedStep(undefined);
                  setEditStepOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            )}
          </div>
          <div className="relative">
            <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gray-200" />
            
            <div className="space-y-6">
              {project.roadmapSteps
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((step) => (
                <div key={step.id} className="flex items-start space-x-4 relative group">
                  {isAuthor ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer">
                        {getStepIcon(step.status)}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => updateStepStatus(step.id, "TODO")}>
                          <Circle className="h-4 w-4 mr-2" />
                          Not Started
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStepStatus(step.id, "IN_PROGRESS")}>
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStepStatus(step.id, "COMPLETED")}>
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStepStatus(step.id, "BLOCKED")}>
                          <XCircle className="h-4 w-4 mr-2 text-red-500" />
                          Blocked
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div>{getStepIcon(step.status)}</div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{step.title}</h3>
                      {isAuthor && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6"
                          onClick={() => {
                            setSelectedStep(step);
                            setEditStepOpen(true);
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={
                        step.status === "COMPLETED" ? "default" :
                        step.status === "IN_PROGRESS" ? "secondary" : "outline"
                      }>
                        {step.status.replace("_", " ")}
                      </Badge>
                      {step.linkedPost && (
                        <Link
                          href={`/${step.linkedPost.type.toLowerCase()}/${step.linkedPost.id}`}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          View {step.linkedPost.type.toLowerCase()}
                        </Link>
                      )}
                      {isAuthor && !step.linkedPost && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6"
                          onClick={() => {
                            setSelectedStepForLink(step.id);
                            setLinkPostOpen(true);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Link Post
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(step.createdAt))} ago
                      </span>
                      {isAuthor && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 ml-auto"
                          onClick={() => handleDeleteRoadmapStep(step.id!)}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Participants ({project.participants.length})</span>
            </div>
            {isAuthor && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAddParticipantOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Participant
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {project.participants.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-2 group">
                <Avatar>
                  <AvatarImage src={participant.avatarURL} alt={`${participant.firstName} ${participant.lastName}`} />
                  <AvatarFallback>{participant.firstName[0]}{participant.lastName[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{participant.firstName} {participant.lastName}</span>
                {isAuthor && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6"
                    onClick={() => handleRemoveParticipant(participant.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
