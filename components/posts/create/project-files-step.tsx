"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProjectFilesStepProps {
  projectId: string;
  onSkip?: () => void;
  onComplete?: () => void;
}

export function ProjectFilesStep({ projectId, onSkip, onComplete }: ProjectFilesStepProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Upload featured image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        
        await api(`/posts/${projectId}/featured-image`, {
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
        
        await api(`/posts/projects/${projectId}/attachments`, {
          method: "POST",
          body: formData,
          headers: {
            // Remove Content-Type to let the browser set it with the boundary
            "Content-Type": undefined,
          },
        });
      }

      toast({
        title: "Success",
        description: "Project files uploaded successfully",
      });

      onComplete?.();
      router.push(`/projects/${projectId}`);
      router.refresh();
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onSkip?.();
    router.push(`/projects/${projectId}`);
    router.refresh();
  };

  const canSubmit = selectedImage || selectedAttachment;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Project Files</CardTitle>
        <CardDescription>
          Add a featured image and attachments to your project. This step is optional and can be skipped.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUpload
          label="Featured Image"
          onFileSelect={(file) => setSelectedImage(file)}
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
        />

        <FileUpload
          label="Attachment"
          onFileSelect={(file) => setSelectedAttachment(file)}
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
          maxSize={10 * 1024 * 1024} // 10MB
          preview={false}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Files"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
