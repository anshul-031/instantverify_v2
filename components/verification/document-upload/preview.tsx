"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DocumentPreviewProps {
  file: File;
  onRemove: () => void;
  isSubmitting?: boolean;
}

export function DocumentPreview({ file, onRemove, isSubmitting }: DocumentPreviewProps) {
  const url = URL.createObjectURL(file);

  return (
    <div className="relative">
      {file.type.startsWith('image/') ? (
        <img
          src={url}
          alt={file.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">{file.name}</p>
        </div>
      )}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onRemove}
        disabled={isSubmitting}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}