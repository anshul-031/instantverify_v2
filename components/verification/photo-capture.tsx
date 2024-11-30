"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, AlertTriangle } from "lucide-react";
import { CameraFeed } from "@/components/camera/camera-feed";

interface Props {
  onCapture: (photo: File) => void;
}

export function PersonPhotoCapture({ onCapture }: Props) {
  const [useCamera, setUseCamera] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleCapture = (file: File, previewUrl: string) => {
    setPreview(previewUrl);
    onCapture(file);
    setUseCamera(false);
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
          Please ensure the photo is clear, well-lit, and shows the full face
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        {!useCamera ? (
          <>
            <Button
              type="button"
              onClick={() => setUseCamera(true)}
              className="w-full"
            >
              <Camera className="h-4 w-4 mr-2" />
              {preview ? "Retake Photo" : "Start Camera"}
            </Button>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Captured photo"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
          </>
        ) : (
          <CameraFeed onCapture={handleCapture} />
        )}
      </Card>
    </div>
  );
}