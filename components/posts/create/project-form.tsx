"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CategorySelect } from "@/components/category-select";
import { UserSelect } from "@/components/user-select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Link as LinkIcon, Loader2, ArrowLeft, ArrowRight, GripVertical } from "lucide-react";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostSelect } from "@/components/post-select";
import { useSession } from "next-auth/react";
import { FileUpload } from "@/components/file-upload";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const roadmapStepSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().optional(),
  orderIndex: z.number(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
  linkedPostType: z.enum(["NONE", "FUNDRAISER", "INQUIRY"]),
  linkedPostId: z.string().uuid().optional(),
  dependenciesFulfilled: z.boolean().optional(),
});

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  featured: z.boolean(),
  language: z.string(),
  roadmapSteps: z.array(roadmapStepSchema).min(1, "At least one roadmap step is required"),
  participantProfileIds: z.array(z.string().uuid()).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSuccess?: () => void;
}

interface SortableRoadmapStepProps {
  id: number;
  step: {
    title: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "COMPLETED";
    linkedPostType?: "NONE" | "FUNDRAISER" | "INQUIRY";
    linkedPostId?: string;
  };
  index: number;
  currentUser: any;
  updateStep: (index: number, field: string, value: any) => void;
  removeStep: (index: number) => void;
}

function SortableRoadmapStep({ id, step, index, currentUser, updateStep, removeStep }: SortableRoadmapStepProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex-shrink-0 mt-1">
        <button
          type="button"
          className="cursor-grab touch-none p-2 hover:bg-gray-50 rounded-md transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="space-y-4">
          {/* Step Title and Delete Button */}
          <div className="flex items-start gap-2">
            <div className="flex-grow">
              <Label htmlFor={`step-title-${index}`} className="text-sm font-medium text-gray-700 mb-1.5 block">
                Step Title
              </Label>
              <Input
                id={`step-title-${index}`}
                placeholder="Enter step title..."
                value={step.title}
                onChange={(e) => updateStep(index, "title", e.target.value)}
                className="font-medium"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeStep(index)}
              className="h-8 w-8 mt-6"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Step Description */}
          <div>
            <Label htmlFor={`step-desc-${index}`} className="text-sm font-medium text-gray-700 mb-1.5 block">
              Description
            </Label>
            <Textarea
              id={`step-desc-${index}`}
              placeholder="Describe this step..."
              value={step.description}
              onChange={(e) => updateStep(index, "description", e.target.value)}
              className="resize-none h-24"
            />
          </div>

          {/* Status and Links Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 block">
              Step Details
            </Label>
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Select */}
              <div className="w-[130px]">
                <Select
                  value={step.status}
                  onValueChange={(value) => updateStep(index, "status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">Todo</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Link Type Select */}
              <div className="w-[130px]">
                <Select
                  value={step.linkedPostType || "NONE"}
                  onValueChange={(value) => {
                    updateStep(index, "linkedPostType", value);
                    // Reset linkedPostId when changing type
                    updateStep(index, "linkedPostId", undefined);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Link type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">No Link</SelectItem>
                    <SelectItem value="FUNDRAISER">Fundraiser</SelectItem>
                    <SelectItem value="INQUIRY">Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Linked Post Select */}
              {step.linkedPostType && step.linkedPostType !== "NONE" && (
                <div className="flex-grow min-w-[200px]">
                  <PostSelect
                    value={step.linkedPostId}
                    onValueChange={(value) => updateStep(index, "linkedPostId", value)}
                    postType={step.linkedPostType}
                    username={currentUser?.username}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectForm({ onSuccess }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'details' | 'files'>('details');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const defaultValues = {
    title: '',
    description: '',
    categories: [],
    featured: false,
    language: 'en',
    participantProfileIds: [],
    roadmapSteps: [
      {
        title: "Project Setup",
        description: "Initial setup and planning of the project",
        orderIndex: 1,
        status: "TODO" as const,
        linkedPostType: "NONE" as const,
        linkedPostId: undefined,
      }
    ],
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  const { clearSavedData } = useFormPersistence(
    {
      formId: 'project-form',
      excludeFields: ['selectedImage', 'selectedAttachment'],
      debug: process.env.NODE_ENV === 'development',
    },
    setValue,
    watch,
    defaultValues
  );

  const [roadmapSteps, setRoadmapSteps] = useState(defaultValues.roadmapSteps);

  useEffect(() => {
    setValue('roadmapSteps', roadmapSteps);
  }, [roadmapSteps, setValue]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api("/users/me");
        const profileData = await api("/social-profiles/me");
        setCurrentUser({ ...userData.data, ...profileData.data });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const onSubmitDetails = async (data: ProjectFormData) => {
    try {
      setIsSubmitting(true);
      
      const projectData = {
        ...data,
        roadmapSteps: data.roadmapSteps.map(step => ({
          ...step,
          dependenciesFulfilled: true,
        })),
      };

      const response = await api("/posts/projects", {
        method: "POST",
        body: projectData,
      });

      setProjectId(response.data.id);
      setCurrentStep('files');
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitFiles = async () => {
    try {
      setIsSubmitting(true);

      if (!projectId) return;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        
        await api(`/posts/${projectId}/featured-image`, {
          method: "PATCH",
          body: formData,
          headers: {},
        });
      }

      if (selectedAttachment) {
        const formData = new FormData();
        formData.append("file", selectedAttachment);
        
        await api(`/posts/projects/${projectId}/attachments`, {
          method: "POST",
          body: formData,
          headers: {},
        });
      }

      // Clear saved form data after successful submission
      clearSavedData();

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      onSuccess?.();
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

  const handleSkipFiles = () => {
    if (!projectId) return;
    
    onSuccess?.();
    router.push(`/projects/${projectId}`);
    router.refresh();
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const activeIndex = active.id;
      const overIndex = over.id;
      
      setRoadmapSteps((steps) => {
        const newSteps = arrayMove(steps, activeIndex, overIndex).map((step, index) => ({
          ...step,
          orderIndex: index + 1,
        }));
        return newSteps;
      });
    }
  };

  const addRoadmapStep = () => {
    setRoadmapSteps([
      ...roadmapSteps,
      {
        title: "",
        description: "",
        orderIndex: roadmapSteps.length + 1,
        status: "TODO",
        linkedPostType: "NONE",
      },
    ]);
  };

  const removeRoadmapStep = (index: number) => {
    const newSteps = roadmapSteps.filter((_, i) => i !== index);
    // Update orderIndex for remaining steps
    newSteps.forEach((step, i) => {
      step.orderIndex = i + 1;
    });
    setRoadmapSteps(newSteps);
  };

  const updateRoadmapStep = (index: number, field: string, value: any) => {
    setRoadmapSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[index] = {
        ...newSteps[index],
        [field]: value,
        // Reset linkedPostId when changing linkedPostType to NONE
        ...(field === 'linkedPostType' && value === 'NONE' ? { linkedPostId: undefined } : {}),
      };
      return newSteps;
    });
  };

  const renderContent = () => {
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

          <div className="space-y-6">
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

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep('details')}
                disabled={isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkipFiles}
                  disabled={isSubmitting}
                >
                  Skip
                </Button>
                <Button
                  onClick={onSubmitFiles}
                  disabled={(!selectedImage && !selectedAttachment) || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload & Finish"
                  )}
                </Button>
              </div>
            </div>
          </div>
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Roadmap Steps</Label>
              <p className="text-sm text-muted-foreground">At least one step is required</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRoadmapStep}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={roadmapSteps.map((_, index) => index)}
              strategy={verticalListSortingStrategy}
            >
              {roadmapSteps.map((step, index) => (
                <SortableRoadmapStep
                  key={`step-${index}`}
                  id={index}
                  step={step}
                  index={index}
                  currentUser={currentUser}
                  updateStep={updateRoadmapStep}
                  removeStep={removeRoadmapStep}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Project...
            </>
          ) : (
            "Continue to Files"
          )}
        </Button>
      </form>
    );
  };

  return renderContent();
}
