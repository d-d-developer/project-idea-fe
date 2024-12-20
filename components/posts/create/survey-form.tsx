"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { CategorySelect } from "@/components/category-select";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { ArrowRight } from "lucide-react";
import { SurveyFilesStep } from "./survey-files-step";

const surveySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  isOpenEnded: z.boolean(),
  allowMultipleAnswers: z.boolean(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  featured: z.boolean(),
  language: z.string(),
});

type SurveyFormData = z.infer<typeof surveySchema>;

interface SurveyFormProps {
  onSuccess?: () => void;
}

export function SurveyForm({ onSuccess }: SurveyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState<string[]>([""]);
  const [currentStep, setCurrentStep] = useState<'details' | 'files'>('details');
  const [surveyId, setSurveyId] = useState<string | null>(null);

  const defaultValues = {
    isOpenEnded: true,
    categories: [],
    allowMultipleAnswers: false,
    featured: false,
    language: "en",
    title: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('survey-form-options');
        if (saved) {
          setOptions(JSON.parse(saved));
        }
      } catch {
        // If there's an error reading from localStorage, keep the default empty array
      }
    }
  }, []);

  const { clearSavedData } = useFormPersistence(
    {
      formId: 'survey-form',
      excludeFields: ['isOpenEnded'],
      debug: process.env.NODE_ENV === 'development',
    },
    setValue,
    watch,
    defaultValues
  );

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('survey-form-options', JSON.stringify(options));
      }
    }, 500);
    return () => clearTimeout(saveTimeout);
  }, [options]);

  const isOpenEnded = watch("isOpenEnded");

  const addOption = useCallback(() => {
    setOptions(prev => [...prev, ""]);
  }, []);

  const removeOption = useCallback((index: number) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSurveyTypeChange = useCallback((value: string) => {
    const isOpenEndedValue = value === "true";
    setValue("isOpenEnded", isOpenEndedValue);
    if (!isOpenEndedValue && options.length < 2) {
      setOptions(["Option A", "Option B"]);
    }
  }, [setValue, options.length]);

  const onSubmitDetails = async (data: SurveyFormData) => {
    try {
      setIsSubmitting(true);
      
      // Filter out empty options and include them in the survey data
      const validOptions = options.filter(opt => opt.trim() !== "");
      
      if (!data.isOpenEnded && validOptions.length < 2) {
        // toast({
        //   title: "Error",
        //   description: "Multiple choice surveys must have at least 2 options",
        //   variant: "destructive",
        // });
        return;
      }

      const surveyData = {
        ...data,
        options: !data.isOpenEnded ? validOptions : undefined,
      };

      const response = await api("/posts/surveys", {
        method: "POST",
        body: surveyData,
      });

      setSurveyId(response.data.id);
      setCurrentStep('files');
    } catch (error: any) {
      console.error("Error creating survey:", error);
      // toast({
      //   title: "Error",
      //   description: error.message || "Failed to create survey. Please try again.",
      //   variant: "destructive",
      // });
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

        <SurveyFilesStep
          surveyId={surveyId!}
          onSkip={() => {
            router.push(`/surveys/${surveyId}`);
            router.refresh();
          }}
          onComplete={() => {
            router.push(`/surveys/${surveyId}`);
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
          placeholder="Enter your survey title"
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
          placeholder="Describe what you want to learn from this survey"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <CategorySelect
        value={watch("categories")}
        onValueChange={(value) => setValue("categories", Array.isArray(value) ? value : [value])}
        multiple
      />
      {errors.categories && (
        <p className="text-sm text-red-500">{errors.categories.message}</p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="allowMultipleAnswers">Allow Multiple Answers</Label>
          <Switch
            id="allowMultipleAnswers"
            checked={watch("allowMultipleAnswers")}
            onCheckedChange={(checked) => setValue("allowMultipleAnswers", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="featured">Featured Survey</Label>
          <Switch
            id="featured"
            checked={watch("featured")}
            onCheckedChange={(checked) => setValue("featured", checked)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Survey Type</Label>
        <RadioGroup
          defaultValue="true"
          onValueChange={handleSurveyTypeChange}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="open-ended" />
            <Label htmlFor="open-ended">Open Ended</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="multiple-choice" />
            <Label htmlFor="multiple-choice">Multiple Choice</Label>
          </div>
        </RadioGroup>
      </div>

      {!isOpenEnded && (
        <div className="space-y-4">
          <Label>Options</Label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addOption}
            className="w-full"
          >
            Add Option
          </Button>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating Survey..." : "Create Survey"}
      </Button>
    </form>
  );
}
