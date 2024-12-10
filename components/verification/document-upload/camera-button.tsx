"use client";

import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface CameraButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function CameraButton({ onClick, disabled }: CameraButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-32"
      onClick={onClick}
      disabled={disabled}
    >
      <Camera className="h-6 w-6 mr-2" />
      Use Camera
    </Button>
  );
}