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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface EditCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSave: (categories: string[]) => void;
}

export function EditCategoriesDialog({
  open,
  onOpenChange,
  categories,
  onSave,
}: EditCategoriesDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(categories);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // In a real app, you would want to validate this category against a list of available categories
      // For now, we'll just create a new one with a random ID
      setSelectedCategories([
        ...selectedCategories,
        { id: Math.random().toString(), name: newCategory.trim() },
      ]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat.id !== categoryId));
  };

  const handleSave = () => {
    onSave(selectedCategories.map((cat) => cat.name));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Categories</DialogTitle>
          <DialogDescription>
            Add or remove categories for your project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {category.name}
                <button
                  onClick={() => handleRemoveCategory(category.id)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="category" className="sr-only">
                Add category
              </Label>
              <Input
                id="category"
                placeholder="Add a category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
            </div>
            <Button onClick={handleAddCategory}>Add</Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
