"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, AlertTriangle, X } from "lucide-react";
import { CameraFeed } from "@/components/camera/camera-feed";
import Image from "next/image";

interface Props {
  onCapture: (photo: File) => void;
  existingPhoto?: File;
}

export function PersonPhotoCapture({ onCapture, existingPhoto }: Props) {
  const [useCamera, setUseCamera] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleCapture = (file: File, previewUrl: string) => {
    setPreview(previewUrl);
    onCapture(file);
    setUseCamera(false);
  };

  const removePhoto = () => {
    setPreview(null);
    onCapture(null as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Camera className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Person Photo</h2>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please ensure the photo is clear, well-lit, and shows your full face
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        {!useCamera ? (
          <div className="space-y-4">
            <Button
              type="button"
              onClick={() => setUseCamera(true)}
              className="w-full"
            >
              <Camera className="h-4 w-4 mr-2" />
              {preview ? "Retake Photo" : "Start Camera"}
            </Button>

            {preview && (
              <div className="relative">
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={preview}
                    alt="Captured photo"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <CameraFeed 
            onCapture={handleCapture}
            width={1280}
            height={720}
            facingMode="user"
          />
        )}
      </Card>
    </div>
  );
}