"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface RoadmapStepDTO {
  id?: string;
  title: string;
  description: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
  linkedPostId?: string;
}

interface EditRoadmapStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step?: RoadmapStepDTO;
  onSave: (step: Omit<RoadmapStepDTO, "id" | "linkedPostId">) => void;
}

export function EditRoadmapStepDialog({
  open,
  onOpenChange,
  step,
  onSave,
}: EditRoadmapStepDialogProps) {
  const [title, setTitle] = useState(step?.title || "");
  const [description, setDescription] = useState(step?.description || "");
  const [status, setStatus] = useState<RoadmapStepDTO["status"]>(
    step?.status || "PLANNED"
  );

  const handleSave = () => {
    onSave({
      title,
      description,
      status,
    });
    onOpenChange(false);
    // Reset form
    if (!step) {
      setTitle("");
      setDescription("");
      setStatus("PLANNED");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{step ? "Edit Step" : "Add Step"}</DialogTitle>
          <DialogDescription>
            {step
              ? "Make changes to your roadmap step here."
              : "Add a new step to your project roadmap."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter step title..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this step involves..."
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as RoadmapStepDTO["status"])
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="PLANNED">Planned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title || !description}>
            {step ? "Save changes" : "Add step"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
