"use client";

import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  disabled?: boolean;
}

export function UploadButton({ id, onChange, accept, disabled }: UploadButtonProps) {
  return (
    <div>
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
        id={id}
        multiple
        disabled={disabled}
      />
      <Label
        htmlFor={id}
        className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
      >
        <Upload className="h-6 w-6 mb-2" />
        <span className="text-sm">Upload Files</span>
      </Label>
    </div>
  );
}