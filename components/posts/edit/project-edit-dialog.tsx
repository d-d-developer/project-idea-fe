"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CategorySelect } from "@/components/category-select";
import { UserSelect } from "@/components/user-select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { FileUpload } from "@/components/file-upload";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  featured: z.boolean(),
  language: z.string(),
  participantProfileIds: z.array(z.string().uuid()).optional(),
});

interface ProjectEditDialogProps {
  project: {
    id: string;
    title: string;
    description: string;
    featured: boolean;
    categories: Array<{
      id: string;
      name: string;
    }>;
    participants: Array<{
      id: string;
    }>;
    featuredImageUrl: string;
  };
  trigger: React.ReactNode;
}

export function ProjectEditDialog({ project, trigger }: ProjectEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const utils = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      featured: project.featured,
      categories: project.categories.map(cat => cat.id),
      language: "en",
      participantProfileIds: project.participants.map(p => p.id),
    },
  });

  const onSubmit = async (data: z.infer<typeof projectSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Update project details
      await api(`/posts/projects/${project.id}`, {
        method: "PATCH",
        body: data,
      });

      // Upload featured image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        
        await api(`/posts/${project.id}/featured-image`, {
          method: "PATCH",
          body: formData,
          headers: {
            // Remove Content-Type to let the browser set it with the boundary
            "Content-Type": undefined,
          },
        });
      }

      // Upload attachment if selected
      if (selectedAttachment) {
        const formData = new FormData();
        formData.append("file", selectedAttachment);
        
        await api(`/posts/projects/${project.id}/attachments`, {
          method: "POST",
          body: formData,
          headers: {
            // Remove Content-Type to let the browser set it with the boundary
            "Content-Type": undefined,
          },
        });
      }

      // Invalidate and refetch project data
      utils.invalidateQueries({ queryKey: ["project", project.id] });

      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Enter your project title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project idea in detail"
              className="h-32"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <FileUpload
            label="Featured Image"
            onFileSelect={(file) => setSelectedImage(file)}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            currentImageUrl={project.featuredImageUrl}
          />

          <FileUpload
            label="Attachment"
            onFileSelect={(file) => setSelectedAttachment(file)}
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
            maxSize={10 * 1024 * 1024} // 10MB
            preview={false}
          />

          <CategorySelect
            value={watch("categories")}
            onValueChange={(value) => setValue("categories", Array.isArray(value) ? value : [value])}
            multiple
          />
          {errors.categories && (
            <p className="text-sm text-red-500">{errors.categories.message}</p>
          )}

          <div className="space-y-2">
            <Label>Project Participants</Label>
            <UserSelect
              value={watch("participantProfileIds") || []}
              onValueChange={(value) => setValue("participantProfileIds", value)}
              multiple
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Featured Project</Label>
              <Switch
                id="featured"
                checked={watch("featured")}
                onCheckedChange={(checked) => setValue("featured", checked)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
