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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { api } from "@/lib/api";
import { CategorySelect } from "@/components/category-select";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { FundraiserFilesStep } from "./fundraiser-files-step";
import { ArrowRight } from "lucide-react";

const fundraiserSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(2000, "Description is too long"),
  targetAmount: z.number().min(100, "Target amount must be at least $100").max(1000000, "Target amount cannot exceed $1,000,000"),
  categories: z.array(z.string().uuid()).min(1, "At least one category is required"),
  featured: z.boolean().default(false),
  language: z.string().default("en"),
  featuredImage: z.string().optional(),
});

type FundraiserFormData = z.infer<typeof fundraiserSchema>;

interface FundraiserFormProps {
  onSuccess?: () => void;
}

export function FundraiserForm({ onSuccess }: FundraiserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fundraiserId, setFundraiserId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'details' | 'files'>('details');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FundraiserFormData>({
    resolver: zodResolver(fundraiserSchema),
    defaultValues: {
      featured: false,
      language: "en",
      targetAmount: 1000,
    },
  });

  const targetAmount = watch("targetAmount");

  const onSubmitDetails = async (data: FundraiserFormData) => {
    try {
      setIsSubmitting(true);
      
      const fundraiserData = {
        ...data,
      };

      const response = await api("/posts/fundraisers", {
        method: "POST",
        body: fundraiserData,
      });

      setFundraiserId(response.data.id);
      setCurrentStep('files');
    } catch (error: any) {
      console.error("Error creating fundraiser:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create fundraiser. Please try again.",
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

        <FundraiserFilesStep
          fundraiserId={fundraiserId!}
          onSkip={() => {
            router.push(`/fundraisers/${fundraiserId}`);
            router.refresh();
          }}
          onComplete={() => {
            router.push(`/fundraisers/${fundraiserId}`);
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
        <Label htmlFor="title">Campaign Title</Label>
        <Input
          id="title"
          placeholder="Enter your fundraiser title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Campaign Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your fundraising campaign"
          className="h-32"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Target Amount</Label>
          <span className="text-lg font-semibold">{formatCurrency(targetAmount)}</span>
        </div>
        <Slider
          min={100}
          max={1000000}
          step={100}
          value={[targetAmount]}
          onValueChange={([value]) => setValue("targetAmount", value)}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatCurrency(100)}</span>
          <span>{formatCurrency(1000000)}</span>
        </div>
        {errors.targetAmount && (
          <p className="text-sm text-red-500">{errors.targetAmount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <CategorySelect
          multiple
          value={watch("categories")}
          onValueChange={(categories) => setValue("categories", categories)}
        />
        {errors.categories && (
          <p className="text-sm text-red-500">{errors.categories.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={watch("featured")}
          onCheckedChange={(checked) => setValue("featured", checked)}
        />
        <Label htmlFor="featured">Featured</Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Next"}
      </Button>
    </form>
  );
}
