"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Camera, Download, Repeat } from "lucide-react";
import { CameraCapture } from "@/components/verification/camera/camera-capture";

interface Props {
  onSubmit: (photo: File) => void;
  isSubmitting?: boolean;
}

export function PhotoCapture({ onSubmit, isSubmitting = false }: Props) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handleCapture = (file: File) => {
    setPhoto(file);
    setPhotoUrl(URL.createObjectURL(file));
  };

  const handleRetake = () => {
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }
    setPhoto(null);
    setPhotoUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photo) {
      onSubmit(photo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please capture a clear photo of yourself:
          <ul className="list-disc list-inside mt-2">
            <li>Ensure good lighting</li>
            <li>Look directly at the camera</li>
            <li>Keep a neutral expression</li>
            <li>Remove sunglasses or face coverings</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {photoUrl ? (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] max-w-md mx-auto rounded-lg overflow-hidden border-2 border-primary">
              <img
                src={photoUrl}
                alt="Captured Photo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleRetake}
                disabled={isSubmitting}
              >
                <Repeat className="h-4 w-4 mr-2" />
                Retake Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => photoUrl && window.open(photoUrl)}
                disabled={isSubmitting}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ) : (
          <CameraCapture
            onCapture={handleCapture}
            mode="person"
            aspectRatio={3/4}
          />
        )}
      </div>

      <Button
        type="submit"
        disabled={!photo || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Verification"}
      </Button>
    </form>
  );
}