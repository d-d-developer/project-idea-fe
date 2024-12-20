"use client";

import { useCategories } from "@/hooks/use-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";

interface CategorySelectProps {
  value?: string | string[];
  onValueChange: (value: string | string[]) => void;
  multiple?: boolean;
}

export function CategorySelect({ value, onValueChange, multiple = false }: CategorySelectProps) {
  const { categories, isLoading, error } = useCategories();

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Category</Label>
        <div className="text-sm text-destructive">Failed to load categories</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Category</Label>
        {multiple ? (
          <div className="h-9 rounded-md border border-input bg-muted px-3 py-1">
            Loading categories...
          </div>
        ) : (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Loading categories..." />
            </SelectTrigger>
          </Select>
        )}
      </div>
    );
  }

  const categoryOptions = categories?.map((category) => ({
    value: category.id,
    label: category.name,
  })) || [];

  return (
    <div className="space-y-2">
      <Label>Category{multiple ? " (Select multiple)" : ""}</Label>
      {multiple ? (
        <MultiSelect
          options={categoryOptions}
          selected={Array.isArray(value) ? value : []}
          onChange={(values) => onValueChange(values)}
          placeholder="Select categories..."
        />
      ) : (
        <Select 
          value={typeof value === 'string' ? value : undefined} 
          onValueChange={(val) => onValueChange(val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
