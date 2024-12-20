"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Loader2, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
  preview?: boolean;
  currentImageUrl?: string | null;
  onRemove?: () => void;
}

export function FileUpload({
  onFileSelect,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  label = "Upload file",
  preview = true,
  currentImageUrl,
  onRemove,
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    // Preview for images
    if (preview && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadstart = () => setIsLoading(true);
      reader.onloadend = () => {
        setIsLoading(false);
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    setError(null);
    onFileSelect(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="max-w-xs"
          />
          {(previewUrl || isLoading) && (
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Preview area */}
      {preview && (
        <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
