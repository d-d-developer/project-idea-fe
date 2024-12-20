"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CategorySelect } from "@/components/category-select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { InquiryFilesStep } from "./inquiry-files-step";
import { ArrowRight } from "lucide-react";

const inquirySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(2000, "Description is too long"),
  professionalRole: z.string().min(1, "Professional role is required"),
  location: z.string().min(1, "Location is required"),
  categories: z.array(z.string().uuid()).min(1, "At least one category is required"),
  featured: z.boolean().default(false),
  language: z.string().default("en"),
  featuredImage: z.string().optional(),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  onSuccess?: () => void;
}

export function InquiryForm({ onSuccess }: InquiryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'details' | 'files'>('details');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      featured: false,
      language: "en",
    },
  });

  const onSubmitDetails = async (data: InquiryFormData) => {
    try {
      setIsSubmitting(true);
      
      const inquiryData = {
        ...data,
      };

      const response = await api("/posts/inquiries", {
        method: "POST",
        body: inquiryData,
      });

      setInquiryId(response.data.id);
      setCurrentStep('files');
    } catch (error: any) {
      console.error("Error creating inquiry:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 'files') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</div>
            <span>Details</span>
          </div>
          <ArrowRight className="w-4 h-4" />
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</div>
            <span>Files</span>
          </div>
        </div>

        <InquiryFilesStep
          inquiryId={inquiryId!}
          onSkip={() => {
            router.push(`/inquiries/${inquiryId}`);
            router.refresh();
          }}
          onComplete={() => {
            router.push(`/inquiries/${inquiryId}`);
            router.refresh();
          }}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</div>
          <span>Details</span>
        </div>
        <ArrowRight className="w-4 h-4" />
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">2</div>
          <span>Files</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="What are you looking for?"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide more details about your inquiry"
          className="h-32"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="professionalRole">Professional Role</Label>
        <Input
          id="professionalRole"
          placeholder="e.g. Senior Backend Developer"
          {...register("professionalRole")}
        />
        {errors.professionalRole && (
          <p className="text-sm text-red-500">{errors.professionalRole.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g. Remote - Europe"
          {...register("location")}
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <CategorySelect
          value={watch("categories")}
          onValueChange={(value) => setValue("categories", Array.isArray(value) ? value : [value])}
          multiple
        />
        {errors.categories && (
          <p className="text-sm text-red-500">{errors.categories.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="featured">Featured Inquiry</Label>
          <Switch
            id="featured"
            checked={watch("featured")}
            onCheckedChange={(checked) => setValue("featured", checked)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating Inquiry..." : "Create Inquiry"}
      </Button>
    </form>
  );
}
