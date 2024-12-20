"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface InquiryFilesStepProps {
  inquiryId: string;
  onSkip?: () => void;
  onComplete?: () => void;
}

export function InquiryFilesStep({ inquiryId, onSkip, onComplete }: InquiryFilesStepProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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
        
        await api(`/posts/${inquiryId}/featured-image`, {
          method: "PATCH",
          body: formData,
          // Remove Content-Type to let the browser set it with the boundary
          headers: {},
        });
      }

      toast({
        title: "Success",
        description: "Inquiry files uploaded successfully",
      });

      onComplete?.();
      router.push(`/inquiries/${inquiryId}`);
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
    router.push(`/inquiries/${inquiryId}`);
    router.refresh();
  };

  const canSubmit = selectedImage;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Inquiry Image</CardTitle>
        <CardDescription>
          Add a featured image to your inquiry. This step is optional and can be skipped.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUpload
          label="Featured Image"
          onFileSelect={(file) => setSelectedImage(file)}
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
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
              "Upload Image"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
